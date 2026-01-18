# Reddit Marketing Tool by FindMyICP

A professional Reddit marketing assistant that helps you create compliant, authentic posts with your unique voice. Built with Next.js, TypeScript, and powered by Gemini AI.

![Reddit Marketing Tool](https://img.shields.io/badge/Next.js-16.1.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwind-css)

## 🎯 Overview

Reddit Marketing Tool is a comprehensive solution for founders, marketers, and content creators who want to engage authentically on Reddit while maintaining compliance with community guidelines. The tool uses AI to help craft posts that sound like you, respect subreddit rules, and drive genuine engagement.

### Key Features

- **🤖 AI-Powered Post Generation** - Creates Reddit posts in your authentic voice using Google's Gemini AI
- **✅ Compliance Scoring** - Automatically checks posts against subreddit rules with a 10-point scale
- **🎯 Multi-Subreddit Targeting** - Generate variations optimized for different communities
- **💬 Conversation Discovery** - Find high-intent discussions to participate in
- **🔍 Smart Reply Generation** - Craft thoughtful replies with AI assistance
- **📚 Content Library** - Save and manage your best posts
- **🌐 Subreddit Discovery** - AI-powered subreddit recommendations based on keywords
- **⚙️ Voice Customization** - Personalize tone and style to match your brand

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Apify API key ([Get one here](https://apify.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reddit-marketing-tool.git
   cd reddit-marketing-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   APIFY_API_KEY=your_apify_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

### Core
- **Framework**: [Next.js 16.1.3](https://nextjs.org/) with Turbopack
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with custom design system
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

### AI & Data
- **AI Model**: Google Gemini 2.0 Flash (exp-0111)
- **Reddit Data**: Apify Actors
- **State Management**: React Hooks

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
reddit-marketing-tool/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── discover-subreddits/
│   │   ├── find-conversations/
│   │   ├── generate-post/
│   │   ├── generate-reply/
│   │   └── logs/
│   ├── globals.css          # Global styles & design system
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── DashboardView.tsx
│   ├── GeneratePostView.tsx
│   ├── FindReplyView.tsx
│   ├── SubredditsView.tsx
│   ├── ContentLibraryView.tsx
│   ├── SettingsView.tsx
│   └── SideNav.tsx
├── lib/                     # Utilities & configurations
│   ├── gemini.ts           # Gemini AI client
│   ├── prompts.ts          # AI prompts
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helper functions
├── data/                    # Static data
│   └── subreddits.ts       # Subreddit configurations
├── public/                  # Static assets
├── DESIGN_SYSTEM.md        # Design system documentation
├── DESIGN_AUDIT_SUMMARY.md # Branding audit report
└── README.md               # This file
```

## 🎨 Design System

This project follows a comprehensive design system ensuring visual consistency across all pages. Key highlights:

- **Spacing**: Consistent 4-48px scale
- **Buttons**: Standardized heights (h-11 for primary actions)
- **Transitions**: Uniform 200ms timing
- **Typography**: Clear hierarchy with defined scales
- **Cards**: Consistent padding and border radius

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for complete specifications.

## 📖 Usage Guide

### 1. Dashboard
View your marketing metrics, recent activity, and quick action shortcuts.

### 2. Generate Posts
Create Reddit posts optimized for specific subreddits:
1. Enter your topic or story
2. Select a content pillar (Lead Generation, Product Insights, etc.)
3. Choose post type (Storytelling, Tips & Suggestions, etc.)
4. Select target subreddits
5. Generate variations with compliance scoring

### 3. Find & Reply
Discover relevant conversations and craft thoughtful replies:
1. Enter keywords to find high-intent discussions
2. Review discovered conversations with relevance scores
3. Select a post and generate a contextual reply
4. Copy and post your response

### 4. Discover Subreddits
Find new communities to engage with:
1. Enter keywords related to your niche
2. AI analyzes and recommends relevant subreddits
3. Review subscribers, rules, and promotional policies
4. Add to your monitoring list

### 5. Content Library
Save, organize, and reuse your best posts for future reference.

### 6. Settings
Configure your voice, tone, and API credentials.

## 🔑 Features in Detail

### AI-Powered Content Generation
- Uses Google Gemini 2.0 Flash for natural, human-like content
- Maintains your authentic voice and writing style
- Generates multiple variations for A/B testing

### Compliance Engine
- Analyzes subreddit rules automatically
- Scores posts on a 10-point compliance scale
- Provides specific recommendations for improvement
- Flags promotional content in restricted subreddits

### Multi-Subreddit Optimization
- Generates variations tailored to each community
- Adjusts tone and messaging based on subreddit culture
- Respects posting frequency guidelines

### Conversation Intelligence
- Finds high-intent discussions across Reddit
- Calculates relevance scores
- Suggests optimal reply angles
- Identifies warm vs. cold opportunities

## 🛡️ Best Practices

1. **Authenticity First**: Use the tool to enhance your voice, not replace it
2. **Respect Communities**: Always follow subreddit rules and guidelines
3. **Value-First Approach**: Lead with value, not promotion
4. **Community Engagement**: Participate genuinely before promoting
5. **Compliance Check**: Review compliance scores before posting

## 📊 API Rate Limits

- **Gemini API**: 15 requests/minute (free tier)
- **Apify**: Varies by plan
- Tool includes built-in rate limiting and error handling

## 🔧 Configuration

### Customizing Voice & Persona
Edit settings in the Settings page:
- Your Name
- Title/Role
- Default Tone

### Adding Subreddits
Manually add or use AI discovery:
```typescript
// data/subreddits.ts
export const SUBREDDITS: SubredditConfig[] = [
  {
    name: 'entrepreneur',
    displayName: 'r/entrepreneur',
    subscribers: '3.2M',
    category: 'primary',
    allowsProductMention: false,
    // ... more config
  }
];
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
Compatible with any platform supporting Next.js 16+:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini** for the powerful AI model
- **Apify** for Reddit data access
- **Shadcn UI** for beautiful components
- **Next.js Team** for the amazing framework

## 📧 Contact

**Aniruddh Gupta**
- Website: [FindMyICP.com](https://findmyicp.com)
- GitHub: [@aniruddhgupta](https://github.com/aniruddhgupta)

## 🗺️ Roadmap

- [ ] Reddit OAuth integration for direct posting
- [ ] Analytics dashboard for tracking post performance
- [ ] Scheduled posting calendar
- [ ] Sentiment analysis on replies
- [ ] Chrome extension for quick access
- [ ] Team collaboration features
- [ ] Multi-platform support (Twitter, LinkedIn)

---

**Built with ❤️ for authentic community engagement**
