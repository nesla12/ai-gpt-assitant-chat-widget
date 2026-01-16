# Setup Guide

Complete step-by-step instructions to get your ChatGPT Widget running.

## Prerequisites

Before starting, you need:

1. **OpenAI Account** with:
   - An API key (https://platform.openai.com/api-keys)
   - An Assistant ID with File Search enabled (https://platform.openai.com/assistants)

2. **GitHub Account** (to fork this repo)

3. **Vercel Account** (free at https://vercel.com)

## Step 1: Create OpenAI Assistant

### 1.1 Create a new Assistant

1. Go to https://platform.openai.com/assistants
2. Click "Create"
3. Give it a name (e.g., "Social Media Assistant")
4. Add system instructions (e.g., "You are an expert in social media strategy...")
5. In **Tools**, enable "File Search"
6. Upload your PDFs (max 20 per assistant)
7. Click "Save"
8. Copy the **Assistant ID** (starts with `asst_`)

### 1.2 Get your API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. **Store safely** - you'll need it in the next step

## Step 2: Fork & Deploy

### 2.1 Fork the Repository

1. Go to this repo's GitHub page
2. Click **Fork** (top right)
3. Create fork in your account

### 2.2 Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your forked repo URL
4. Click "Import"

### 2.3 Add Environment Variables

On the "Configure Project" page, add these environment variables:

| Variable | Value |
|----------|-------|
| `OPENAI_API_KEY` | Your API key from Step 1.2 |
| `OPENAI_ASSISTANT_ID` | Your Assistant ID from Step 1.1 |
| `NEXT_PUBLIC_APP_URL` | Vercel will show your URL after deploy |

**Important:** Leave `NEXT_PUBLIC_APP_URL` empty for now. After deployment completes, you'll update it with your Vercel URL.

### 2.4 Enable Vercel Postgres

Vercel will automatically create a Postgres database for you. You don't need to do anything - it's configured automatically when you deploy.

### 2.5 Deploy

1. Click **Deploy**
2. Wait for deployment to complete (2-3 minutes)
3. You'll see a success message with your deployment URL

### 2.6 Update App URL

1. Go to your Vercel project settings (Dashboard → Project → Settings)
2. Click **Environment Variables**
3. Edit `NEXT_PUBLIC_APP_URL`
4. Set it to your deployment URL (e.g., `https://my-widget-abc123.vercel.app`)
5. Redeploy (Dashboard → Deployments → click your deployment → Redeploy)

## Step 3: Access Your Widget

Once deployed:

1. Visit `https://your-vercel-url.vercel.app/configurator`
2. You should see the widget configuration page
3. Customize colors, logo, welcome message
4. Click **Generate Embed Code**
5. Copy the embed code

## Step 4: Embed on Your Website

### For Systeme.io:

1. In Systeme.io, go to your sales page or website
2. Add an **HTML Block**
3. Paste the embed code:
   ```html
   <script src="https://your-vercel-url.vercel.app/embed.js"></script>
   ```
4. Save and publish
5. You should see the widget in the bottom-right corner

### For Other Websites:

Add this to your website's HTML (in the `<body>` or footer):

```html
<script src="https://your-vercel-url.vercel.app/embed.js"></script>
```

## Troubleshooting

### "Cannot find module '@vercel/postgres'"

**Solution:** You need to redeploy with environment variables set.

1. Go to Vercel dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Make sure `OPENAI_API_KEY` and `OPENAI_ASSISTANT_ID` are set
5. Redeploy

### "Failed to process message" when chatting

**Solution:** Check your OpenAI Assistant

1. Go to https://platform.openai.com/assistants
2. Click your assistant
3. Make sure **File Search** is enabled
4. Make sure files are uploaded
5. Check your API key has credits (https://platform.openai.com/usage)

### Widget not appearing on my website

**Solution:** Check the embed script

1. Open browser DevTools (F12)
2. Check the Console for errors
3. Make sure the script URL is correct
4. Make sure your website allows `<iframe>` tags
5. Check that your embed.js file was deployed (visit `https://your-url.vercel.app/embed.js`)

### "Widget not working after deployment"

**Solution:** Clear browser cache and hard refresh

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try in an incognito/private window
4. Check browser console for errors

## Local Development

If you want to test locally before deploying:

### 1. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/ai-gpt-assistant-chat-widget.git
cd ai-gpt-assistant-chat-widget
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env.local

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
OPENAI_API_KEY=sk_your_key
OPENAI_ASSISTANT_ID=asst_your_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Dev Server

```bash
npm run dev
```

Visit http://localhost:3000/configurator

### 5. Test Locally

- Customize the widget
- Click "Generate Embed Code"
- The code will point to `http://localhost:3000`
- For local embedding, set up a local web server to test

## Next Steps

After getting the widget working:

1. **Customize the assistant** - Improve system instructions based on feedback
2. **Update PDFs** - Add more files to your OpenAI Assistant
3. **Monitor usage** - Check OpenAI usage at https://platform.openai.com/usage
4. **Iterate** - Get feedback from visitors and improve

## Support

If you encounter issues:

1. Check the README.md for API documentation
2. Review the Troubleshooting section above
3. Check OpenAI Assistant settings
4. Check Vercel logs (Dashboard → Deployments → Logs)
5. Check browser console for errors (F12)

Good luck! 🚀
