import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Replace these with your ACTUAL Cloudflare values
const CLOUDFLARE_ACCOUNT_ID = 'your-actual-account-id'; // Get from Cloudflare dashboard
const CLOUDFLARE_GATEWAY_NAME = 'my-gateway'; // The name you used in step 1

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model = 'llama-3.3-70b-versatile', temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'messages array is required' },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: model,
      temperature: temperature,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    return NextResponse.json({
      status: 'success',
      data: content,
    });

  } catch (err: any) {
    console.error('Groq error:', err);
    return NextResponse.json(
      { status: 'error', message: err?.message || 'Failed' },
      { status: err.status || 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: 'error', message: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}