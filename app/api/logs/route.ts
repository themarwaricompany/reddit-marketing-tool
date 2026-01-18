import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'data', 'logs');
const LOGS_FILE = path.join(LOGS_DIR, 'activity.json');

export interface LogEntry {
    id: string;
    type: 'post_generated' | 'reply_generated' | 'conversation_search' | 'subreddit_discovered' | 'post_copied' | 'error';
    timestamp: string;
    data: Record<string, any>;
}

async function ensureLogsDir() {
    try {
        await fs.access(LOGS_DIR);
    } catch {
        await fs.mkdir(LOGS_DIR, { recursive: true });
    }
}

async function getLogs(): Promise<LogEntry[]> {
    await ensureLogsDir();
    try {
        const data = await fs.readFile(LOGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<LogEntry> {
    const logs = await getLogs();
    const newEntry: LogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...entry,
    };
    logs.push(newEntry);

    // Keep only last 500 entries
    const trimmedLogs = logs.slice(-500);
    await fs.writeFile(LOGS_FILE, JSON.stringify(trimmedLogs, null, 2));

    return newEntry;
}

// GET - Retrieve logs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');

        let logs = await getLogs();

        // Filter by type if specified
        if (type) {
            logs = logs.filter(l => l.type === type);
        }

        // Sort by newest first and limit
        logs = logs.reverse().slice(0, limit);

        // Calculate stats
        const stats = {
            total: logs.length,
            postsGenerated: logs.filter(l => l.type === 'post_generated').length,
            repliesGenerated: logs.filter(l => l.type === 'reply_generated').length,
            conversationSearches: logs.filter(l => l.type === 'conversation_search').length,
            errors: logs.filter(l => l.type === 'error').length,
        };

        return NextResponse.json({
            success: true,
            logs,
            stats,
        });
    } catch (error) {
        console.error('Failed to get logs:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to get logs' },
            { status: 500 }
        );
    }
}

// POST - Add a new log entry
export async function POST(request: NextRequest) {
    try {
        const { type, data } = await request.json();

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        const entry = await addLog({ type, data });

        return NextResponse.json({
            success: true,
            entry,
        });
    } catch (error) {
        console.error('Failed to add log:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to add log' },
            { status: 500 }
        );
    }
}

// Helper function to be called from other API routes
export async function logActivity(type: LogEntry['type'], data: Record<string, any>) {
    try {
        await addLog({ type, data });
    } catch (e) {
        console.error('Failed to log activity:', e);
    }
}
