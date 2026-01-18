// Comprehensive subreddit data with rules, analysis, and posting strategy
export interface SubredditConfig {
    name: string;
    displayName: string;
    subscribers: string;
    description: string;
    category: 'primary' | 'secondary' | 'niche';

    // Rules & Compliance
    rules: {
        text: string;
        severity: 'strict' | 'moderate' | 'flexible';
    }[];
    allowsProductMention: boolean;
    allowsLinks: boolean;
    requiresFlair: boolean;
    minAccountAge?: string;
    minKarma?: number;

    // Strategy
    bestPostTypes: string[];
    bestContentPillars: string[]; // IDs from BRAND_CONFIG
    peakPostingTimes: string[];
    postingFrequency: string; // e.g., "max 1 per week"

    // Analysis
    topPostPatterns: string[];
    titleFormulas: string[];
    avoidTopics: string[];

    // Tracking
    lastPostedAt?: string;
    totalPosts?: number;
}

export const SUBREDDITS: SubredditConfig[] = [
    {
        name: "entrepreneur",
        displayName: "r/entrepreneur",
        subscribers: "3.2M",
        description: "A community for discussion about entrepreneurship",
        category: "primary",
        rules: [
            { text: "No direct self-promotion or links to your own business", severity: "strict" },
            { text: "No referral codes or affiliate links", severity: "strict" },
            { text: "Context and value must come before any mention of your product", severity: "strict" },
            { text: "Store/Business feedback only in designated threads", severity: "moderate" },
            { text: "No low-effort posts or one-liners", severity: "moderate" },
        ],
        allowsProductMention: false,
        allowsLinks: false,
        requiresFlair: true,
        bestPostTypes: ["storytelling", "experience", "question"],
        bestContentPillars: ["founder-journey", "growth-tactics", "lead-generation"],
        peakPostingTimes: ["Tuesday 9-11 AM EST", "Wednesday 10 AM EST", "Thursday 2 PM EST"],
        postingFrequency: "Max 1-2 per week, different topics",
        topPostPatterns: [
            "Personal failure stories with lessons",
            "Specific revenue/growth numbers",
            "Contrarian takes on common advice",
            "Before/after transformation stories",
        ],
        titleFormulas: [
            "I [achieved X] in [timeframe]. Here's what I learned.",
            "After [X years/months] of [activity], here's the truth about [topic]",
            "[Specific metric] later, here's what actually works for [topic]",
            "The [topic] advice that changed everything for me",
        ],
        avoidTopics: ["Direct product pitches", "Asking for feedback on business ideas", "Generic motivation posts"],
    },
    {
        name: "startups",
        displayName: "r/startups",
        subscribers: "1.2M",
        description: "Discussion hub for startups and entrepreneurship",
        category: "primary",
        rules: [
            { text: "No direct advertisements or promotional posts", severity: "strict" },
            { text: "Share Saturday is the only time for self-promo", severity: "strict" },
            { text: "Provide substantial value in every post", severity: "moderate" },
            { text: "No asking for feedback without substantial context", severity: "moderate" },
        ],
        allowsProductMention: false,
        allowsLinks: false,
        requiresFlair: true,
        bestPostTypes: ["storytelling", "experience"],
        bestContentPillars: ["founder-journey", "product-insights"],
        peakPostingTimes: ["Monday 10 AM EST", "Wednesday 9 AM EST", "Friday 11 AM EST"],
        postingFrequency: "Max 1 per week, Share Saturday for promos",
        topPostPatterns: [
            "Deep-dive case studies with specific metrics",
            "Vulnerability about challenges faced",
            "Specific tactical advice with examples",
            "Genuine questions about strategy",
        ],
        titleFormulas: [
            "How we went from [A] to [B] in [timeframe]",
            "The mistake that almost killed our startup",
            "[Specific question] - looking for advice from founders who've been there",
        ],
        avoidTopics: ["Generic startup advice", "Unsolicited product feedback requests"],
    },
    {
        name: "SaaS",
        displayName: "r/SaaS",
        subscribers: "150K",
        description: "Community for SaaS founders, marketers, and enthusiasts",
        category: "primary",
        rules: [
            { text: "Self-promotion allowed in moderation", severity: "flexible" },
            { text: "Must provide value alongside any promotion", severity: "moderate" },
            { text: "No spam or repetitive posting", severity: "strict" },
            { text: "Engage with comments on your posts", severity: "moderate" },
        ],
        allowsProductMention: true,
        allowsLinks: true,
        requiresFlair: false,
        bestPostTypes: ["storytelling", "experience", "promotional"],
        bestContentPillars: ["product-insights", "growth-tactics", "lead-generation"],
        peakPostingTimes: ["Tuesday 11 AM EST", "Thursday 2 PM EST"],
        postingFrequency: "1-2 per week, mix promotional and value",
        topPostPatterns: [
            "MRR/ARR growth stories with specific numbers",
            "Behind-the-scenes of building features",
            "Tool stacks and automation setups",
            "Honest revenue/growth updates",
        ],
        titleFormulas: [
            "How we got our first [X] customers",
            "Built [feature] in [timeframe] - here's what happened",
            "Our journey from $0 to $[X]k MRR",
            "[Tool type] for [use case] - would love feedback",
        ],
        avoidTopics: ["Generic SaaS advice without specifics"],
    },
    {
        name: "marketing",
        displayName: "r/marketing",
        subscribers: "850K",
        description: "Discussion of marketing strategies and tactics",
        category: "secondary",
        rules: [
            { text: "No self-promotion or spam", severity: "strict" },
            { text: "Links must add value to discussion", severity: "moderate" },
            { text: "Be respectful and constructive", severity: "moderate" },
            { text: "No job postings outside designated threads", severity: "strict" },
        ],
        allowsProductMention: false,
        allowsLinks: false,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion", "question"],
        bestContentPillars: ["growth-tactics", "lead-generation"],
        peakPostingTimes: ["Wednesday 10 AM EST", "Friday 9 AM EST"],
        postingFrequency: "Max 1 per week",
        topPostPatterns: [
            "Data-backed marketing insights",
            "Case studies without naming your company",
            "Tactical how-to guides",
            "Industry trend analysis",
        ],
        titleFormulas: [
            "What [X] taught me about [marketing topic]",
            "[X]% increase in [metric] - here's the strategy",
            "Unpopular opinion: [contrarian marketing take]",
        ],
        avoidTopics: ["Direct product mentions", "Generic marketing tips"],
    },
    {
        name: "sales",
        displayName: "r/sales",
        subscribers: "250K",
        description: "Community for sales professionals",
        category: "secondary",
        rules: [
            { text: "No spam or excessive self-promotion", severity: "strict" },
            { text: "Be helpful and constructive", severity: "moderate" },
            { text: "Sales tips must be actionable", severity: "moderate" },
        ],
        allowsProductMention: false,
        allowsLinks: false,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion"],
        bestContentPillars: ["lead-generation", "growth-tactics"],
        peakPostingTimes: ["Monday 9 AM EST", "Thursday 10 AM EST"],
        postingFrequency: "Max 1 per week",
        topPostPatterns: [
            "Cold outreach templates that worked",
            "Prospecting techniques with results",
            "Sales tool recommendations (genuine)",
            "Celebrating wins and discussing losses",
        ],
        titleFormulas: [
            "This [approach] 2x'd my response rate",
            "After [X] cold calls, here's what I learned",
            "The sales technique nobody talks about",
        ],
        avoidTopics: ["Tool pitches", "Generic sales motivation"],
    },
    {
        name: "growthacking",
        displayName: "r/growthacking",
        subscribers: "85K",
        description: "Growth hacking strategies and tactics",
        category: "primary",
        rules: [
            { text: "Share actionable growth tactics", severity: "moderate" },
            { text: "No low-quality content", severity: "moderate" },
            { text: "Self-promotion must add value", severity: "flexible" },
        ],
        allowsProductMention: true,
        allowsLinks: true,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion", "promotional"],
        bestContentPillars: ["growth-tactics", "lead-generation", "product-insights"],
        peakPostingTimes: ["Tuesday 2 PM EST", "Thursday 11 AM EST"],
        postingFrequency: "2-3 per week okay if valuable",
        topPostPatterns: [
            "Step-by-step growth experiments",
            "Before/after metrics from tactics",
            "Unconventional acquisition channels",
            "Automation and tool stack reveals",
        ],
        titleFormulas: [
            "How I got [X] users in [timeframe] with [tactic]",
            "The growth hack that [specific result]",
            "[Unconventional channel] for B2B - here's how",
        ],
        avoidTopics: ["Generic growth advice"],
    },
    {
        name: "smallbusiness",
        displayName: "r/smallbusiness",
        subscribers: "1.5M",
        description: "Community for small business owners",
        category: "secondary",
        rules: [
            { text: "No advertising or self-promotion", severity: "strict" },
            { text: "Be helpful and supportive", severity: "moderate" },
            { text: "No asking what business to start", severity: "moderate" },
            { text: "Specific questions only", severity: "moderate" },
        ],
        allowsProductMention: false,
        allowsLinks: false,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion", "question"],
        bestContentPillars: ["founder-journey", "lead-generation"],
        peakPostingTimes: ["Monday 10 AM EST", "Wednesday 2 PM EST"],
        postingFrequency: "Max 1 per week",
        topPostPatterns: [
            "Operational insights and tips",
            "Real challenges faced and solutions",
            "Cost-saving strategies",
            "Genuine advice requests",
        ],
        titleFormulas: [
            "After [X] years in [industry], here's what I wish I knew",
            "The [topic] that saved my business",
            "Looking for advice on [specific situation]",
        ],
        avoidTopics: ["Product promotion", "Generic business motivation"],
    },
    {
        name: "Emailmarketing",
        displayName: "r/Emailmarketing",
        subscribers: "45K",
        description: "Email marketing strategies and tools",
        category: "niche",
        rules: [
            { text: "Share valuable email marketing content", severity: "moderate" },
            { text: "Tool recommendations welcome if helpful", severity: "flexible" },
        ],
        allowsProductMention: true,
        allowsLinks: true,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion", "promotional"],
        bestContentPillars: ["lead-generation", "growth-tactics"],
        peakPostingTimes: ["Tuesday 10 AM EST", "Thursday 2 PM EST"],
        postingFrequency: "1-2 per week",
        topPostPatterns: [
            "Email templates that convert",
            "Open rate/click rate improvements",
            "Deliverability tips",
            "Automation workflows",
        ],
        titleFormulas: [
            "This subject line got [X]% open rate",
            "How I improved email deliverability from [X] to [Y]",
        ],
        avoidTopics: ["Spam tactics"],
    },
    {
        name: "linkedinads",
        displayName: "r/linkedinads",
        subscribers: "8K",
        description: "LinkedIn advertising and marketing",
        category: "niche",
        rules: [
            { text: "Share LinkedIn marketing insights", severity: "moderate" },
        ],
        allowsProductMention: true,
        allowsLinks: true,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion"],
        bestContentPillars: ["lead-generation", "growth-tactics"],
        peakPostingTimes: ["Wednesday 11 AM EST"],
        postingFrequency: "1 per week",
        topPostPatterns: [
            "Campaign results and learnings",
            "Targeting strategies",
            "Creative that works",
        ],
        titleFormulas: [
            "LinkedIn Ads case study: [result]",
            "What's working for B2B LinkedIn ads in 2026",
        ],
        avoidTopics: [],
    },
    {
        name: "eventplanning",
        displayName: "r/eventplanning",
        subscribers: "95K",
        description: "Event planning professionals and enthusiasts",
        category: "niche",
        rules: [
            { text: "Be helpful to fellow event planners", severity: "moderate" },
            { text: "No spam or excessive promotion", severity: "moderate" },
        ],
        allowsProductMention: true,
        allowsLinks: true,
        requiresFlair: false,
        bestPostTypes: ["experience", "suggestion", "question"],
        bestContentPillars: ["event-networking"],
        peakPostingTimes: ["Monday 2 PM EST", "Thursday 10 AM EST"],
        postingFrequency: "1 per week",
        topPostPatterns: [
            "Event management tips",
            "Attendee engagement strategies",
            "Tech tools for events",
        ],
        titleFormulas: [
            "How tech events are changing attendee management",
            "Tips for maximizing networking at your events",
        ],
        avoidTopics: [],
    },
];

export const getSubredditByName = (name: string): SubredditConfig | undefined => {
    return SUBREDDITS.find(s => s.name.toLowerCase() === name.toLowerCase());
};

export const getSubredditsByCategory = (category: 'primary' | 'secondary' | 'niche'): SubredditConfig[] => {
    return SUBREDDITS.filter(s => s.category === category);
};

export const getSubredditsAllowingPromo = (): SubredditConfig[] => {
    return SUBREDDITS.filter(s => s.allowsProductMention);
};
