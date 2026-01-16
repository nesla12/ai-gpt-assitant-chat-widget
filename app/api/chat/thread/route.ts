import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getOrCreateThread, saveThread } from '@/lib/db';
import { createThread } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { visitorId } = await request.json();

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
    }

    // Check if thread already exists
    let threadId = await getOrCreateThread(visitorId);

    // If no existing thread, create a new one
    if (!threadId) {
      threadId = await createThread();
      await saveThread(visitorId, threadId);
    }

    return NextResponse.json({ threadId });
  } catch (error) {
    console.error('Thread creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}
