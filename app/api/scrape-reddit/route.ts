import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { queries, maxPosts = 50, scrapeComments = false } = await request.json();

        const apifyToken = process.env.APIFY_API_KEY;
        if (!apifyToken) {
            return NextResponse.json({ error: 'Apify API key not configured' }, { status: 500 });
        }

        const response = await fetch(
            `https://api.apify.com/v2/acts/fatihtahta~reddit-scraper-search-fast/run-sync-get-dataset-items?token=${apifyToken}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    includeNsfw: false,
                    maxComments: scrapeComments ? 100 : 0,
                    maxPosts: Math.max(maxPosts, 10),
                    queries: queries,
                    scrapeComments: scrapeComments,
                    sort: 'relevance',
                    timeframe: 'week',
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Apify API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Reddit scraping error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to scrape Reddit' },
            { status: 500 }
        );
    }
}
