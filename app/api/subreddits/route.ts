import { NextResponse } from 'next/server';
import { SUBREDDITS } from '@/lib/subreddits';

export async function GET() {
    return NextResponse.json({
        subreddits: SUBREDDITS,
        lastUpdated: new Date().toISOString(),
    });
}
