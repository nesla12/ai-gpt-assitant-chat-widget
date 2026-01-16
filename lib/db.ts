import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create widget_configs table
    await sql`
      CREATE TABLE IF NOT EXISTS widget_configs (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Branding
        logo_url TEXT,
        primary_color VARCHAR(7) DEFAULT '#0066ff',
        accent_color VARCHAR(7) DEFAULT '#ffffff',
        welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
        subtitle TEXT DEFAULT 'Powered by AI Assistant',

        -- Position
        position VARCHAR(20) DEFAULT 'bottom-right',

        -- Theme
        theme VARCHAR(10) DEFAULT 'light'
      );
    `;

    // Create threads table (stores conversation threads per visitor)
    await sql`
      CREATE TABLE IF NOT EXISTS threads (
        id VARCHAR(255) PRIMARY KEY,
        thread_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,

        INDEX idx_created_at (created_at),
        INDEX idx_expires_at (expires_at)
      );
    `;

    // Create messages table (cache for conversation history)
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        thread_id VARCHAR(255) NOT NULL,
        openai_message_id VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (thread_id, openai_message_id),
        INDEX idx_thread_id (thread_id)
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    // Table might already exist, which is fine
    if (!(error as any).message?.includes('already exists')) {
      console.error('Database initialization error:', error);
    }
  }
}

// Get widget configuration
export async function getWidgetConfig() {
  try {
    const result = await sql`SELECT * FROM widget_configs LIMIT 1`;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching widget config:', error);
    return null;
  }
}

// Save or update widget configuration
export async function saveWidgetConfig(config: {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  welcomeMessage?: string;
  subtitle?: string;
  position?: string;
  theme?: string;
}) {
  try {
    const existing = await getWidgetConfig();

    if (existing) {
      await sql`
        UPDATE widget_configs
        SET
          logo_url = COALESCE(${config.logoUrl}, logo_url),
          primary_color = COALESCE(${config.primaryColor}, primary_color),
          accent_color = COALESCE(${config.accentColor}, accent_color),
          welcome_message = COALESCE(${config.welcomeMessage}, welcome_message),
          subtitle = COALESCE(${config.subtitle}, subtitle),
          position = COALESCE(${config.position}, position),
          theme = COALESCE(${config.theme}, theme),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.id}
      `;
    } else {
      await sql`
        INSERT INTO widget_configs (
          logo_url, primary_color, accent_color, welcome_message, subtitle, position, theme
        ) VALUES (
          ${config.logoUrl}, ${config.primaryColor}, ${config.accentColor},
          ${config.welcomeMessage}, ${config.subtitle}, ${config.position}, ${config.theme}
        )
      `;
    }

    return getWidgetConfig();
  } catch (error) {
    console.error('Error saving widget config:', error);
    throw error;
  }
}

// Get or create thread for visitor
export async function getOrCreateThread(visitorId: string): Promise<string> {
  try {
    // Check if thread exists and not expired
    const result = await sql`
      SELECT thread_id FROM threads
      WHERE id = ${visitorId}
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;

    if (result.rows.length > 0) {
      // Update last accessed time
      await sql`UPDATE threads SET last_accessed = CURRENT_TIMESTAMP WHERE id = ${visitorId}`;
      return result.rows[0].thread_id;
    }

    // Thread doesn't exist or expired, will create new one
    return '';
  } catch (error) {
    console.error('Error getting thread:', error);
    return '';
  }
}

// Save new thread
export async function saveThread(visitorId: string, threadId: string, expiresInDays: number = 7) {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await sql`
      INSERT INTO threads (id, thread_id, expires_at)
      VALUES (${visitorId}, ${threadId}, ${expiresAt.toISOString()})
      ON CONFLICT (id) DO UPDATE
      SET thread_id = ${threadId}, last_accessed = CURRENT_TIMESTAMP, expires_at = ${expiresAt.toISOString()}
    `;

    return threadId;
  } catch (error) {
    console.error('Error saving thread:', error);
    throw error;
  }
}

// Get message history for thread
export async function getMessageHistory(threadId: string) {
  try {
    const result = await sql`
      SELECT role, content, created_at FROM messages
      WHERE thread_id = ${threadId}
      ORDER BY created_at ASC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching message history:', error);
    return [];
  }
}

// Save message to cache
export async function saveMessage(
  threadId: string,
  messageId: string,
  role: string,
  content: string
) {
  try {
    await sql`
      INSERT INTO messages (thread_id, openai_message_id, role, content)
      VALUES (${threadId}, ${messageId}, ${role}, ${content})
      ON CONFLICT (thread_id, openai_message_id) DO NOTHING
    `;
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

// Clear old expired threads
export async function cleanupExpiredThreads() {
  try {
    await sql`DELETE FROM threads WHERE expires_at < CURRENT_TIMESTAMP`;
  } catch (error) {
    console.error('Error cleaning up threads:', error);
  }
}
