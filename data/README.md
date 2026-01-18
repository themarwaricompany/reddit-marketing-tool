# Subreddit Data Maintainer

This folder contains configuration and data for target subreddits.

## Files

- `subreddits.json` - Main subreddit configurations with rules and best practices
- `discovered.json` - Newly discovered subreddits (to be reviewed and added to main list)
- `posts-history.json` - History of posts made (for tracking and avoiding duplicates)

## Adding New Subreddits

When you discover a new relevant subreddit:

1. Add it to `discovered.json` first
2. Research the subreddit rules manually
3. Analyze top posts for patterns
4. Move to `subreddits.json` once verified

## Subreddit Object Structure

```json
{
  "name": "subredditname",
  "displayName": "r/subredditname",
  "subscribers": "100K",
  "description": "What the subreddit is about",
  "rules": ["Rule 1", "Rule 2"],
  "bestPractices": ["Practice 1", "Practice 2"],
  "allowsProductMention": false,
  "bestPostTypes": ["storytelling", "experience", "suggestion", "promotional"],
  "peakPostingTimes": ["Tuesday 9-11 AM EST"]
}
```

## Post Types

- **storytelling**: Personal journey or experience posts
- **experience**: What you learned or discovered  
- **suggestion**: Helpful tips or recommendations
- **promotional**: Soft promotion (only where allowed)
