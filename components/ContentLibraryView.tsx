
import {
    Sparkles,
    ExternalLink,
    Copy,
    CheckCircle,
    FileText,
    Trash2,
    Calendar,
    Search
} from 'lucide-react';
import { GeneratedPost } from '@/lib/types';

interface ContentLibraryViewProps {
    savedPosts: GeneratedPost[];
    setSavedPosts: (posts: GeneratedPost[]) => void;
    copyToClipboard: (text: string, id: string) => void;
    copiedId: string | null;
}

export function ContentLibraryView({
    savedPosts,
    setSavedPosts,
    copyToClipboard,
    copiedId
}: ContentLibraryViewProps) {

    const clearAll = () => {
        if (confirm('Are you sure you want to delete all saved posts?')) {
            setSavedPosts([]);
        }
    };

    const deletePost = (id: string) => {
        setSavedPosts(savedPosts.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">Content Library</h2>
                    <p className="text-muted-foreground text-base">{savedPosts.length} saved post{savedPosts.length !== 1 ? 's' : ''}</p>
                </div>
                {savedPosts.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="btn-secondary text-red-400 hover:text-red-500 hover:bg-red-500/10 border-red-200/20"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </button>
                )}
            </div>

            {savedPosts.length === 0 ? (
                <div className="card text-center py-20 border-dashed animate-scale-in">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Library is Empty</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                        Posts you save from the generator will appear here for future reference.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...savedPosts].reverse().map((post, i) => (
                        <div key={post.id} className="card flex flex-col group animate-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="subreddit-chip selected">r/{post.subreddit}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.complianceScore >= 8 ? 'text-green-400 bg-green-400/10' :
                                    post.complianceScore >= 5 ? 'text-yellow-400 bg-yellow-400/10' :
                                        'text-red-400 bg-red-400/10'
                                    }`}>
                                    {post.complianceScore}/10
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title || 'Untitled Post'}
                            </h3>

                            <div className="text-sm text-muted-foreground line-clamp-4 mb-4 flex-1 whitespace-pre-wrap leading-relaxed">
                                {post.body}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="p-2 text-muted-foreground hover:text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(`${post.title}\n\n${post.body}`, post.id)}
                                        className="p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                                        title="Copy"
                                    >
                                        {copiedId === post.id ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <a
                                        href={`https://reddit.com/r/${post.subreddit}/submit`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                                        title="Post on Reddit"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
