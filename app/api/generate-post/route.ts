import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPostGenerationPrompt } from '@/lib/prompts';
import { SUBREDDITS, getSubredditByName } from '@/lib/subreddits';
import { POST_TEMPLATES } from '@/lib/config';

export async function POST(request: NextRequest) {
    try {
        const {
            topic,
            subreddits: subredditNames,
            postType = 'storytelling',
            contentPillar,
            topPosts,
            generateVariations = false,
            variationCount = 3
        } = await request.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment');
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        if (!topic?.trim()) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        if (!subredditNames?.length) {
            return NextResponse.json({ error: 'At least one subreddit is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.0-flash which is the latest available model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const results = [];

        for (const subredditName of subredditNames) {
            const subreddit = getSubredditByName(subredditName);
            if (!subreddit) {
                results.push({
                    subreddit: subredditName,
                    error: `Subreddit ${subredditName} not found in configuration`,
                });
                continue;
            }

            try {
                const prompt = buildPostGenerationPrompt({
                    topic,
                    subreddit,
                    postType: postType as keyof typeof POST_TEMPLATES,
                    contentPillar,
                    topPosts,
                    generateVariations,
                });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Parse the generated content
                const titleMatch = text.match(/\*\*TITLE:\*\*\s*\n?([\s\S]*?)(?=\*\*BODY:|$)/i);
                const bodyMatch = text.match(/\*\*BODY:\*\*\s*\n?([\s\S]*?)(?=\*\*COMPLIANCE|---|\*\*VARIATION|$)/i);
                const complianceScoreMatch = text.match(/\*\*COMPLIANCE SCORE:\*\*\s*(\d+)/i);
                const complianceNotesMatch = text.match(/\*\*COMPLIANCE NOTES:\*\*\s*\n?([\s\S]*?)(?=---|$)/i);

                const title = titleMatch?.[1]?.trim() || '';
                const body = bodyMatch?.[1]?.trim() || '';
                const complianceScore = parseInt(complianceScoreMatch?.[1] || '0');
                const complianceNotes = complianceNotesMatch?.[1]
                    ?.split('\n')
                    .filter(n => n.trim().startsWith('-'))
                    .map(n => n.replace(/^-\s*/, '').trim()) || [];

                // Parse variations if generated
                const variations = [];
                if (generateVariations) {
                    const variationMatches = text.matchAll(/\*\*VARIATION \d+:\*\*\s*\n?([\s\S]*?)(?=\*\*VARIATION|---|\*\*COMPLIANCE|$)/gi);
                    for (const match of variationMatches) {
                        const varContent = match[1];
                        const varTitleMatch = varContent.match(/\*\*TITLE:\*\*\s*\n?(.*?)(?=\*\*BODY:|$)/i);
                        const varBodyMatch = varContent.match(/\*\*BODY:\*\*\s*\n?([\s\S]*?)$/i);
                        if (varTitleMatch || varBodyMatch) {
                            variations.push({
                                id: `var-${Date.now()}-${variations.length}`,
                                title: varTitleMatch?.[1]?.trim() || '',
                                body: varBodyMatch?.[1]?.trim() || varContent.trim(),
                                style: `Variation ${variations.length + 1}`,
                            });
                        }
                    }
                }

                results.push({
                    id: `post-${Date.now()}-${subredditName}`,
                    subreddit: subredditName,
                    title,
                    body,
                    postType,
                    contentPillar: contentPillar || null,
                    complianceScore,
                    complianceNotes,
                    createdAt: new Date().toISOString(),
                    status: 'draft',
                    variations,
                    subredditConfig: {
                        allowsProductMention: subreddit.allowsProductMention,
                        allowsLinks: subreddit.allowsLinks,
                        category: subreddit.category,
                    },
                    rawResponse: text,
                });
            } catch (error) {
                results.push({
                    subreddit: subredditName,
                    error: error instanceof Error ? error.message : 'Failed to generate post',
                });
            }
        }

        return NextResponse.json({
            success: true,
            posts: results,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Post generation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate posts' },
            { status: 500 }
        );
    }
}
