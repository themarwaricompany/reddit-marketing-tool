import { useState } from 'react';
import {
    Sparkles,
    Loader2,
    CheckCircle,
    Copy,
    ExternalLink,
    Target,
    BookOpen,
    Users,
    Star,
    Info
} from 'lucide-react';

import { GeneratedPost, SubredditConfig } from '@/lib/types';
import ShimmerButton from "@/components/ui/shimmer-button";

interface GeneratePostViewProps {
    subreddits: SubredditConfig[];
    savePost: (post: GeneratedPost) => void;
    copyToClipboard: (text: string, id: string) => void;
    copiedId: string | null;
}

const CONTENT_PILLARS = [
    { id: 'event-networking', name: 'Event Networking', emoji: '🎯' },
    { id: 'lead-generation', name: 'Lead Generation', emoji: '🔥' },
    { id: 'product-insights', name: 'Product Insights', emoji: '💡' },
    { id: 'growth-tactics', name: 'Growth Tactics', emoji: '📈' },
    { id: 'founder-journey', name: 'Founder Journey', emoji: '🚀' },
];

const POST_TYPES = [
    { id: 'storytelling', name: 'Storytelling', emoji: '📖', desc: 'Personal journey/experience' },
    { id: 'experience', name: 'Experience', emoji: '💡', desc: 'What I learned' },
    { id: 'suggestion', name: 'Tips & Suggestions', emoji: '🎯', desc: 'Helpful recommendations' },
    { id: 'question', name: 'Discussion Question', emoji: '❓', desc: 'Engage the community' },
    { id: 'promotional', name: 'Soft Promotion', emoji: '📢', desc: 'Where allowed only' },
];

