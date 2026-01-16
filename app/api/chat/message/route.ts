import { NextRequest, NextResponse } from 'next/server';
import { addMessage, runAssistant, getLatestAssistantMessage } from '@/lib/openai';
import { saveMessage } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { threadId, message } = await request.json();

    if (!threadId || !message) {
      return NextResponse.json(
        { error: 'threadId and message required' },
        { status: 400 }
      );
    }

    // Add user message
    const userMsg = await addMessage(threadId, message);
    await saveMessage(threadId, userMsg.id, 'user', message);

    // Run assistant
    await runAssistant(threadId);

    // Get latest assistant response
    const assistantMsg = await getLatestAssistantMessage(threadId);

    if (!assistantMsg) {
      return NextResponse.json(
        { error: 'No response from assistant' },
        { status: 500 }
      );
    }

    // Extract text content
    const content = assistantMsg.content[0];
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'Unexpected response format' },
        { status: 500 }
      );
    }

    const textContent = content.text.value;
    await saveMessage(threadId, assistantMsg.id, 'assistant', textContent);

    return NextResponse.json({
      messageId: assistantMsg.id,
      response: textContent,
    });
  } catch (error) {
    console.error('Message error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
