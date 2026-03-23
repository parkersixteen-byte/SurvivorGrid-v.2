import { NextResponse } from 'next/server';
import { getArchive } from '@/lib/repository';

export async function GET() {
  const puzzles = await getArchive(60);
  return NextResponse.json({ puzzles });
}
