# Vercel Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose: `themarwaricompany/reddit-marketing-tool`
4. Click "Import"

### 2. Configure Environment Variables

Before deploying, add these environment variables in Vercel:

#### Required Variables:

| Variable Name | Where to Get It | Example |
|--------------|----------------|---------|
| `GEMINI_API_KEY` | [Google AI Studio](https://makersuite.google.com/app/apikey) | `AIza...` |
| `APIFY_API_KEY` | [Apify Console](https://console.apify.com/account/integrations) | `apify_api_...` |

**How to add in Vercel:**
- In project settings → Environment Variables
- Add each variable for: Production, Preview, Development
- Click "Save"

### 3. Deploy

- Click "Deploy"
- Wait 2-3 minutes for build to complete
- Your app will be live at: `https://reddit-marketing-tool.vercel.app`

---

## 🔧 Troubleshooting Deployment Issues

### Issue 1: Build Fails

**Symptoms:** Deployment fails during build phase

**Solutions:**

1. **Check Build Logs** in Vercel dashboard
2. **Verify all dependencies** are in package.json:
   ```bash
   # Run locally to test
   npm run build
   ```
3. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

### Issue 2: Runtime Errors After Deploy

**Symptoms:** Site deploys but shows errors when accessed

**Common Causes:**

1. **Missing Environment Variables**
   - Go to Project Settings → Environment Variables
   - Ensure `GEMINI_API_KEY` and `APIFY_API_KEY` are set
   - **Important:** Redeploy after adding variables

2. **API Route Issues**
   - Check Vercel Function Logs
   - Ensure all API routes are in `/app/api/` directory

### Issue 3: Environment Variables Not Working

**Solution:**
1. Add variables in Vercel dashboard
2. **Redeploy** the project (variables are applied on next deployment)
3. Go to Deployments → Click "..." → Redeploy

### Issue 4: "Application Error" on Vercel

**Debugging Steps:**

1. **Check Runtime Logs:**
   - Vercel Dashboard → Your Project → Logs
   - Look for error messages

2. **Verify Next.js Version:**
   - Ensure package.json has: `"next": "^16.1.3"`

3. **Check Node Version:**
   - Add to package.json:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

### Issue 5: API Routes Return 404

**Solution:**
- Ensure files are in correct structure:
  ```
  app/
  └── api/
      ├── discover-subreddits/
      │   └── route.ts
      ├── find-conversations/
      │   └── route.ts
      └── generate-post/
          └── route.ts
  ```

---

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Test all pages load correctly
- [ ] Test "Generate Posts" feature
- [ ] Test "Find & Reply" feature
- [ ] Test "Discover Subreddits" feature
- [ ] Verify API keys are working (check for AI responses)
- [ ] Check browser console for errors
- [ ] Set up custom domain (optional)
- [ ] Enable Analytics in Vercel

---

## 🔑 Environment Variables Reference

### GEMINI_API_KEY
- **Required:** Yes
- **Where:** All environments (Production, Preview, Development)
- **Get it:** [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Format:** `AIza...` (starts with AIza)

### APIFY_API_KEY
- **Required:** Yes
- **Where:** All environments
- **Get it:** [Apify Console](https://console.apify.com/account/integrations)
- **Format:** `apify_api_...`

---

## 🌐 Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your domain: `reddit-tool.yourdomain.com`
3. Add DNS records as shown by Vercel
4. Wait for DNS propagation (5-30 minutes)

---

## 📊 Performance Optimization

### Enable Speed Insights
1. Project Settings → Speed Insights
2. Enable → Deploy changes

### Enable Web Analytics
1. Project Settings → Analytics
2. Enable → Deploy changes

---

## 🐛 Common Error Messages & Fixes

### "Module not found: Can't resolve '@/lib/...'"

**Fix:** 
- Check tsconfig.json has correct path mapping
- Rebuild: `npm run build`

### "Gemini API Key is not configured"

**Fix:**
1. Add `GEMINI_API_KEY` in Vercel
2. Redeploy project

### "Failed to fetch conversations"

**Fix:**
1. Check `APIFY_API_KEY` is set
2. Verify Apify account has credits
3. Check Vercel function logs

---

## 🔄 Redeployment

To redeploy with latest changes:

1. **From Git:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
   Vercel auto-deploys on push to main

2. **Manual Redeploy:**
   - Vercel Dashboard → Deployments
   - Click "..." → Redeploy

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Check Logs:** Vercel Dashboard → Your Project → Logs

---

## ✅ Successful Deployment Checklist

Your deployment is successful when:

- [ ] Build completes without errors
- [ ] Homepage loads at your Vercel URL
- [ ] All navigation items work
- [ ] Generate Posts returns AI-generated content
- [ ] No console errors in browser
- [ ] API calls return data (not 404 or 500 errors)

---

**Last Updated:** January 2026  
**Author:** Aniruddh Gupta / The Marwari Company