export function GeneratePostView({
    subreddits,
    savePost,
    copyToClipboard,
    copiedId
}: GeneratePostViewProps) {
    // Local state for generation
    const [topic, setTopic] = useState('');
    const [postType, setPostType] = useState('storytelling');
    const [contentPillar, setContentPillar] = useState('');
    const [generateVariations, setGenerateVariations] = useState(true);
    const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);
    const [activePostTab, setActivePostTab] = useState(0);

    const toggleSubreddit = (name: string) => {
        setSelectedSubreddits(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        );
    };

    const getComplianceColor = (score: number) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const generatePosts = async () => {
        if (!topic.trim() || selectedSubreddits.length === 0) return;

        setIsGenerating(true);
        setGeneratedPosts([]);

        try {
            const response = await fetch('/api/generate-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    subreddits: selectedSubreddits,
                    postType,
                    contentPillar: contentPillar || undefined,
                    generateVariations,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setGeneratedPosts(data.posts.filter((p: any) => !p.error));
            }
        } catch (error) {
            console.error('Failed to generate posts:', error);
        }

        setIsGenerating(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">Generate Posts</h2>
                    <p className="text-muted-foreground text-base mb-8">Create Reddit-ready content with your voice</p>
                </div>

                {/* Topic Input */}
                <div className="card group">
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-3 group-focus-within:text-primary transition-colors">
                        <Target className="w-4 h-4 mr-2" />
                        What do you want to share?
                    </label>
                    <textarea
                        className="textarea resize-none"
                        rows={5}
                        placeholder="E.g., I just helped a founder who was spending 3 hours researching Luma event attendees do it in 10 minutes. Here's the approach..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>

                {/* Content Pillar */}
                <div className="card">
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Content Pillar
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {CONTENT_PILLARS.map(pillar => (
                            <button
                                key={pillar.id}
                                onClick={() => setContentPillar(contentPillar === pillar.id ? '' : pillar.id)}
                                className={`p-3 rounded-xl text-sm text-left transition-all duration-200 border ${contentPillar === pillar.id
                                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <div className="text-lg mb-1">{pillar.emoji}</div>
                                <div className="font-medium">{pillar.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post Type */}
                <div className="card">
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Post Type
                    </label>
                    <div className="space-y-2">
                        {POST_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setPostType(type.id)}
                                className={`w-full p-3 rounded-xl text-left transition-all duration-200 flex items-center justify-between border ${postType === type.id
                                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10'
                                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span>{type.emoji}</span>
                                        <span className="font-medium">{type.name}</span>
                                    </div>
                                    <p className={`text-xs ${postType === type.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                        {type.desc}
                                    </p>
                                </div>
                                {postType === type.id && <CheckCircle className="w-5 h-5" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subreddit Selection */}
                <div className="card">
                    <label className="flex items-center text-sm font-medium text-muted-foreground mb-3">
                        <Users className="w-4 h-4 mr-2" />
                        Target Subreddits
                    </label>

                    {['primary', 'secondary', 'niche'].map(category => {
                        const categorySubs = subreddits.filter(s => s.category === category);
                        if (categorySubs.length === 0) return null;

                        return (
                            <div key={category} className="mb-4 last:mb-0">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 pl-1">
                                    {category}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {categorySubs.map(sub => (
                                        <button
                                            key={sub.name}
                                            onClick={() => toggleSubreddit(sub.name)}
                                            className={`subreddit-chip ${selectedSubreddits.includes(sub.name) ? 'selected ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}
                                        >
                                            {sub.displayName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Options */}
                <div className="card">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${generateVariations ? 'bg-primary border-primary' : 'border-muted-foreground group-hover:border-primary'
                            }`}>
                            {generateVariations && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
                        </div>
                        <input
                            type="checkbox"
                            checked={generateVariations}
                            onChange={(e) => setGenerateVariations(e.target.checked)}
                            className="hidden"
                        />
                        <div>
                            <span className="font-medium text-foreground">Generate Variations</span>
                            <p className="text-sm text-muted-foreground">Create 2-3 different versions of each post</p>
                        </div>
                    </label>
                </div>

                {/* Generate Button */}
                <ShimmerButton
                    onClick={generatePosts}
                    disabled={isGenerating || !topic.trim() || selectedSubreddits.length === 0}
                    className="w-full justify-center h-11 text-base shadow-lg shadow-primary/25 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    background="var(--color-primary)"
                    shimmerColor="var(--color-secondary)"
                >
                    {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                    ) : (
                        <><Sparkles className="w-5 h-5" /> Generate for {selectedSubreddits.length || 0} Subreddit{selectedSubreddits.length !== 1 ? 's' : ''}</>
                    )}
                </ShimmerButton>
            </div>

            {/* Right Column - Generated Posts */}
            <div className="lg:col-span-2 space-y-6">
                {generatedPosts.length === 0 && !isGenerating && (
                    <div className="card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-dashed">
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                            <Sparkles className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Fill in your topic, select your content pillar and post type, choose your target subreddits, and hit generate.
                        </p>
                    </div>
                )}

                {isGenerating && (
                    <div className="card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12">
                        <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
                        <h3 className="text-2xl font-semibold mb-2">Crafting Your Posts...</h3>
                        <p className="text-muted-foreground text-lg">
                            Generating {selectedSubreddits.length} post{selectedSubreddits.length !== 1 ? 's' : ''} with your voice and checking compliance
                        </p>
                    </div>
                )}

                {generatedPosts.map((post, index) => (
                    <div key={post.id} className="post-preview animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="post-preview-header bg-muted/30 border-b border-border p-5">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-lg flex items-center gap-2">
                                        <span className="text-primary opacity-80">r/</span>{post.subreddit}
                                    </span>
                                    <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full border ${post.complianceScore >= 8
                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                        : post.complianceScore >= 5
                                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        Score: {post.complianceScore}/10
                                    </span>
                                    {post.subredditConfig?.allowsProductMention && (
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            Promo OK
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => savePost(post)}
                                        className="btn-secondary h-9 text-sm px-4"
                                    >
                                        <Star className="w-4 h-4 mr-2" /> Save
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(`${post.title}\n\n${post.body}`, post.id)}
                                        className="btn-secondary h-9 text-sm"
                                    >
                                        {copiedId === post.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        <span className="ml-2">{copiedId === post.id ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                    <a
                                        href={`https://reddit.com/r/${post.subreddit}/submit`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary h-9 text-sm px-4"
                                    >
                                        Post <ExternalLink className="w-3 h-3 ml-2" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Post Content with Tabs for Variations */}
                        {post.variations && post.variations.length > 0 ? (
                            <div>
                                <div className="flex border-b border-border px-5 pt-4 gap-6">
                                    <button
                                        onClick={() => setActivePostTab(0)}
                                        className={`pb-3 text-sm font-medium transition-all relative ${activePostTab === 0
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Original
                                        {activePostTab === 0 && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                                        )}
                                    </button>
                                    {post.variations.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActivePostTab(i + 1)}
                                            className={`pb-3 text-sm font-medium transition-all relative ${activePostTab === i + 1
                                                ? 'text-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            Variation {i + 1}
                                            {activePostTab === i + 1 && (
                                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-6">
                                    {activePostTab === 0 ? (
                                        <>
                                            <h4 className="font-bold text-xl mb-4 leading-tight">{post.title}</h4>
                                            <div className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{post.body}</div>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-xl mb-4 leading-tight">{post.variations[activePostTab - 1]?.title}</h4>
                                            <div className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{post.variations[activePostTab - 1]?.body}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <h4 className="font-bold text-xl mb-4 leading-tight">{post.title}</h4>
                                <div className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">{post.body}</div>
                            </div>
                        )}

                        {/* Compliance Notes */}
                        {post.complianceNotes && post.complianceNotes.length > 0 && (
                            <div className="bg-muted/30 border-t border-border p-4">
                                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Info className="w-3.5 h-3.5" />
                                    Compliance Notes
                                </div>
                                <ul className="grid gap-2">
                                    {post.complianceNotes.map((note, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500/50 flex-shrink-0" />
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
