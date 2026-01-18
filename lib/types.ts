
export interface SubredditConfig {
    name: string;
    displayName: string;
    subscribers: string;
    description: string;
    category: 'primary' | 'secondary' | 'niche';
    rules: { text: string; severity: string }[];
    allowsProductMention: boolean;
    allowsLinks: boolean;
    bestPostTypes: string[];
    topPostPatterns: string[];
    titleFormulas: string[];
    postingFrequency: string;
}

export interface GeneratedPost {
    id: string;
    subreddit: string;
    title: string;
    body: string;
    postType: string;
    complianceScore: number;
    complianceNotes: string[];
    createdAt: string;
    status: string;
    variations?: { id: string; title: string; body: string; style: string }[];
    subredditConfig?: { allowsProductMention: boolean; allowsLinks: boolean };
}
