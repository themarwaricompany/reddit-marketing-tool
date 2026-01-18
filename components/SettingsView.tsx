
import { useState, useEffect } from 'react';
import {
    Save,
    Shield,
    User,
    Key,
    Database,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { SubredditConfig } from '@/lib/types';

interface SettingsViewProps {
    subreddits: SubredditConfig[];
}

export function SettingsView({ subreddits }: SettingsViewProps) {
    const [name, setName] = useState('Aniruddh Gupta');
    const [title, setTitle] = useState('Founder of FindMyICP.com');
    const [tone, setTone] = useState('Direct and respectful');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('reddit-tool-settings');
        if (saved) {
            const data = JSON.parse(saved);
            setName(data.name || '');
            setTitle(data.title || '');
            setTone(data.tone || '');
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem('reddit-tool-settings', JSON.stringify({ name, title, tone }));
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Settings</h2>
                <p className="text-muted-foreground text-base mb-8">Configure your Reddit marketing tool</p>
            </div>

            {/* Voice & Persona */}
            <div className="card">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-primary" />
                    Voice & Persona
                </h3>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Title / Role</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Founder of Startup"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Default Tone</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            placeholder="e.g. Professional, Casual, Helpful"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="btn-primary h-11 w-32 justify-center"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                'Saving...'
                            ) : saveSuccess ? (
                                <><CheckCircle className="w-4 h-4 mr-2" /> Saved</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> Save</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* API Keys */}
            <div className="card border-blue-500/20 shadow-lg shadow-blue-500/5">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                    <Key className="w-5 h-5 text-blue-400" />
                    API Keys
                </h3>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Gemini API Key</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="password"
                                className="input w-full bg-background/50"
                                value="Sk-................................"
                                readOnly
                                disabled
                            />
                            <span className="text-xs text-green-500 flex items-center gap-1 whitespace-nowrap font-medium">
                                <CheckCircle className="w-3 h-3" /> Configured
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Managed in <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">.env.local</code>
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Apify API Key</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="password"
                                className="input w-full bg-background/50"
                                value="apify_api_........................."
                                readOnly
                                disabled
                            />
                            <span className="text-xs text-green-500 flex items-center gap-1 whitespace-nowrap font-medium">
                                <CheckCircle className="w-3 h-3" /> Configured
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Managed in <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">.env.local</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* Database Stats */}
            <div className="card">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-lg">
                    <Database className="w-5 h-5 text-[var(--accent)]" />
                    Subreddits Database
                </h3>
                <div className="flex flex-wrap gap-3">
                    {subreddits.slice(0, 10).map(sub => (
                        <span key={sub.name} className="subreddit-chip">
                            {sub.displayName}
                            <span className="opacity-50 ml-1.5 text-[10px]">{sub.subscribers}</span>
                        </span>
                    ))}
                    {subreddits.length > 10 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            +{subreddits.length - 10} more
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {subreddits.length} subreddits currently configured for monitoring and posting.
                </p>
            </div>
        </div>
    );
}
