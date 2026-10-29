// Sudoku generation and solving on a flat 81-cell board (0 = empty).
// Candidates are 9-bit masks; the solver always branches on the cell with
// the fewest candidates, which keeps uniqueness checks fast.

export type Difficulty = "easy" | "medium" | "hard";

const TARGET_CLUES: Record<Difficulty, number> = { easy: 40, medium: 32, hard: 26 };
const ALL = 0x1ff;

export const rowOf = (index: number) => Math.floor(index / 9);
export const colOf = (index: number) => index % 9;
export const boxOf = (index: number) => Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);

// Every cell's 20 peers: the other cells in its row, column and box.
export const PEERS: number[][] = Array.from({ length: 81 }, (_, index) => {
  const peers: number[] = [];
  for (let other = 0; other < 81; other++) {
    if (other === index) continue;
    if (rowOf(other) === rowOf(index) || colOf(other) === colOf(index) || boxOf(other) === boxOf(index)) peers.push(other);
  }
  return peers;
});

const bitCount = (mask: number) => {
  let count = 0;
  for (let m = mask; m; m &= m - 1) count++;
  return count;
};

function candidates(grid: number[], index: number) {
  let used = 0;
  for (const peer of PEERS[index]) if (grid[peer]) used |= 1 << (grid[peer] - 1);
  return ALL & ~used;
}

// The empty cell with the fewest candidates, or -1 when the board is full.
function mostConstrained(grid: number[]) {
  let best = -1;
  let bestMask = 0;
  let bestCount = 10;
  for (let index = 0; index < 81; index++) {
    if (grid[index]) continue;
    const mask = candidates(grid, index);
    const count = bitCount(mask);
    if (count < bestCount) {
      best = index;
      bestMask = mask;
      bestCount = count;
      if (count <= 1) break;
    }
  }
  return { index: best, mask: bestMask };
}

// Counts solutions, stopping once `limit` is reached. Mutates then restores grid.
function countSolutions(grid: number[], limit: number): number {
  const { index, mask } = mostConstrained(grid);
  if (index === -1) return 1;
  let count = 0;
  for (let digit = 1; digit <= 9 && count < limit; digit++) {
    if (!(mask & (1 << (digit - 1)))) continue;
    grid[index] = digit;
    count += countSolutions(grid, limit - count);
  }
  grid[index] = 0;
  return count;
}

function shuffle<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function fillRandomly(grid: number[]): boolean {
  const { index, mask } = mostConstrained(grid);
  if (index === -1) return true;
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((digit) => mask & (1 << (digit - 1))));
  for (const digit of digits) {
    grid[index] = digit;
    if (fillRandomly(grid)) return true;
  }
  grid[index] = 0;
  return false;
}

// A full random solution, then clues removed one by one in random order,
// skipping any removal that would allow a second solution.
export function makePuzzle(difficulty: Difficulty) {
  const solution = Array<number>(81).fill(0);
  fillRandomly(solution);

  const puzzle = solution.slice();
  let clues = 81;
  for (const index of shuffle(Array.from({ length: 81 }, (_, i) => i))) {
    if (clues <= TARGET_CLUES[difficulty]) break;
    const kept = puzzle[index];
    puzzle[index] = 0;
    if (countSolutions(puzzle.slice(), 2) === 1) clues--;
    else puzzle[index] = kept;
  }

  return { puzzle, solution };
}
