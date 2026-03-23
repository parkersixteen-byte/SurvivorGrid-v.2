import { NextResponse } from 'next/server';
import { getPublishedPuzzleByDate } from '@/lib/repository';

export async function GET() {
  const date = new Date().toISOString().slice(0, 10);
  const puzzle = await getPublishedPuzzleByDate(date);
  return NextResponse.json({ puzzle });
}
