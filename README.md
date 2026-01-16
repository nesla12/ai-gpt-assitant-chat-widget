# ChatGPT Widget Configurator & Embed System

A standalone widget builder for creating embeddable AI chat assistants powered by OpenAI Assistants. Configure branding, generate embed code, and deploy to your website in minutes.

## Features

✅ **Widget Configurator** - Customize colors, logo, welcome message, and subtitle
✅ **Real-time Preview** - See changes instantly
✅ **Persistent Threads** - Visitor conversations stored in Vercel Postgres
✅ **Embed Code Generator** - Copy-paste script for any website
✅ **OpenAI Integration** - Works with your existing OpenAI Assistant
✅ **Stateless Deployment** - Deploy on Vercel with no server management

## Quick Start

### Prerequisites

- OpenAI Assistant ID (with File Search enabled and uploaded PDFs)
- OpenAI API Key
- Vercel account (free tier works)

### 1. Fork & Clone

```bash
git clone <your-fork-url>
cd ai-gpt-assistant-chat-widget
npm install
```

### 2. Set Environment Variables

Create `.env.local`:

```env
OPENAI_API_KEY=sk_your_api_key_here
OPENAI_ASSISTANT_ID=asst_your_assistant_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000/configurator`

### 4. Deploy to Vercel

**Option A: One-Click Deploy** (Coming soon - button will auto-setup)

**Option B: Manual Deploy**

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel settings
4. Deploy

Once deployed, Vercel will automatically:
- Provision PostgreSQL database
- Create API routes for OpenAI proxy
- Host configurator + widget

## How It Works

```
1. User accesses /configurator
   ↓
2. Customizes widget (colors, branding)
   ↓
3. Clicks "Generate Embed Code"
   ↓
4. Copies embed.js script to their website
   ↓
5. Script injects iframe with widget
   ↓
6. Visitor chats → Backend proxies to OpenAI Assistant
   ↓
7. Threads stored in Postgres (7-day expiry)
```

## Architecture

### Frontend
- **Configurator** (`/configurator`) - Admin UI for building widget
- **Widget** (`/widget`) - Chat interface embedded in iframe

### Backend
- **API Routes** (`/api/chat/*`, `/api/widget/*`) - Secure OpenAI proxy
- **Database** (Vercel Postgres) - Thread persistence
- **Embed Script** (`/public/embed.js`) - Injection script for external sites

### Security
- ✅ OpenAI API key never exposed to client
- ✅ Backend proxies all OpenAI calls
- ✅ iframe sandboxing for embedded widget
- ✅ Visitor IDs stored locally, threads in Postgres

## File Structure

```
/app
  /configurator      # Widget builder UI
  /widget           # Chat interface
  /api
    /chat
      /thread       # Create/get visitor thread
      /message      # Send message to assistant
    /widget
      /config       # Get/save widget config
/lib
  /db.ts            # Database utilities
  /openai.ts        # OpenAI client wrapper
/public
  /embed.js         # Embedding script
```

## Configuration

In the configurator, customize:
- **Logo URL** - Your brand logo
- **Primary Color** - Main theme color (hex)
- **Accent Color** - Button/text color (hex)
- **Welcome Message** - Initial greeting
- **Subtitle** - Secondary text
- **Position** - Bottom-right or bottom-left
- **Theme** - Light or dark mode

All settings persist in the database and apply to all new visitors.

## API Endpoints

### GET `/api/widget/config`
Get current widget configuration

```json
{
  "logoUrl": "https://...",
  "primaryColor": "#0066ff",
  "accentColor": "#ffffff",
  "welcomeMessage": "Hello!",
  "subtitle": "AI Assistant",
  "position": "bottom-right",
  "theme": "light"
}
```

### POST `/api/widget/config`
Update widget configuration (same schema as above)

### POST `/api/chat/thread`
Create or retrieve visitor thread

```json
{
  "visitorId": "uuid-string"
}
```

Returns: `{ "threadId": "thread_..." }`

### POST `/api/chat/message`
Send message to assistant

```json
{
  "threadId": "thread_...",
  "message": "User question"
}
```

Returns: `{ "messageId": "msg_...", "response": "Assistant reply" }`

## Thread Management

- Each visitor gets a unique `visitorId` stored in localStorage
- Threads expire after 7 days
- Old threads automatically cleaned up by cron (setup in Vercel)
- To manually clear threads, delete from database

## Embedding on External Sites

Copy this to your website (e.g., Systeme.io HTML block):

```html
<script src="https://your-vercel-app.vercel.app/embed.js"></script>
```

That's it! The widget will appear in the bottom-right corner.

To customize position, add before the script:

```html
<script>
  window.AIWidgetConfig = { position: 'bottom-left' };
</script>
<script src="https://your-vercel-app.vercel.app/embed.js"></script>
```

## Development

### Local Testing

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

### Database

Connected to Vercel Postgres automatically when deployed. For local development, you can:
1. Create a free Vercel Postgres database
2. Update `DATABASE_URL` in `.env.local`
3. Database tables are auto-created on first API call

### TypeScript

Full type safety with strict mode enabled.

## Troubleshooting

### "Failed to fetch config" on widget load
- Check database connection
- Verify Postgres URL in `.env.local`

### "Failed to process message" when sending messages
- Verify `OPENAI_API_KEY` is correct
- Check `OPENAI_ASSISTANT_ID` matches actual assistant
- Ensure assistant has File Search enabled

### Widget not showing on embedded site
- Check browser console for CORS errors
- Verify embed script URL is correct
- Ensure embedding site allows iframe injection

## Next Steps

- Add file upload to change assistant PDFs per widget
- Add analytics dashboard (conversation volume, popular topics)
- Add custom CSS injection for deeper styling
- Add multi-widget support with API key management
- Add conversation history export

## License

MIT
