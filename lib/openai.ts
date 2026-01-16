import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

if (!process.env.OPENAI_ASSISTANT_ID) {
  throw new Error('OPENAI_ASSISTANT_ID is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

// Create a new thread
export async function createThread() {
  const thread = await openai.beta.threads.create();
  return thread.id;
}

// Add a message to thread
export async function addMessage(threadId: string, content: string) {
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content,
  });
  return message;
}

// Run assistant on thread
export async function runAssistant(threadId: string) {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID,
  });

  // Poll for completion
  let completedRun = run;
  let attempts = 0;
  const maxAttempts = 60; // 30 seconds with 500ms intervals

  while (completedRun.status !== 'completed' && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    completedRun = await openai.beta.threads.runs.retrieve(threadId, run.id as unknown as any);
    attempts++;
  }

  if (completedRun.status !== 'completed') {
    throw new Error(`Run did not complete. Status: ${completedRun.status}`);
  }

  return completedRun;
}

// Get messages from thread
export async function getThreadMessages(threadId: string) {
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages.data;
}

// Get latest assistant message
export async function getLatestAssistantMessage(threadId: string) {
  const messages = await getThreadMessages(threadId);
  const assistantMessage = messages.find((msg) => msg.role === 'assistant');
  return assistantMessage;
}
