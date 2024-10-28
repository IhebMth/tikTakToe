import React, { useState, useEffect } from 'react';
import Board from './Board';

const Game: React.FC = () => {
  const [boardSize, setBoardSize] = useState(3);
  const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(''));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isPlayingWithComputer, setIsPlayingWithComputer] = useState(false);

  useEffect(() => {
    setSquares(Array(boardSize * boardSize).fill('')); 
  }, [boardSize]);

  const handleClick = (index: number) => {
    if (squares[index] || calculateWinner(squares, boardSize)) return;

    const nextSquares = [...squares];
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);

    const winner = calculateWinner(nextSquares, boardSize);
    if (winner) {
      setScore(prevScore => ({
        ...prevScore,
        [winner]: (prevScore[winner as keyof typeof prevScore] || 0) + 1,
      }));
    } else if (nextSquares.every(square => square !== '')) {
      resetGame();
    } else {
      setXIsNext(!xIsNext);
    }
  };

  useEffect(() => {
    if (isPlayingWithComputer && !xIsNext) {
      const computerMove = () => {
        const emptySquares = squares.map((square, index) => square === '' ? index : null).filter(x => x !== null);
        if (emptySquares.length > 0) {
          const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
          handleClick(randomIndex);
        }
      };
      const timeoutId = setTimeout(computerMove, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [squares, xIsNext, isPlayingWithComputer]);

  const resetGame = () => {
    setSquares(Array(boardSize * boardSize).fill(''));
    setXIsNext(true);
  };

  const togglePlayMode = () => {
    setIsPlayingWithComputer(!isPlayingWithComputer);
    resetGame();
  };

  const changeBoardSize = (newSize: number) => {
    setBoardSize(newSize);
  };

  return (
    <div className='flex flex-col items-center'>
      <Board squares={squares} onClick={handleClick} boardSize={boardSize} />
      <div className="mt-4 text-center">
        {calculateWinner(squares, boardSize) ? (
          <div className="text-2xl font-bold text-green-500">Winner: {calculateWinner(squares, boardSize)} 🎉</div>
        ) : (
          <div className="text-xl font-medium">Next Player: {xIsNext ? 'X' : 'O'}</div>
        )}
      </div>
      <div className="flex mt-6 space-x-4">
        <button
          onClick={resetGame}
          className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-700 transition duration-300 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105"
        >
          Reset Game
        </button>
        <button
          onClick={togglePlayMode}
          className="flex-1 px-6 py-3 bg-blue-700 hover:bg-blue-900 transition duration-300 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105"
        >
          {isPlayingWithComputer ? 'Play with Friend' : 'Play with Computer'}
        </button>
      </div>
      <div className="mt-6 text-lg text-center border-t border-gray-300 pt-4">
        <p className="font-semibold">Score</p>
        <p className="text-xl">X: {score.X} | O: {score.O}</p>
      </div>
      <div className="mt-4">
        <button onClick={() => changeBoardSize(3)} className="mx-2 bg-gray-700 hover:bg-gray-500 rounded-lg shadow-lg p-2">3x3</button>
        <button onClick={() => changeBoardSize(4)} className="mx-2 bg-gray-700 hover:bg-gray-500 rounded-lg shadow-lg p-2">4x4</button>
        <button onClick={() => changeBoardSize(5)} className="mx-2 bg-gray-700 hover:bg-gray-500 rounded-lg shadow-lg p-2">5x5</button>
      </div>
    </div>
  );
};

const calculateWinner = (squares: string[], size: number) => {
  const lines = [];

  
  for (let i = 0; i < size; i++) {
    lines.push(Array.from({ length: size }, (_, j) => i * size + j)); 
    lines.push(Array.from({ length: size }, (_, j) => j * size + i)); 
  }

 
  lines.push(Array.from({ length: size }, (_, i) => i * (size + 1))); 
  lines.push(Array.from({ length: size }, (_, i) => (i + 1) * (size - 1))); 

  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default Game;
