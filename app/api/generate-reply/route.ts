import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildReplyGenerationPrompt } from '@/lib/prompts';
import { getSubredditByName, SUBREDDITS } from '@/lib/subreddits';

export async function POST(request: NextRequest) {
    try {
        const {
            postUrl,
            postTitle,
            postBody,
            subreddit: subredditName,
            tone = 'helpful',
            context
        } = await request.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        if (!postTitle?.trim()) {
            return NextResponse.json({ error: 'Post title is required' }, { status: 400 });
        }

        if (!subredditName) {
            return NextResponse.json({ error: 'Subreddit name is required' }, { status: 400 });
        }

        const subreddit = getSubredditByName(subredditName) || {
            name: subredditName,
            displayName: `r/${subredditName}`,
            subscribers: 'Unknown',
            description: '',
            category: 'secondary' as const,
            rules: [],
            allowsProductMention: false,
            allowsLinks: false,
            requiresFlair: false,
            bestPostTypes: [],
            bestContentPillars: [],
            peakPostingTimes: [],
            postingFrequency: '',
            topPostPatterns: [],
            titleFormulas: [],
            avoidTopics: [],
        };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = buildReplyGenerationPrompt({
            originalTitle: postTitle,
            originalBody: postBody || '',
            subreddit,
            tone: tone as 'helpful' | 'insightful' | 'casual' | 'professional',
            context,
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the reply
        const replyMatch = text.match(/\*\*REPLY:\*\*\s*\n?([\s\S]*?)(?=\*\*TONE CHECK:|$)/i);
        const toneCheckMatch = text.match(/\*\*TONE CHECK:\*\*\s*(.*)/i);
        const valueAddedMatch = text.match(/\*\*VALUE ADDED:\*\*\s*(.*)/i);

        const reply = replyMatch?.[1]?.trim() || text;
        const toneCheck = toneCheckMatch?.[1]?.trim() || '';
        const valueAdded = valueAddedMatch?.[1]?.trim() || '';

        return NextResponse.json({
            success: true,
            reply: {
                id: `reply-${Date.now()}`,
                originalPostUrl: postUrl || '',
                originalPostTitle: postTitle,
                originalPostBody: postBody || '',
                subreddit: subredditName,
                reply,
                tone,
                toneCheck,
                valueAdded,
                createdAt: new Date().toISOString(),
                status: 'draft',
            },
        });
    } catch (error) {
        console.error('Reply generation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate reply' },
            { status: 500 }
        );
    }
}
