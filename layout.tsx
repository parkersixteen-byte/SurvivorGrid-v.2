import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeRarityScore, labelFor, validatePlayer } from '@/lib/game';
import { getPlayerById, getPublishedPuzzleByDate } from '@/lib/repository';

const payloadSchema = z.object({
  playerId: z.string(),
  rowIndex: z.number().int().min(0).max(2),
  colIndex: z.number().int().min(0).max(2),
  puzzleDate: z.string().optional()
});

export async function POST(request: NextRequest) {
  const parsed = payloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const { playerId, rowIndex, colIndex, puzzleDate } = parsed.data;
  const targetDate = puzzleDate || new Date().toISOString().slice(0, 10);
  const puzzle = await getPublishedPuzzleByDate(targetDate);
  const player = await getPlayerById(playerId);

  if (!player) {
    return NextResponse.json({ error: 'Player not found.' }, { status: 404 });
  }

  const rowClue = puzzle.row_clues[rowIndex];
  const colClue = puzzle.col_clues[colIndex];
  const correct = validatePlayer(player, rowClue, colClue);

  return NextResponse.json({
    correct,
    rowLabel: labelFor(rowClue),
    colLabel: labelFor(colClue),
    rarityScore: correct ? computeRarityScore(playerId) : undefined
  });
}
