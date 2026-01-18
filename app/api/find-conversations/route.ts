import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildConversationScoringPrompt } from '@/lib/prompts';

export async function POST(request: NextRequest) {
    try {
        const {
            keywords,
            subreddits = [],
            maxResults = 20,
            minScore = 1
        } = await request.json();

        const apifyToken = process.env.APIFY_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        if (!apifyToken) {
            return NextResponse.json({ error: 'Apify API key not configured' }, { status: 500 });
        }

        if (!keywords?.length) {
            return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
        }

        // Build search queries
        const queries = keywords.flatMap((keyword: string) => {
            if (subreddits.length > 0) {
                return subreddits.map((sub: string) => `${keyword} subreddit:${sub}`);
            }
            return [keyword];
        });

        // Fetch posts from Apify
        const response = await fetch(
            `https://api.apify.com/v2/acts/fatihtahta~reddit-scraper-search-fast/run-sync-get-dataset-items?token=${apifyToken}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    includeNsfw: false,
                    maxComments: 10,
                    maxPosts: Math.max(maxResults, 10),
                    queries,
                    scrapeComments: true,
                    sort: 'relevance',
                    timeframe: 'week',
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Apify API error: ${response.statusText}`);
        }

        const posts = await response.json();

        // Filter by minimum score AND only include posts (items with titles, not comments)
        const filteredPosts = posts.filter((p: any) => {
            const hasTitle = p.title && p.title.trim().length > 0;
            const hasSubreddit = p.subreddit && p.subreddit.trim().length > 0;
            const meetsScore = (p.score || 0) >= minScore;
            const isPost = p.kind === 'post' || (hasTitle && hasSubreddit); // Filter out comments
            return isPost && meetsScore;
        });

        // If we have Gemini API, score the posts for relevance
        let scoredPosts = filteredPosts.map((p: any) => ({
            id: p.id || `post-${Date.now()}-${Math.random()}`,
            title: p.title || '',
            body: p.selftext || '',
            url: p.url || `https://reddit.com${p.permalink}`,
            subreddit: p.subreddit || '',
            author: p.author || '',
            score: p.score || 0,
            numComments: p.num_comments || 0,
            createdAt: (() => {
                try {
                    if (p.created_utc) {
                        const date = typeof p.created_utc === 'string'
                            ? new Date(p.created_utc)
                            : new Date(p.created_utc * 1000);
                        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                    }
                    if (p.createdAt) return p.createdAt;
                    return new Date().toISOString();
                } catch {
                    return new Date().toISOString();
                }
            })(),
            relevanceScore: 50, // Default
            suggestedAction: 'monitor' as const,
            keywords: keywords,
        }));

        // Use AI to score if available
        if (geminiKey && scoredPosts.length > 0) {
            try {
                const genAI = new GoogleGenerativeAI(geminiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

                const prompt = buildConversationScoringPrompt({
                    posts: scoredPosts.slice(0, 10).map((p: any) => ({
                        title: p.title,
                        body: p.body,
                        subreddit: p.subreddit,
                        score: p.score,
                    })),
                });

                const result = await model.generateContent(prompt);
                const responseText = await result.response.text();

                // Try to parse JSON from response
                const jsonMatch = responseText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const scores = JSON.parse(jsonMatch[0]);
                    scores.forEach((s: any, i: number) => {
                        if (scoredPosts[i]) {
                            scoredPosts[i].relevanceScore = s.total_score || 50;
                            scoredPosts[i].suggestedAction = s.suggested_action || 'monitor';
                            scoredPosts[i].replyAngle = s.reply_angle || '';
                            scoredPosts[i].aiKeywords = s.keywords || [];
                        }
                    });
                }
            } catch (e) {
                console.error('AI scoring failed, using default scores:', e);
            }
        }

        // Sort by relevance score
        scoredPosts.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);

        return NextResponse.json({
            success: true,
            conversations: scoredPosts,
            totalFound: posts.length,
            filtered: scoredPosts.length,
            searchedKeywords: keywords,
            searchedSubreddits: subreddits,
        });
    } catch (error) {
        console.error('Conversation finding error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to find conversations' },
            { status: 500 }
        );
    }
}
