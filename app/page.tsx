'use client';

import { useState, useEffect } from 'react';
import { SideNav } from '@/components/SideNav';
import { DashboardView } from '@/components/DashboardView';
import { GeneratePostView } from '@/components/GeneratePostView';
import { FindReplyView } from '@/components/FindReplyView';
import { SubredditsView } from '@/components/SubredditsView';
import { ContentLibraryView } from '@/components/ContentLibraryView';
import { SettingsView } from '@/components/SettingsView';
import { GeneratedPost, SubredditConfig } from '@/lib/types';

// Constants moved or kept if shared
const CONTENT_PILLARS = [
  { id: 'event-networking', name: 'Event Networking', emoji: '🎯' },
  { id: 'lead-generation', name: 'Lead Generation', emoji: '🔥' },
  { id: 'product-insights', name: 'Product Insights', emoji: '💡' },
  { id: 'growth-tactics', name: 'Growth Tactics', emoji: '📈' },
  { id: 'founder-journey', name: 'Founder Journey', emoji: '🚀' },
];

export default function Home() {
  // Navigation
  const [activeSection, setActiveSection] = useState<'dashboard' | 'generate' | 'conversations' | 'subreddits' | 'library' | 'settings'>('dashboard');

  // Shared State
  const [subreddits, setSubreddits] = useState<SubredditConfig[]>([]);
  const [savedPosts, setSavedPosts] = useState<GeneratedPost[]>([]);
  const [contentPillar, setContentPillar] = useState('');

  // UI Utility State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    // Load subreddits
    fetch('/api/subreddits')
      .then(res => res.json())
      .then(data => setSubreddits(data.subreddits || []))
      .catch(console.error);

    // Load saved posts
    const saved = localStorage.getItem('reddit-tool-posts');
    if (saved) {
      setSavedPosts(JSON.parse(saved));
    }
  }, []);

  // Persist Saved Posts
  useEffect(() => {
    if (savedPosts.length > 0 || localStorage.getItem('reddit-tool-posts')) {
      localStorage.setItem('reddit-tool-posts', JSON.stringify(savedPosts));
    }
  }, [savedPosts]);

  // Actions
  const savePost = (post: GeneratedPost) => {
    setSavedPosts(prev => {
      const exists = prev.find(p => p.id === post.id);
      if (exists) return prev;
      return [...prev, post];
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      {/* Sidebar */}
      <SideNav activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-muted/10 relative">
        <div className="max-w-7xl mx-auto p-8 lg:p-10">

          {activeSection === 'dashboard' && (
            <DashboardView
              savedPosts={savedPosts}
              subreddits={subreddits}
              setContentPillar={setContentPillar}
              setActiveSection={setActiveSection}
              CONFIG_CONTENT_PILLARS={CONTENT_PILLARS}
            />
          )}

          {activeSection === 'generate' && (
            <GeneratePostView
              subreddits={subreddits}
              savePost={savePost}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
            />
          )}

          {activeSection === 'conversations' && (
            <FindReplyView
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
            />
          )}

          {activeSection === 'subreddits' && (
            <SubredditsView
              subreddits={subreddits}
              setSubreddits={setSubreddits}
            />
          )}

          {activeSection === 'library' && (
            <ContentLibraryView
              savedPosts={savedPosts}
              setSavedPosts={setSavedPosts}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsView subreddits={subreddits} />
          )}

        </div>
      </main>
    </div>
  );
}
