import React, { useMemo, useState } from "react";
import "./App.css";

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

function getStatusText({ winner, isDraw, xIsNext }) {
  if (winner) return `Winner: ${winner}`;
  if (isDraw) return "It's a draw!";
  return `Turn: ${xIsNext ? "X" : "O"}`;
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Tic Tac Toe SPA entry component.
   * Renders the centered 3x3 board, shows turn/winner/draw state, and allows resetting the game.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = !winner && isBoardFull(squares);
  const statusText = getStatusText({ winner, isDraw, xIsNext });

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Handle player move for a square click. No-op if game is over or square already filled. */
    if (winner || isDraw) return;
    if (squares[index] !== null) return;

    const next = squares.slice();
    next[index] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((v) => !v);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /** Reset the board back to initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="app">
      <main className="card" aria-label="Tic Tac Toe game">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Two-player local game</p>
        </header>

        <section className="status" aria-live="polite">
          <span
            className={[
              "statusBadge",
              winner ? "statusBadge--winner" : "",
              isDraw ? "statusBadge--draw" : "",
            ].join(" ")}
          >
            {statusText}
          </span>
        </section>

        <section className="boardWrap">
          <div className="board" role="grid" aria-label="3 by 3 Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinningSquare = line?.includes(idx) ?? false;
              const isDisabled = Boolean(winner || isDraw || value !== null);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "square",
                    value ? `square--${value}` : "",
                    isWinningSquare ? "square--win" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}`}
                >
                  <span className="squareValue" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="footer">
          <button type="button" className="resetBtn" onClick={handleReset}>
            Reset game
          </button>

          <p className="hint">
            Tip: First player is <strong>X</strong>. Click any empty square to make a move.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
