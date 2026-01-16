import { NextRequest, NextResponse } from 'next/server';
import { getWidgetConfig, saveWidgetConfig, initializeDatabase } from '@/lib/db';

// GET current widget config
export async function GET() {
  try {
    await initializeDatabase();
    const config = await getWidgetConfig();

    if (!config) {
      // Return default config if none exists
      return NextResponse.json({
        logoUrl: null,
        primaryColor: '#0066ff',
        accentColor: '#ffffff',
        welcomeMessage: 'Hello! How can I help you today?',
        subtitle: 'Powered by AI Assistant',
        position: 'bottom-right',
        theme: 'light',
      });
    }

    return NextResponse.json({
      logoUrl: config.logo_url,
      primaryColor: config.primary_color,
      accentColor: config.accent_color,
      welcomeMessage: config.welcome_message,
      subtitle: config.subtitle,
      position: config.position,
      theme: config.theme,
    });
  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

// POST update widget config
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const config = await request.json();

    const updated = await saveWidgetConfig({
      logoUrl: config.logoUrl,
      primaryColor: config.primaryColor,
      accentColor: config.accentColor,
      welcomeMessage: config.welcomeMessage,
      subtitle: config.subtitle,
      position: config.position,
      theme: config.theme,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to save config' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      logoUrl: updated.logo_url,
      primaryColor: updated.primary_color,
      accentColor: updated.accent_color,
      welcomeMessage: updated.welcome_message,
      subtitle: updated.subtitle,
      position: updated.position,
      theme: updated.theme,
    });
  } catch (error) {
    console.error('Config save error:', error);
    return NextResponse.json(
      { error: 'Failed to save config' },
      { status: 500 }
    );
  }
}
