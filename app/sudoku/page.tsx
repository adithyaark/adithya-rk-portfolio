import type { Metadata } from "next";
import { Header } from "../components/Header";
import { SudokuGame } from "./SudokuGame";
import "./sudoku.css";

export const metadata: Metadata = {
  title: "Sudoku — Adithya R K Nambiar",
  description: "A quiet game of Sudoku between the projects: fresh puzzles in three difficulties, each with exactly one solution.",
};

export default function SudokuPage() {
  return (
    <main className="world dark sudoku-page" id="top">
      <Header skipTo="#sudoku" />
      <div className="sudoku-head" id="sudoku">
        <p className="kicker">A small break</p>
        <h1 className="display sudoku-title">Sudoku.</h1>
        <p className="section-note">Fill every row, column and 3×3 box with the digits 1–9. Each puzzle is freshly generated and has exactly one solution.</p>
      </div>
      <SudokuGame />
    </main>
  );
}
