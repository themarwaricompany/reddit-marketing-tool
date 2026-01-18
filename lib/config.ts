// Voice and persona configuration for Aniruddh / FindMyICP
export const BRAND_CONFIG = {
    founder: {
        name: "Aniruddh Gupta",
        username: "aniruddh", // for Reddit if needed
        title: "Founder of FindMyICP.com",
        background: [
            "B2B lead generation expert",
            "Built and scaled multiple side projects",
            "Clay Creator and Smartlead Certified Partner",
            "Active in RevGenius, 10Xer Club, GrowthX communities",
            "Experience at GrowthSchool, Growton, and various startups",
        ],
        expertise: [
            "LinkedIn marketing",
            "Email marketing & outbound",
            "Lead generation",
            "Event networking",
            "Growth hacking",
            "Sales automation",
        ],
    },

    product: {
        name: "FindMyICP",
        url: "FindMyICP.com",
        tagline: "Turn the Luma guest list into actionable intelligence",
        valueProps: [
            "Extract Luma event attendee data",
            "Identify your ICPs before events",
            "Get LinkedIn profiles of attendees",
            "Network with precision",
            "Better lead generation from events",
        ],
        useCases: [
            "Networking at tech events",
            "Finding potential customers at conferences",
            "Pre-event research and preparation",
            "Building targeted outreach lists",
            "Identifying decision-makers at events",
        ],
    },

    voice: {
        tone: "direct and respectful",
        style: [
            "Conversational, not salesy",
            "Share genuine experiences and learnings",
            "Add value first, soft-promote later",
            "Use storytelling to make points relatable",
            "Sound like a fellow entrepreneur, not a marketer",
        ],
        avoid: [
            "Excessive exclamation marks",
            "Hype language",
            "Pushy sales tactics",
            "Generic marketing speak",
            "Overpromising",
        ],
        embrace: [
            "Vulnerability about failures",
            "Specific numbers and metrics",
            "Actionable insights",
            "Genuine questions",
            "Helping others without expecting return",
        ],
    },

    contentPillars: [
        {
            id: "event-networking",
            name: "Event Networking Insights",
            description: "Tips on maximizing value from tech events and conferences",
            keywords: ["luma", "events", "networking", "conferences", "meetups"],
        },
        {
            id: "lead-generation",
            name: "Lead Generation Tactics",
            description: "B2B lead gen strategies, tools, and case studies",
            keywords: ["leads", "outbound", "cold outreach", "prospecting", "ICP"],
        },
        {
            id: "product-insights",
            name: "Product Building & Launches",
            description: "Sharing what we're building, why, and learnings",
            keywords: ["product", "building", "startup", "launch", "features"],
        },
        {
            id: "growth-tactics",
            name: "Growth & Marketing Tactics",
            description: "Actionable growth strategies that worked",
            keywords: ["growth", "marketing", "acquisition", "traffic", "conversion"],
        },
        {
            id: "founder-journey",
            name: "Founder Journey & Learnings",
            description: "Personal stories, wins, failures, and lessons",
            keywords: ["founder", "journey", "startup", "lessons", "mistakes"],
        },
    ],
};

export const POST_TEMPLATES = {
    storytelling: {
        name: "Storytelling",
        emoji: "📖",
        description: "Personal journey or experience post",
        structure: [
            "Hook: Start with a relatable problem or surprising insight",
            "Context: Brief background on the situation",
            "Journey: What happened, what you tried",
            "Lesson: The key insight or takeaway",
            "Call to discussion: Invite others to share their experience",
        ],
        example: "I spent 3 months manually researching event attendees before every conference...",
    },
    experience: {
        name: "Experience/Learning",
        emoji: "💡",
        description: "What I discovered or learned",
        structure: [
            "The discovery: What you learned",
            "How you found it: The experiment or situation",
            "The impact: What changed as a result",
            "The application: How others can use this",
        ],
        example: "After analyzing 50+ Luma events, I noticed a pattern...",
    },
    suggestion: {
        name: "Tips & Suggestions",
        emoji: "🎯",
        description: "Helpful recommendations for others",
        structure: [
            "The problem: What issue are you solving",
            "The solution: Clear, actionable steps",
            "Why it works: Brief explanation",
            "Pro tip: One advanced insight",
        ],
        example: "Here's how I prepare for any networking event in 10 minutes...",
    },
    question: {
        name: "Discussion Question",
        emoji: "❓",
        description: "Genuine question to engage the community",
        structure: [
            "Context: Why you're asking",
            "The question: Clear and specific",
            "Your current thinking: What you've tried or considered",
            "What you're looking for: Type of advice needed",
        ],
        example: "How do you handle following up with people you meet at events?",
    },
    promotional: {
        name: "Soft Promotion",
        emoji: "📢",
        description: "Subtle product mention (only where allowed)",
        structure: [
            "Value-first: Start with useful insight",
            "The problem: What pain point exists",
            "Your approach: How you solved it (product naturally fits)",
            "Results: What changed",
            "Offer: Invite to learn more (not pushy)",
        ],
        example: "We built a tool to solve the exact problem I kept facing at Luma events...",
    },
    reply: {
        name: "Reply/Comment",
        emoji: "💬",
        description: "Thoughtful response to existing discussion",
        structure: [
            "Acknowledge: Reference what they said",
            "Add value: Your perspective or experience",
            "Be helpful: Actionable insight if possible",
            "Engage: Ask a follow-up or invite continued discussion",
        ],
        example: "Great point about pre-event research. What I've found works well is...",
    },
};

export type ContentPillar = typeof BRAND_CONFIG.contentPillars[number];
export type PostTemplate = keyof typeof POST_TEMPLATES;
