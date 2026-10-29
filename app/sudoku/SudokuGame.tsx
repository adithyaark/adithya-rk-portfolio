"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { boxOf, colOf, makePuzzle, PEERS, rowOf, type Difficulty } from "./sudoku";

type Game = {
  difficulty: Difficulty;
  puzzle: number[];
  solution: number[];
  values: number[];
  notes: number[];
  mistakes: number;
  hints: number;
  elapsed: number;
  solved: boolean;
};

type Snapshot = Pick<Game, "values" | "notes">;

const STORAGE_KEY = "ark-sudoku";
const LEVELS: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function createGame(difficulty: Difficulty): Game {
  const { puzzle, solution } = makePuzzle(difficulty);
  return { difficulty, puzzle, solution, values: puzzle.slice(), notes: Array(81).fill(0), mistakes: 0, hints: 0, elapsed: 0, solved: false };
}

// A saved game is a convenience only: anything unreadable starts a fresh puzzle.
function loadGame(): Game | null {
  try {
    const game = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Game | null;
    if (game && [game.puzzle, game.solution, game.values, game.notes].every((list) => Array.isArray(list) && list.length === 81)) return game;
  } catch {}
  return null;
}

function saveGame(game: Game) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch {}
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

// Placing a digit removes it from the pencil marks of every peer.
function clearPeerNotes(notes: number[], index: number, digit: number) {
  for (const peer of PEERS[index]) notes[peer] &= ~(1 << (digit - 1));
}

const isSolved = (values: number[], solution: number[]) => values.every((value, i) => value === solution[i]);

