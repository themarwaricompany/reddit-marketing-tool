import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { keywords = [], topic, existingSubreddits = [], limit = 15 } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Support both keywords array and topic string
    // Ensure keywords is always an array
    const keywordsArray = Array.isArray(keywords) ? keywords : (typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : []);
    const searchTerms = keywordsArray.length > 0 ? keywordsArray.join(', ') : topic || 'B2B SaaS, lead generation, startup growth';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert at finding relevant Reddit communities for marketing and lead generation.

SEARCH KEYWORDS: ${searchTerms}

EXISTING SUBREDDITS TO EXCLUDE:
${existingSubreddits.join(', ') || 'None'}

TASK: Suggest ${limit} relevant subreddits based on the keywords above.

For each subreddit, determine:
1. Whether promotional content (product mentions) is allowed based on typical subreddit rules
2. Whether external links are typically allowed
3. The category: "primary" (high relevance, large audience), "secondary" (good fit, medium audience), or "niche" (specialized, smaller)

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "subreddits": [
    {
      "name": "entrepreneur",
      "displayName": "r/entrepreneur",
      "subscribers": "3.2M",
      "description": "High-quality posts by entrepreneurs sharing lessons and experiences",
      "category": "primary",
      "allowsProductMention": false,
      "allowsLinks": true,
      "bestPostTypes": ["storytelling", "experience", "discussion"],
      "topPostPatterns": ["I built X and learned Y", "After 5 years..."],
      "titleFormulas": ["How I...", "Lessons from..."],
      "postingFrequency": "daily"
    }
  ]
}

Important: Return real, existing subreddits only. Category should be one of: "primary", "secondary", or "niche".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        // Ensure proper format
        const subreddits = (parsed.subreddits || []).map((sub: any) => ({
          name: sub.name || '',
          displayName: sub.displayName || `r/${sub.name}`,
          subscribers: sub.subscribers || 'Unknown',
          description: sub.description || sub.relevance || '',
          category: sub.category || 'secondary',
          rules: sub.rules || [],
          allowsProductMention: sub.allowsProductMention || sub.promotionalAllowed || false,
          allowsLinks: sub.allowsLinks !== false,
          bestPostTypes: sub.bestPostTypes || sub.postTypes || ['storytelling', 'experience'],
          topPostPatterns: sub.topPostPatterns || [],
          titleFormulas: sub.titleFormulas || [],
          postingFrequency: sub.postingFrequency || 'varies',
        }));

        return NextResponse.json({ success: true, subreddits });
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
      }
    }

    return NextResponse.json({ success: false, error: 'Failed to parse response', raw: text });
  } catch (error) {
    console.error('Subreddit discovery error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to discover subreddits' },
      { status: 500 }
    );
  }
}
