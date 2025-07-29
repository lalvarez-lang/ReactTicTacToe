import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard.jsx";
import Player from "./components/Player.jsx";
import Log from "./components/Log.jsx";
import { WINNING_COMBINATIONS } from "./components/winning-combinations.js";
import GameOver from "./components/GameOver.jsx";

function App() {
  const [players, setPlayers] = useState({
    X: 'Player 1',
    O: 'Player 2'
  });

  const [gameBoard, setGameBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [activePlayer, setActivePlayer] = useState('X');
  const [gameTurns, setGameTurns] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    // Check for a winner or draw after each turn
    const checkGameStatus = () => {
      // Check for a winner
      for (const combination of WINNING_COMBINATIONS) {
        const [first, second, third] = combination.map(({ row, column }) => gameBoard[row][column]);
        if (first && first === second && first === third) {
          setWinner(first);
          return;
        }
      }

      // Check for a draw
      const isFull = gameBoard.every(row => row.every(cell => cell !== null));
      if (isFull) {
        setIsDraw(true);
      }
    };

    checkGameStatus();
  }, [gameBoard]);

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    if (gameBoard[rowIndex][colIndex] !== null || winner) {
      return; // No hacer nada si la casilla ya está ocupada o si hay un ganador
    }

    const updatedBoard = gameBoard.map((row, rIndex) => 
      row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? activePlayer : cell))
    );

    setGameBoard(updatedBoard);
    setGameTurns(prevTurns => [
      ...prevTurns,
      { square: { row: rowIndex, col: colIndex }, player: activePlayer }
    ]);

    setActivePlayer((curActivePlayer) => (curActivePlayer === 'X' ? 'O' : 'X'));
  }

  function HandleRestart() {
    setGameBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setActivePlayer('X');
    setGameTurns([]);
    setWinner(null);
    setIsDraw(false);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => ({
      ...prevPlayers,
      [symbol]: newName 
    }));
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player 
            initialName={players.X} 
            symbol="X" 
            isActive={activePlayer === 'X'} 
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            initialName={players.O} 
            symbol="O" 
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver 
            winner={winner ? players[winner] : null} // Pasar el nombre del ganador
            onRestart={HandleRestart} 
          />
        )}
        <GameBoard 
          onSelectSquare={handleSelectSquare}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;