export function SudokuGame() {
  const [game, setGame] = useState<Game | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const history = useRef<Snapshot[]>([]);

  // Puzzles are random, so they are only created in the browser.
  useEffect(() => setGame(loadGame() ?? createGame("easy")), []);
  useEffect(() => {
    if (game) saveGame(game);
  }, [game]);

  const playing = game !== null && !game.solved;
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setGame((current) => (current && !current.solved ? { ...current, elapsed: current.elapsed + 1 } : current));
    }, 1000);
    return () => clearInterval(timer);
  }, [playing]);

  const start = (difficulty: Difficulty) => {
    history.current = [];
    setSelected(null);
    setNotesMode(false);
    setGame(createGame(difficulty));
  };

  const remember = (current: Game) => {
    history.current.push({ values: current.values.slice(), notes: current.notes.slice() });
    if (history.current.length > 200) history.current.shift();
  };

  const input = useCallback(
    (digit: number) => {
      if (!game || game.solved || selected === null || game.puzzle[selected]) return;
      const values = game.values.slice();
      const notes = game.notes.slice();

      if (notesMode && digit) {
        if (values[selected]) return;
        remember(game);
        notes[selected] ^= 1 << (digit - 1);
        setGame({ ...game, notes });
        return;
      }

      if (values[selected] === digit && (digit || !notes[selected])) return;
      remember(game);
      values[selected] = digit;
      notes[selected] = 0;
      let mistakes = game.mistakes;
      if (digit) {
        clearPeerNotes(notes, selected, digit);
        if (digit !== game.solution[selected]) mistakes++;
      }
      setGame({ ...game, values, notes, mistakes, solved: isSolved(values, game.solution) });
    },
    [game, notesMode, selected],
  );

  const hint = () => {
    if (!game || game.solved) return;
    const needsHelp = (i: number) => game.values[i] !== game.solution[i];
    const target = selected !== null && !game.puzzle[selected] && needsHelp(selected) ? selected : game.values.findIndex((_, i) => needsHelp(i));
    if (target === -1) return;
    remember(game);
    const values = game.values.slice();
    const notes = game.notes.slice();
    values[target] = game.solution[target];
    notes[target] = 0;
    clearPeerNotes(notes, target, values[target]);
    setSelected(target);
    setGame({ ...game, values, notes, hints: game.hints + 1, solved: isSolved(values, game.solution) });
  };

  const undo = useCallback(() => {
    const snapshot = history.current.pop();
    if (game && !game.solved && snapshot) setGame({ ...game, ...snapshot });
  }, [game]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey) return;
      if (event.ctrlKey) {
        if (event.key.toLowerCase() === "z") {
          event.preventDefault();
          undo();
        }
        return;
      }
      if (/^[1-9]$/.test(event.key)) input(Number(event.key));
      else if (["Backspace", "Delete", "0"].includes(event.key)) input(0);
      else if (event.key.toLowerCase() === "n") setNotesMode((on) => !on);
      else if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        setSelected((current) => {
          if (current === null) return 0;
          const row = rowOf(current);
          const col = colOf(current);
          if (event.key === "ArrowUp") return ((row + 8) % 9) * 9 + col;
          if (event.key === "ArrowDown") return ((row + 1) % 9) * 9 + col;
          if (event.key === "ArrowLeft") return row * 9 + ((col + 8) % 9);
          return row * 9 + ((col + 1) % 9);
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [input, undo]);

  const values = game?.values ?? Array<number>(81).fill(0);
  const selectedValue = selected !== null ? values[selected] : 0;
  const placed = (digit: number) => values.filter((value) => value === digit).length;

  return (
    <div className="sudoku">
      <div className="sudoku-board-wrap">
        <div className="sudoku-board" aria-label="Sudoku board" role="group">
          {values.map((value, index) => {
            const given = Boolean(game?.puzzle[index]);
            const wrong = Boolean(game && value && !given && value !== game.solution[index]);
            const peer = selected !== null && index !== selected && (rowOf(index) === rowOf(selected) || colOf(index) === colOf(selected) || boxOf(index) === boxOf(selected));
            const classes = [
              "sudoku-cell",
              given ? "given" : value ? "user" : "",
              wrong ? "wrong" : "",
              index === selected ? "selected" : peer ? "peer" : "",
              selectedValue && value === selectedValue && index !== selected ? "same" : "",
              colOf(index) % 3 === 2 && colOf(index) < 8 ? "edge-r" : "",
              rowOf(index) % 3 === 2 && rowOf(index) < 8 ? "edge-b" : "",
            ];
            const notes = game?.notes[index] ?? 0;
            return (
              <button
                key={index}
                type="button"
                className={classes.filter(Boolean).join(" ")}
                onClick={() => setSelected(index)}
                aria-label={`Row ${rowOf(index) + 1}, column ${colOf(index) + 1}: ${value || "empty"}${given ? ", given" : ""}${wrong ? ", incorrect" : ""}`}
              >
                {value ? value : notes ? (
                  <span className="sudoku-notes" aria-hidden="true">
                    {DIGITS.map((digit) => <span key={digit}>{notes & (1 << (digit - 1)) ? digit : ""}</span>)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {game?.solved && (
          <div className="sudoku-solved" role="status">
            <span>Solved · {LEVELS.find((level) => level.id === game.difficulty)?.label}</span>
            <strong>{formatTime(game.elapsed)}</strong>
            <p>{plural(game.mistakes, "mistake")} · {plural(game.hints, "hint")}</p>
            <button className="talk-send" type="button" onClick={() => start(game.difficulty)}>New puzzle</button>
          </div>
        )}
      </div>

      <aside className="sudoku-panel">
        <div className="sudoku-levels" role="radiogroup" aria-label="Difficulty">
          {LEVELS.map((level) => (
            <button key={level.id} type="button" role="radio" aria-checked={game?.difficulty === level.id} onClick={() => start(level.id)}>
              {level.label}
            </button>
          ))}
        </div>

        <dl className="sudoku-stats">
          <div><dt>Time</dt><dd>{formatTime(game?.elapsed ?? 0)}</dd></div>
          <div><dt>Mistakes</dt><dd>{game?.mistakes ?? 0}</dd></div>
          <div><dt>Hints</dt><dd>{game?.hints ?? 0}</dd></div>
        </dl>

        <div className="sudoku-pad" aria-label="Number pad">
          {DIGITS.map((digit) => {
            const left = 9 - placed(digit);
            return (
              <button key={digit} type="button" onClick={() => input(digit)} disabled={left <= 0 && !notesMode} aria-label={`${notesMode ? "Note " : ""}${digit}, ${Math.max(left, 0)} left`}>
                {digit}
                <small>{Math.max(left, 0)}</small>
              </button>
            );
          })}
        </div>

        <div className="sudoku-actions">
          <button type="button" onClick={undo}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" /></svg>
            Undo
          </button>
          <button type="button" onClick={() => input(0)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            Erase
          </button>
          <button type="button" aria-pressed={notesMode} onClick={() => setNotesMode((on) => !on)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z" /></svg>
            Notes {notesMode ? "on" : "off"}
          </button>
          <button type="button" onClick={hint}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></svg>
            Hint
          </button>
        </div>

        <button className="talk-send sudoku-new" type="button" onClick={() => game && start(game.difficulty)}>New puzzle</button>

        <p className="sudoku-help">
          Keys: <b>1–9</b> fill · <b>Arrows</b> move · <b>N</b> notes · <b>Backspace</b> erase · <b>Ctrl+Z</b> undo
        </p>
      </aside>
    </div>
  );
}
