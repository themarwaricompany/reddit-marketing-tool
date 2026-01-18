
"use client";

import {
    LayoutDashboard,
    Sparkles,
    Search,
    Globe,
    FileText,
    Settings,
    Zap,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ShimmerButton from "@/components/ui/shimmer-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SideNavProps {
    activeSection: string;
    setActiveSection: (section: any) => void;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate Posts', icon: Sparkles },
    { id: 'conversations', label: 'Find & Reply', icon: Search },
    { id: 'subreddits', label: 'Subreddits', icon: Globe },
    { id: 'library', label: 'Content Library', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export function SideNav({ activeSection, setActiveSection }: SideNavProps) {
    return (
        <aside className="w-72 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col h-screen sticky top-0">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg tracking-tight text-white">Reddit Tool</h1>
                        <span className="text-xs text-muted-foreground font-medium">by FindMyICP</span>
                    </div>
                </div>
            </div>

            <Separator className="bg-border/50 mx-6 w-auto" />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4 py-6">
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const Icon = item.icon;

                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                onClick={() => setActiveSection(item.id)}
                                className={cn(
                                    "relative w-full justify-start gap-3 h-12 px-4 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group",
                                    isActive
                                        ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25 hover:bg-[var(--color-primary)] hover:text-white"
                                        : "text-muted-foreground hover:bg-[rgba(107,90,255,0.1)] hover:text-white"
                                )}
                            >
                                {!isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                                <Icon className={cn("w-5 h-5 transition-colors duration-300",
                                    isActive
                                        ? "text-white"
                                        : "text-muted-foreground group-hover:text-[var(--color-secondary)]"
                                )} />
                                {item.label}
                            </Button>
                        );

                    })}
                </nav>
            </ScrollArea>

            {/* Footer / Quick Action */}
            <div className="p-6 mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-full bg-yellow-500/10">
                            <Zap className="w-4 h-4 text-yellow-500" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">Quick Actions</span>
                    </div>
                    <ShimmerButton
                        onClick={() => setActiveSection('generate')}
                        className="w-full text-white font-semibold rounded-xl h-10 shadow-sm"
                        background="var(--color-primary)"
                        shimmerColor="var(--color-secondary)"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        New Post
                    </ShimmerButton>
                </div>
            </div>
        </aside>
    );
}
