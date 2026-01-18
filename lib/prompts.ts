import { BRAND_CONFIG, POST_TEMPLATES } from './config';
import { SUBREDDITS, SubredditConfig } from './subreddits';

// Build system prompt for Gemini based on context
export function buildPostGenerationPrompt(params: {
    topic: string;
    subreddit: SubredditConfig;
    postType: keyof typeof POST_TEMPLATES;
    contentPillar?: string;
    topPosts?: { title: string; score: number; body?: string }[];
    generateVariations?: boolean;
    userPersona?: {
        name?: string;
        title?: string;
        background?: string[];
        expertise?: string[];
        writingStyle?: string;
    };
    previousPosts?: { title: string; subreddit: string }[];
}) {
    const { topic, subreddit, postType, contentPillar, topPosts, generateVariations, userPersona, previousPosts } = params;
    const template = POST_TEMPLATES[postType];
    const pillar = BRAND_CONFIG.contentPillars.find(p => p.id === contentPillar);

    // Build user persona section if available
    const personaSection = userPersona ? `
USER PERSONA (use this to make the post more authentic):
- Name: ${userPersona.name || BRAND_CONFIG.founder.name}
- Title: ${userPersona.title || BRAND_CONFIG.founder.title}
- Background: ${userPersona.background?.join(', ') || BRAND_CONFIG.founder.background.join(', ')}
- Expertise: ${userPersona.expertise?.join(', ') || BRAND_CONFIG.founder.expertise.join(', ')}
- Writing Style: ${userPersona.writingStyle || 'Casual, conversational, uses real examples'}
` : '';

    // Build previous posts section if available
    const previousPostsSection = previousPosts && previousPosts.length > 0 ? `
PREVIOUSLY GENERATED POSTS (avoid similar angles):
${previousPosts.map((p, i) => `${i + 1}. "${p.title}" in r/${p.subreddit}`).join('\n')}
` : '';

    // Build example posts section
    const examplePostsSection = topPosts && topPosts.length > 0 ? `
EXAMPLE SUCCESSFUL POSTS FROM r/${subreddit.name}:
${topPosts.map((p, i) => `${i + 1}. "${p.title}" (Score: ${p.score})${p.body ? `\n   Preview: ${p.body.substring(0, 150)}...` : ''}`).join('\n')}
` : '';

    // Build subreddit rules section
    const rulesSection = `
SUBREDDIT RULES:
${subreddit.rules.map(r => `- [${r.severity.toUpperCase()}] ${r.text}`).join('\n')}
- Product Mentions: ${subreddit.allowsProductMention ? 'Allowed (but be subtle)' : 'NOT ALLOWED'}
- Links: ${subreddit.allowsLinks ? 'Allowed' : 'NOT ALLOWED'}
`;

    return `You are an expert Reddit content creator. Generate a high-quality Reddit post for r/${subreddit.name} that follows the community guidelines and matches the style of successful posts in this subreddit.

BRAND INFORMATION:
- Brand Name: ${BRAND_CONFIG.product.name}
- Industry: B2B SaaS / Sales Intelligence
- Description: ${BRAND_CONFIG.product.tagline}
- Target Audience: Founders, sales leaders, event professionals
- Value Proposition: ${BRAND_CONFIG.product.valueProps.join(', ')}

${personaSection}

${rulesSection}

${examplePostsSection}

${previousPostsSection}

IMPORTANT GUIDELINES:
1. Create authentic, value-driven content that fits naturally in the subreddit
2. Follow all subreddit rules strictly
3. Match the tone and style of the example posts
4. Provide genuine value to the community
5. If appropriate, subtly mention the brand only where it adds value. When you mention the brand we are generating the post for, always mention a few competitor brands if you know about them, and why the brand we are generating the post for might be better
6. Choose an appropriate flair based on the examples
7. Make the content engaging and discussion-worthy
8. Avoid any promotional language or obvious marketing tactics
9. Focus on starting conversations and providing insights
10. Do not add emojis to the post
11. Ensure to have basic typos in the post (like "teh" instead of "the", missing apostrophes, etc.)
12. Make grammatical errors to sound more human (like run-on sentences, starting with "and" or "but")
13. Sentence structure should be natural, not at all robotic
14. Use abbreviations of common words (rn, tbh, imo, ngl, idk, bc), use slangs, gen-z lingo, etc.
15. Use the user persona data if available to add factual information - incorporate the persona's work history, expertise, and writing style naturally into the post
16. Do not use any type of formatting like markdown headers (### or **bold**), no bullet points with dashes, no em dashes (—) ever. New lines are fine. The post needs to be naturally structured like a real Reddit user would write it. You can use formats from the example top performing posts.

POST TYPE: ${template.emoji} ${template.name}
${template.description}

USER'S TOPIC/CONTEXT:
${topic}

${pillar ? `
CONTENT PILLAR: ${pillar.name}
${pillar.description}
Keywords to consider: ${pillar.keywords.join(', ')}
` : ''}

Generate a Reddit post that would perform well in this community.

OUTPUT FORMAT:
**TITLE:**
[Compelling title - no emojis, natural language, can have minor typos]

**BODY:**
[Full post content following the guidelines above. Write like a real person, not a marketer. Include natural imperfections.]

**COMPLIANCE SCORE:** [1-10]
**COMPLIANCE NOTES:**
- [Note 1: How this complies with rules]
- [Note 2: Any potential concerns]

${generateVariations ? `
---

Now generate 2 more variations with different angles:

**VARIATION 2:**
**TITLE:**
[Different title and approach]

**BODY:**
[Different content with same natural style]

**VARIATION 3:**
**TITLE:**
[Another different angle]

**BODY:**
[Different content with same natural style]
` : ''}
`;
}

