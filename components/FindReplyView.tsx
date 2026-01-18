
import { useState } from 'react';
import {
    Search,
    Loader2,
    ExternalLink,
    Send,
    CheckCircle,
    Copy,
    TrendingUp,
    MessageSquare,
    Filter,
    Sparkles
} from 'lucide-react';

interface Conversation {
    id: string;
    title: string;
    body: string;
    url: string;
    subreddit: string;
    author: string;
    score: number;
    numComments: number;
    relevanceScore: number;
    suggestedAction: 'reply' | 'monitor' | 'ignore';
    replyAngle?: string;
}

interface GeneratedReply {
    id: string;
    reply: string;
    originalPostTitle: string;
    subreddit: string;
    tone: string;
    valueAdded: string;
}

interface FindReplyViewProps {
    copyToClipboard: (text: string, id: string) => void;
    copiedId: string | null;
}

export function FindReplyView({ copyToClipboard, copiedId }: FindReplyViewProps) {
    const [keywords, setKeywords] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [replyContext, setReplyContext] = useState('');
    const [replyTone, setReplyTone] = useState<'helpful' | 'insightful' | 'casual' | 'professional'>('helpful');
    const [generatedReply, setGeneratedReply] = useState<GeneratedReply | null>(null);
    const [isGeneratingReply, setIsGeneratingReply] = useState(false);

    // Helper for badges
    const getActionColor = (action: string) => {
        switch (action) {
            case 'reply': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'monitor': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const findConversations = async () => {
        if (!keywords.trim()) return;

        setIsSearching(true);
        setConversations([]);
        setSelectedConversation(null);
        setGeneratedReply(null);

        try {
            const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
            const response = await fetch('/api/find-conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keywords: keywordList,
                    maxResults: 30,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Failed to find conversations:', error);
        }

        setIsSearching(false);
    };

    const generateReply = async () => {
        if (!selectedConversation) return;

        setIsGeneratingReply(true);
        setGeneratedReply(null);

        try {
            const response = await fetch('/api/generate-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postUrl: selectedConversation.url,
                    postTitle: selectedConversation.title,
                    postBody: selectedConversation.body,
                    subreddit: selectedConversation.subreddit,
                    tone: replyTone,
                    context: replyContext || undefined,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setGeneratedReply(data.reply);
            }
        } catch (error) {
            console.error('Failed to generate reply:', error);
        }

        setIsGeneratingReply(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Left - Search & Results */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">Find & Reply</h2>
                    <p className="text-muted-foreground text-base mb-8">Discover relevant conversations and craft thoughtful replies</p>
                </div>

                {/* Search */}
                <div className="card">
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                        <Search className="w-4 h-4 mr-2" />
                        Search Keywords
                    </label>
                    <div className="relative mb-3">
                        <input
                            type="text"
                            className="input pl-10"
                            placeholder="luma events, event networking, attendee data (comma separated)"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && findConversations()}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                        Searching across all Reddit for high-intent conversations
                    </p>
                    <button
                        onClick={findConversations}
                        disabled={isSearching || !keywords.trim()}
                        className="btn-primary w-full justify-center h-11 shadow-lg shadow-primary/25"
                    >
                        {isSearching ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</>
                        ) : (
                            <><Search className="w-5 h-5" /> Find Conversations</>
                        )}
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {conversations.length > 0 && (
                        <div className="flex items-center justify-between px-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                Found {conversations.length} relevant conversations
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Filter className="w-3 h-3" />
                                <span>Sorted by relevance</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 custom-scrollbar max-h-[600px] overflow-y-auto pr-2">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`card cursor-pointer transition-all duration-200 hover:bg-muted/30 border-l-4 ${selectedConversation?.id === conv.id
                                    ? 'border-l-primary bg-muted/20 ring-1 ring-primary/20'
                                    : 'border-l-transparent hover:border-l-primary/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="font-medium line-clamp-2 text-base">{conv.title}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getActionColor(conv.suggestedAction)}`}>
                                        {conv.suggestedAction}
                                    </span>
                                </div>
                                {conv.body && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{conv.body}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        r/{conv.subreddit}
                                    </span>
                                    <span>Score: {conv.score}</span>
                                    <span>{conv.numComments} comments</span>
                                    <span className="text-primary font-medium">Relevance: {conv.relevanceScore}%</span>
                                </div>
                                {conv.replyAngle && (
                                    <div className="bg-muted/50 rounded-lg p-2 text-xs flex gap-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="text-muted-foreground italic">{conv.replyAngle}</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {conversations.length === 0 && !isSearching && (
                            <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
                                <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-muted-foreground font-medium">Enter keywords to start searching</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right - Reply Generator */}
            <div className="space-y-6">
                {selectedConversation ? (
                    <>
                        <div className="card border-primary/20 shadow-lg shadow-primary/5">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Target Post</h3>
                            <h4 className="font-bold text-lg mb-3">{selectedConversation.title}</h4>
                            {selectedConversation.body && (
                                <div className="text-sm text-muted-foreground mb-4 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar p-3 bg-muted/30 rounded-lg border border-border">
                                    {selectedConversation.body}
                                </div>
                            )}
                            <a
                                href={selectedConversation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                                View on Reddit <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        <div className="card">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Generate Reply
                            </h3>

                            <label className="block text-sm font-medium text-muted-foreground mb-2">Tone</label>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {(['helpful', 'insightful', 'casual', 'professional'] as const).map(tone => (
                                    <button
                                        key={tone}
                                        onClick={() => setReplyTone(tone)}
                                        className={`p-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 border ${replyTone === tone
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                            : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {tone}
                                    </button>
                                ))}
                            </div>

                            <label className="block text-sm font-medium text-muted-foreground mb-2">Additional Context (optional)</label>
                            <textarea
                                className="textarea mb-4 min-h-[100px]"
                                rows={3}
                                placeholder="Any specific angle or point you want to make..."
                                value={replyContext}
                                onChange={(e) => setReplyContext(e.target.value)}
                            />

                            <button
                                onClick={generateReply}
                                disabled={isGeneratingReply}
                                className="btn-primary w-full justify-center h-11 shadow-lg shadow-primary/20"
                            >
                                {isGeneratingReply ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                                ) : (
                                    <><Send className="w-5 h-5" /> Generate Reply</>
                                )}
                            </button>
                        </div>

                        {generatedReply && (
                            <div className="card animate-scale-in border-green-500/20 shadow-lg shadow-green-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-green-500 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Generated Reply
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(generatedReply.reply, generatedReply.id)}
                                            className="btn-secondary h-8 text-xs px-3"
                                        >
                                            {copiedId === generatedReply.id ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            <span className="ml-2">{copiedId === generatedReply.id ? 'Copied' : 'Copy'}</span>
                                        </button>
                                        <a
                                            href={selectedConversation.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary h-8 text-xs px-3"
                                        >
                                            Reply on Reddit <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                </div>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/50 p-4 rounded-xl border border-border">
                                    {generatedReply.reply}
                                </div>
                                {generatedReply.valueAdded && (
                                    <p className="text-xs text-muted-foreground mt-3 flex gap-2 items-center">
                                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                                        <span className="italic">Value add: {generatedReply.valueAdded}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="card h-full flex flex-col items-center justify-center text-center p-12 text-muted-foreground/50 border-dashed">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-semibold mb-2 text-foreground">Select a Conversation</h3>
                        <p className="max-w-xs mx-auto">
                            Search for relevant conversations and click one to generate a thoughtful reply
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
