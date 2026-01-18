
import {
    FileText,
    Users,
    CheckCircle,
    Calendar,
    Target,
    ArrowRight,
    TrendingUp,
    Clock
} from "lucide-react";
import { GeneratedPost, SubredditConfig } from '@/lib/types';

interface DashboardViewProps {
    savedPosts: GeneratedPost[];
    subreddits: SubredditConfig[];
    setContentPillar: (id: string) => void;
    setActiveSection: (section: any) => void;
    CONFIG_CONTENT_PILLARS: { id: string; name: string; emoji: string }[];
}

export function DashboardView({
    savedPosts,
    subreddits,
    setContentPillar,
    setActiveSection,
    CONFIG_CONTENT_PILLARS
}: DashboardViewProps) {

    const getComplianceColor = (score: number) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 5) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome back, Aniruddh 👋</h2>
                <p className="text-muted-foreground text-base mb-8">Here&apos;s your Reddit marketing overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Posts Generated', value: savedPosts.length.toString(), icon: FileText, color: 'text-primary' },
                    { label: 'Subreddits Active', value: subreddits.length.toString(), icon: Users, color: 'text-blue-400' },
                    { label: 'Avg Compliance', value: '8.5', icon: CheckCircle, color: 'text-green-400' },
                    { label: 'This Week', value: savedPosts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(), icon: Calendar, color: 'text-yellow-400' },
                ].map((stat, i) => (
                    <div key={i} className="card hover:border-primary/50 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Target className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">Today&apos;s Focus</h3>
                    </div>
                    <div className="space-y-3">
                        {CONFIG_CONTENT_PILLARS.slice(0, 3).map(pillar => (
                            <button
                                key={pillar.id}
                                onClick={() => { setContentPillar(pillar.id); setActiveSection('generate'); }}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group"
                            >
                                <span className="font-medium text-foreground">{pillar.emoji} {pillar.name}</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Top Subreddits</h3>
                    </div>
                    <div className="space-y-3">
                        {subreddits.filter(s => s.category === 'primary').slice(0, 3).map(sub => (
                            <div key={sub.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-transparent">
                                <div>
                                    <span className="font-medium block">{sub.displayName}</span>
                                    <span className="text-xs text-muted-foreground">{sub.subscribers}</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sub.allowsProductMention ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                    {sub.allowsProductMention ? 'Promo OK' : 'No Promo'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {savedPosts.length > 0 && (
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-lg">Recent Drafts</h3>
                    </div>
                    <div className="space-y-3">
                        {savedPosts.slice(-3).reverse().map(post => (
                            <div key={post.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent">
                                <div className="flex-1 min-w-0 mr-4">
                                    <p className="font-medium truncate mb-1">{post.title || 'Untitled'}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-muted">r/{post.subreddit}</span>
                                        <span>•</span>
                                        <span className="capitalize">{post.postType}</span>
                                    </p>
                                </div>
                                <span className={`text-sm font-semibold ${getComplianceColor(post.complianceScore)}`}>
                                    {post.complianceScore}/10
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