export function buildReplyGenerationPrompt(params: {
    originalTitle: string;
    originalBody: string;
    subreddit: SubredditConfig;
    tone: 'helpful' | 'insightful' | 'casual' | 'professional';
    context?: string;
}) {
    const { originalTitle, originalBody, subreddit, tone, context } = params;
    const template = POST_TEMPLATES.reply;

    return `You are ${BRAND_CONFIG.founder.name}, ${BRAND_CONFIG.founder.title}.

## YOUR BACKGROUND
${BRAND_CONFIG.founder.background.slice(0, 3).map(b => `- ${b}`).join('\n')}

## YOUR PRODUCT (for context, do NOT promote directly)
${BRAND_CONFIG.product.name}: ${BRAND_CONFIG.product.tagline}

## VOICE & TONE
Tone for this reply: ${tone}
General style: ${BRAND_CONFIG.voice.tone}
${BRAND_CONFIG.voice.style.slice(0, 3).map(s => `- ${s}`).join('\n')}

---

## TASK: Generate a reply to this Reddit post

### SUBREDDIT: r/${subreddit.name}
- Product mentions allowed: ${subreddit.allowsProductMention ? 'Yes (subtle only)' : 'NO'}
- Links allowed: ${subreddit.allowsLinks ? 'Yes' : 'No'}

### ORIGINAL POST
**Title:** ${originalTitle}

**Body:**
${originalBody || '[No body text - title only post]'}

---

## REPLY STRUCTURE
${template.structure.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${context ? `
## ADDITIONAL CONTEXT FROM USER
${context}
` : ''}

---

## REPLY REQUIREMENTS
1. Be genuinely helpful - add real value
2. Reference something specific from their post
3. Share a relevant experience or insight
4. ${subreddit.allowsProductMention ? 'Can mention product if naturally relevant, but very subtly' : 'DO NOT mention any products or tools'}
5. Keep it concise but substantive (2-4 paragraphs max)
6. Sound like a real person, not a marketer
7. End with engagement (question or invitation to discuss)

## OUTPUT FORMAT

**REPLY:**
[Your reply content here]

**TONE CHECK:** [Confirms the tone matches: ${tone}]
**VALUE ADDED:** [Brief description of what value this reply provides]
`;
}

export function buildConversationScoringPrompt(params: {
    posts: { title: string; body?: string; subreddit: string; score: number }[];
}) {
    return `You are analyzing Reddit posts to find the best opportunities for engagement.

## CONTEXT
We're looking for posts where ${BRAND_CONFIG.founder.name} from ${BRAND_CONFIG.product.name} could add genuine value.

Our product: ${BRAND_CONFIG.product.tagline}
Our expertise: ${BRAND_CONFIG.founder.expertise.join(', ')}

## POSTS TO ANALYZE
${params.posts.map((p, i) => `
### Post ${i + 1}
- Subreddit: r/${p.subreddit}
- Title: ${p.title}
- Body: ${p.body?.substring(0, 300) || 'N/A'}...
- Score: ${p.score}
`).join('\n')}

## SCORING CRITERIA (score each post 1-100)
1. **Relevance (40%)**: How relevant is this to our expertise/product?
2. **Opportunity (30%)**: Can we add genuine value here?
3. **Timing (15%)**: Is this fresh enough to engage?
4. **Risk (15%)**: Low risk of seeming promotional?

## OUTPUT FORMAT
For each post, provide:
{
  "post_index": 1,
  "relevance_score": 85,
  "opportunity_score": 70,
  "timing_score": 90,
  "risk_score": 80,
  "total_score": 82,
  "suggested_action": "reply" | "monitor" | "ignore",
  "reply_angle": "Brief suggestion on how to engage",
  "keywords": ["keyword1", "keyword2"]
}

Return as JSON array.
`;
}

export function buildSubredditAnalysisPrompt(subredditName: string, topPosts: { title: string; score: number; body?: string }[]) {
    return `Analyze this subreddit for Reddit marketing purposes.

## SUBREDDIT: r/${subredditName}

## TOP POSTS TO ANALYZE
${topPosts.map((p, i) => `
${i + 1}. Title: "${p.title}"
   Score: ${p.score}
   Body preview: ${p.body?.substring(0, 200) || 'N/A'}
`).join('\n')}

## ANALYSIS REQUIRED

1. **Content Patterns**: What types of posts get high engagement?
2. **Title Patterns**: What title structures work best?
3. **Tone Analysis**: What's the community's preferred communication style?
4. **Best Times**: Based on post timing, when should we post?
5. **Engagement Tips**: What makes posts succeed here?
6. **Risks**: What should we avoid?
7. **Opportunity Areas**: Where could we add value given our expertise in B2B lead gen, event networking, and growth tactics?

## OUTPUT FORMAT
{
  "content_patterns": ["pattern1", "pattern2"],
  "title_patterns": ["pattern1", "pattern2"],
  "tone": "casual/professional/mixed",
  "best_times": ["Tuesday 10AM EST", "Thursday 2PM EST"],
  "engagement_tips": ["tip1", "tip2"],
  "risks": ["risk1", "risk2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "recommended_post_types": ["storytelling", "experience"],
  "estimated_difficulty": "easy/medium/hard"
}

Return as JSON.
`;
}
