
import { useState } from 'react';
import {
    Search,
    Loader2,
    TrendingUp,
    Plus,
    Globe,
    Trash2,
    Hash,
    Info,
    ExternalLink
} from 'lucide-react';
import { SubredditConfig } from '@/lib/types';

interface SubredditsViewProps {
    subreddits: SubredditConfig[];
    setSubreddits: React.Dispatch<React.SetStateAction<SubredditConfig[]>>;
}

export function SubredditsView({ subreddits, setSubreddits }: SubredditsViewProps) {
    // Local state
    const [discoverKeywords, setDiscoverKeywords] = useState('');
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [discoveredSubs, setDiscoveredSubs] = useState<SubredditConfig[]>([]);
    const [newSubName, setNewSubName] = useState('');
    const [newSubCategory, setNewSubCategory] = useState<'primary' | 'secondary' | 'niche'>('secondary');
    const [isAddingManual, setIsAddingManual] = useState(false);

    // Computed custom subreddits (this is a bit of a hack since we don't store "isCustom" flag, 
    // but we can assume manually added ones are in the list.
    // Actually, the main page didn't differentiate much except in the "Custom Subreddits" view.
    // For this view, we'll just show all subreddits.
    // Or we can assume all in `subreddits` are "My Subreddits".

    const discoverSubreddits = async () => {
        if (!discoverKeywords.trim()) return;

        setIsDiscovering(true);
        setDiscoveredSubs([]);

        try {
            const response = await fetch('/api/discover-subreddits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keywords: discoverKeywords.split(',').map(k => k.trim()).filter(k => k),
                    limit: 20,
                }),
            });

            const data = await response.json();
            if (data.success && data.subreddits) {
                setDiscoveredSubs(data.subreddits);
            }
        } catch (error) {
            console.error('Failed to discover subreddits:', error);
        }

        setIsDiscovering(false);
    };

    const addSubredditToList = (sub: SubredditConfig) => {
        setSubreddits(prev => {
            if (prev.find(s => s.name === sub.name)) return prev;
            return [...prev, sub];
        });
        setDiscoveredSubs(prev => prev.filter(s => s.name !== sub.name));
    };

    const removeSubreddit = (name: string) => {
        setSubreddits(prev => prev.filter(s => s.name !== name));
    };

    const addManualSubreddit = async () => {
        if (!newSubName.trim()) return;

        setIsAddingManual(true);
        const cleanName = newSubName.replace(/^r\//, '').trim();

        const newSub: SubredditConfig = {
            name: cleanName,
            displayName: `r/${cleanName}`,
            subscribers: 'Unknown',
            description: 'Manually added subreddit',
            category: newSubCategory,
            rules: [],
            allowsProductMention: false,
            allowsLinks: false,
            bestPostTypes: ['storytelling', 'experience'],
            topPostPatterns: [],
            titleFormulas: [],
            postingFrequency: 'varies',
        };

        setSubreddits(prev => {
            if (prev.find(s => s.name === cleanName)) return prev;
            return [...prev, newSub];
        });

        setNewSubName('');
        setIsAddingManual(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Left Column - Discover */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">Discover Subreddits</h2>
                    <p className="text-muted-foreground text-base mb-8">Find relevant communities based on keywords</p>
                </div>

                {/* Keyword Discovery */}
                <div className="card">
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                        <Search className="w-4 h-4 mr-2" />
                        Enter Keywords
                    </label>
                    <div className="relative mb-3">
                        <input
                            type="text"
                            className="input pl-4 pr-12"
                            placeholder="e.g., lead generation, SaaS, B2B sales, startup"
                            value={discoverKeywords}
                            onChange={(e) => setDiscoverKeywords(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && discoverSubreddits()}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Enter comma-separated keywords to find relevant subreddits
                    </p>
                    <button
                        onClick={discoverSubreddits}
                        disabled={isDiscovering || !discoverKeywords.trim()}
                        className="btn-primary w-full justify-center h-11 shadow-lg shadow-primary/25"
                    >
                        {isDiscovering ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Discovering...</>
                        ) : (
                            <><Globe className="w-5 h-5" /> Discover Subreddits</>
                        )}
                    </button>
                </div>

                {/* Discovered Results */}
                {discoveredSubs.length > 0 && (
                    <div className="card animate-scale-in">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Discovered Subreddits ({discoveredSubs.length})
                        </h3>
                        <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto pr-2">
                            {discoveredSubs.map(sub => (
                                <div key={sub.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border">
                                    <div className="flex-1 min-w-0 mr-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-foreground">{sub.displayName}</span>
                                            <span className="text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full border border-border">{sub.subscribers}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{sub.description}</p>
                                        <div className="flex gap-2 mt-2.5">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.allowsProductMention ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                {sub.allowsProductMention ? 'Promo OK' : 'No Promo'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">{sub.category}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addSubredditToList(sub)}
                                        className="btn-primary h-9 w-9 p-0 rounded-full flex items-center justify-center flex-shrink-0"
                                        title="Add to my list"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isDiscovering && (
                    <div className="card text-center py-16 flex flex-col items-center border-dashed">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <p className="text-lg font-medium">Analyzing Reddit communities...</p>
                        <p className="text-sm text-muted-foreground mt-1">AI is finding the best matches for your keywords</p>
                    </div>
                )}
            </div>

            {/* Right Column - Manual Add & Current List */}
            <div className="space-y-6">
                {/* Manual Add */}
                <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add Subreddit Manually
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Subreddit Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">r/</span>
                                <input
                                    type="text"
                                    className="input pl-8"
                                    placeholder="entrepreneur"
                                    value={newSubName}
                                    onChange={(e) => setNewSubName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addManualSubreddit()}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['primary', 'secondary', 'niche'] as const).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setNewSubCategory(cat)}
                                        className={`px-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${newSubCategory === cat
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={addManualSubreddit}
                            disabled={isAddingManual || !newSubName.trim()}
                            className="btn-primary w-full justify-center h-11 mt-2"
                        >
                            {isAddingManual ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Adding...</>
                            ) : (
                                <><Plus className="w-5 h-5" /> Add Subreddit</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Current List */}
                <div className="card">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        My Subreddits ({subreddits.length})
                    </h3>

                    {subreddits.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg border-muted">
                            No subreddits added yet.
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {(['primary', 'secondary', 'niche'] as const).map(category => {
                                const catSubs = subreddits.filter(s => s.category === category);
                                if (catSubs.length === 0) return null;
                                return (
                                    <div key={category}>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                                            {category} <span className="opacity-50">({catSubs.length})</span>
                                        </p>
                                        <div className="grid gap-2">
                                            {catSubs.map(sub => (
                                                <div key={sub.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-all duration-200 group">
                                                    <span className="font-medium text-sm pl-1">{sub.displayName}</span>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <a
                                                            href={`https://reddit.com/${sub.displayName}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-background"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                        <button
                                                            onClick={() => removeSubreddit(sub.name)}
                                                            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
