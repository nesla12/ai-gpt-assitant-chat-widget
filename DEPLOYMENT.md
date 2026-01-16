# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Click to Deploy (Recommended)

The easiest way to deploy is using Vercel's deployment button. However, due to GitHub API limitations, you may need to do this manually. Here's the process:

### Option 2: Manual Deployment (5 minutes)

1. **Fork this repository** on GitHub
2. **Go to Vercel** (https://vercel.com)
3. Click **Add New... → Project**
4. Select **Import Git Repository**
5. Paste your forked repository URL
6. Click **Import**

### Step 1: Add Environment Variables

When you click "Configure Project", add these environment variables:

```
OPENAI_API_KEY     → Your OpenAI API key (from https://platform.openai.com/api-keys)
OPENAI_ASSISTANT_ID → Your Assistant ID (from https://platform.openai.com/assistants)
NEXT_PUBLIC_APP_URL → (Leave blank for now, update after deployment)
```

### Step 2: Deploy

Click **Deploy** and wait 2-3 minutes for deployment to complete.

Once deployed, you'll see:
- ✅ Deployment URL (e.g., `https://my-widget-abc123.vercel.app`)
- ✅ Postgres database automatically created
- ✅ API routes ready
- ✅ Widget configurator accessible

### Step 3: Update App URL

After deployment:

1. Go to Vercel Dashboard → Your Project → Settings
2. Click **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL` and set it to your deployment URL
4. Save
5. Click **Deployments** and click **Redeploy** on the latest deployment

### Step 4: Access Your Widget

Visit: `https://your-deployment-url.vercel.app/configurator`

You should see the widget configurator!

---

## Deployment Checklist

Before deploying, ensure you have:

- [ ] OpenAI API Key (https://platform.openai.com/api-keys)
- [ ] OpenAI Assistant ID (https://platform.openai.com/assistants)
- [ ] Assistant has File Search enabled
- [ ] PDFs uploaded to the assistant
- [ ] Vercel account (https://vercel.com)
- [ ] GitHub account with this repo forked

## Post-Deployment

### Test the Widget

1. Visit `/configurator` on your deployed URL
2. Customize colors, logo, and welcome message
3. Click "Generate Embed Code"
4. Copy the embed code
5. Test on a blank HTML page

### Verify OpenAI Integration

1. Go to `/widget` to see the chat interface
2. Try sending a message
3. Should get a response from your OpenAI Assistant

If you get errors:
- Check that your API key is correct
- Verify the Assistant ID matches your assistant
- Ensure assistant has File Search enabled
- Check Vercel logs: Dashboard → Deployments → Logs

### Monitor Usage

1. Go to https://platform.openai.com/usage
2. Monitor API usage and costs
3. Set usage limits if needed

---

## Environment Variables Explained

### `OPENAI_API_KEY`
- **Where to get**: https://platform.openai.com/api-keys
- **Format**: Starts with `sk-`
- **Security**: Never share this with anyone
- **Cost**: Pay-as-you-go based on API usage

### `OPENAI_ASSISTANT_ID`
- **Where to get**: https://platform.openai.com/assistants
- **Format**: Starts with `asst_`
- **Setup**: Create assistant, enable File Search, upload PDFs
- **Update**: Create new deployment if you change assistants

### `NEXT_PUBLIC_APP_URL`
- **Value**: Your Vercel deployment URL
- **Example**: `https://my-widget-12345.vercel.app`
- **Used for**: Embed script generation
- **IMPORTANT**: Must start with `https://`

### `POSTGRES_URL` (Auto-Created)
- **What it is**: Vercel's Postgres database connection string
- **Created**: Automatically by Vercel
- **Used by**: Database for storing threads and config
- **No action needed**: Vercel handles this

---

## Troubleshooting Deployment

### "Build Failed"

**Check logs**: Vercel Dashboard → Deployments → Click your deployment → Logs

Common issues:
- Missing environment variables
- TypeScript compilation error
- Node version incompatibility

**Solution**: Make sure all three env vars are set correctly.

### "Widget shows setup error"

This means the backend isn't configured correctly.

**Checklist**:
- [ ] API key is correct (doesn't start with `sk_test_`)
- [ ] Assistant ID is correct (starts with `asst_`)
- [ ] Assistant has File Search enabled
- [ ] Assistant has files uploaded
- [ ] `NEXT_PUBLIC_APP_URL` is set and matches your URL

**Debug**:
1. Go to `/widget` in incognito window
2. Open DevTools (F12) → Console
3. Look for error messages
4. Check Vercel logs for API errors

### "Database connection error"

Vercel Postgres might still be provisioning.

**Solution**:
1. Wait 5 minutes and refresh
2. Redeploy the project
3. Check Postgres status in Vercel dashboard

### Vercel Postgres not created

**Solution**:
1. Go to Vercel Dashboard
2. Go to Storage → Create Database
3. Choose Postgres
4. Link to your project
5. Redeploy

---

## Scaling & Costs

### Monthly Costs (Estimate)

| Component | Cost |
|-----------|------|
| Vercel Hosting | Free (starter) / $20+ (pro) |
| OpenAI API | ~$0.01-1.00 per 1K tokens |
| Vercel Postgres | Free (up to 256MB) / $15+ (pro) |
| Custom Domain | ~$12/year (optional) |

### Optimizing Costs

1. **Monitor API Usage**: https://platform.openai.com/usage
2. **Set OpenAI Budget**: https://platform.openai.com/account/billing/limits
3. **Thread Expiry**: Older than 7 days are automatically cleaned up
4. **Vercel Free Tier**: Good for testing, upgrade if needed

---

## Custom Domain (Optional)

To use your own domain (e.g., `widget.mycompany.com`):

1. In Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Follow DNS setup instructions
4. Update `NEXT_PUBLIC_APP_URL` to your domain
5. Redeploy

---

## Continuous Deployment

Every push to your GitHub branch will trigger automatic deployment to Vercel:

1. Make changes to your fork
2. Push to GitHub
3. Vercel automatically deploys
4. View deployment status in Vercel dashboard

---

## Rollback

To revert to a previous deployment:

1. Vercel Dashboard → Deployments
2. Find the deployment you want
3. Click the three dots → Promote to Production
4. Confirms and redeploys that version

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **GitHub Issues**: Report bugs on this repo

---

**You're all set!** Your widget is now live and ready to be embedded on any website. 🚀
