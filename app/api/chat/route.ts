import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const systemPrompt = `Please respond with no special characters and no emojis. Give me Simple text that is helpful and answers the question: ${prompt}`;
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/chatgpt-4o-latest',
      messages: [{ role: 'user', content: systemPrompt }],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || "No response from AI.";
  return NextResponse.json({ message });
} 