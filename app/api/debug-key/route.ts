import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Key not set' }, { status: 500 });
  }
  return NextResponse.json({
    first4: key.substring(0, 4),
    last4: key.slice(-4),
    length: key.length,
  });
}