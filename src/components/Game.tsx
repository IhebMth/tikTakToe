import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Board from './Board';

type GameProps = {
  boardSize: number; 
  setBoardSize: React.Dispatch<React.SetStateAction<number>>; 
};

const Game: React.FC<GameProps> = ({ boardSize, setBoardSize }) => {
  const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(''));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isPlayingWithComputer, setIsPlayingWithComputer] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');
  const [symbolChosen, setSymbolChosen] = useState(false);

  
  useEffect(() => {
    setSquares(Array(boardSize * boardSize).fill(''));
  }, [boardSize]);

  const chooseSymbol = () => {
    if (!symbolChosen) {
      toast.info(
        <div className="w-full flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-xl text-center border border-gray-300">
          <p className="mb-4 text-lg font-semibold text-gray-800">Please choose your symbol:</p>
          <div className="flex space-x-4">
            <button 
              onClick={() => setPlayerSymbolAndPlay('X')} 
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
              Choose X
            </button>
            <button 
              onClick={() => setPlayerSymbolAndPlay('O')} 
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105">
              Choose O
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          position: 'top-center',
          className: 'toast-custom',
          bodyClassName: 'toast-body',
          progressClassName: 'toast-progress',
        }
      );
    }
  };

  const setPlayerSymbolAndPlay = (symbol: 'X' | 'O') => {
    setPlayerSymbol(symbol);
    setSymbolChosen(true);
    toast.dismiss();
  };

  const handleClick = (index: number) => {
    if (squares[index] || calculateWinner(squares, boardSize) ) return;
    if (isPlayingWithComputer && !isPlayerTurn) return;
    if (!symbolChosen) return;
    
    const nextSquares = [...squares];
    nextSquares[index] = xIsNext ? playerSymbol : playerSymbol === 'X' ? 'O' : 'X';
    setSquares(nextSquares);

    const winner = calculateWinner(nextSquares, boardSize);
    if (winner) {
      setScore(prevScore => ({
        ...prevScore,
        [winner]: prevScore[winner as keyof typeof prevScore] + 1,
      }));
    } else if (nextSquares.every(square => square !== '')) {
      resetBoard();
    } else {
      setXIsNext(!xIsNext);
      if (isPlayingWithComputer) setIsPlayerTurn(!isPlayerTurn);
    }
  };

  useEffect(() => {
    if (isPlayingWithComputer && !xIsNext && !isPlayerTurn && !calculateWinner(squares, boardSize)) {
      const computerMove = () => {
        const winningLine = getWinningConditions(squares, playerSymbol === 'X' ? 'O' : 'X', boardSize);
      
        
        if (winningLine) {
          const emptyIndex = winningLine.find(index => squares[index] === '');
          if (emptyIndex !== undefined) {
            const nextSquares = [...squares];
            nextSquares[emptyIndex] = playerSymbol === 'X' ? 'O' : 'X';
            setSquares(nextSquares);
            setXIsNext(true);
            setIsPlayerTurn(true);
            return;
          }
        }
     
        const emptySquares = squares
          .map((value, index) => (value === '' ? index : null))
          .filter(index => index !== null) as number[];
      
        if (emptySquares.length > 0) {
          const randomMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
          const nextSquares = [...squares];
          nextSquares[randomMove] = playerSymbol === 'X' ? 'O' : 'X';
          setSquares(nextSquares);
          setXIsNext(true);
          setIsPlayerTurn(true);
        }
      };
      
      setTimeout(computerMove, 1000);
    }
  }, [squares, xIsNext, isPlayingWithComputer, isPlayerTurn]);

  const resetBoard = () => {
    setSquares(Array(boardSize * boardSize).fill(''));
    setXIsNext(true);
    setIsPlayerTurn(true);
    setSymbolChosen(false);
  };

  const resetGame = () => {
    setScore({ X: 0, O: 0 });
    resetBoard();
  };

  const togglePlayMode = () => {
    setIsPlayingWithComputer(!isPlayingWithComputer);
    resetGame();
  };

  const changeBoardSize = (newSize: number) => {
    setBoardSize(newSize);
    resetGame();
  };

  useEffect(() => {
    if (!symbolChosen) chooseSymbol();
  }, [symbolChosen]);

  return (
    <div className='flex flex-col items-center'>
      <Board squares={squares} onClick={handleClick} boardSize={boardSize} />
      <div className="mt-4 text-center">
        {calculateWinner(squares, boardSize) ? (
          <div className="text-2xl font-bold text-green-500">Winner: {calculateWinner(squares, boardSize)} 🎉</div>
        ) : (
          <div className="text-xl font-medium">Next Player: {xIsNext ? playerSymbol : playerSymbol === 'X' ? 'O' : 'X'}</div>
        )}
      </div>
      <div className="flex mt-6 space-x-4">
        <button onClick={resetGame} className="px-6 py-3 bg-red-500 text-white rounded-lg">New Game</button>
        <button onClick={togglePlayMode} className="px-6 py-3 bg-blue-700 text-white rounded-lg">
          {isPlayingWithComputer ? 'Play with Friend' : 'Play with Computer'}
        </button>
      </div>
      <div className="mt-6 text-lg text-center border-t pt-4">
        <p className="font-semibold">Score</p>
        <p>X: {score.X} | O: {score.O}</p>
      </div>
      <div className="mt-4">
        {[3, 4, 5, 6, 10].map(size => (
          <button key={size} onClick={() => changeBoardSize(size)} className="mx-2 bg-gray-700 text-white rounded-lg p-2">{size}x{size}</button>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

const calculateWinner = (squares: string[], size: number): string | null => {

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 3; j++) {
      const a = squares[i * size + j];
      const b = squares[i * size + j + 1];
      const c = squares[i * size + j + 2];
      if (a && a === b && a === c) {
        return a; 
      }
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 3; j++) {
      const a = squares[j * size + i];
      const b = squares[(j + 1) * size + i];
      const c = squares[(j + 2) * size + i];
      if (a && a === b && a === c) {
        return a; 
      }
    }
  }


  
  for (let i = 0; i <= size - 3; i++) {
    for (let j = 0; j <= size - 3; j++) {
      const a = squares[i * size + j];
      const b = squares[(i + 1) * size + (j + 1)];
      const c = squares[(i + 2) * size + (j + 2)];
      if (a && a === b && a === c) {
        return a; 
      }

      const d = squares[i * size + (j + 2)];
      const e = squares[(i + 1) * size + (j + 1)];
      const f = squares[(i + 2) * size + j];
      if (d && d === e && d === f) {
        return d; 
      }
    }
  }

  return null; 
};



const getWinningConditions = (squares: string[], player: string, size: number) => {
  const lines: number[][] = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 3; j++) {
      lines.push([i * size + j, i * size + j + 1, i * size + j + 2]);
    }
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 3; j++) {
      lines.push([j * size + i, (j + 1) * size + i, (j + 2) * size + i]);
    }
  }

  for (let i = 0; i <= size - 3; i++) {
    for (let j = 0; j <= size - 3; j++) {
      lines.push([i * size + j, (i + 1) * size + (j + 1), (i + 2) * size + (j + 2)]);
      lines.push([i * size + (j + 2), (i + 1) * size + (j + 1), (i + 2) * size + j]); 
    }
  }

  for (const line of lines) {
    const lineSquares = line.map(index => squares[index]);
    const score = lineSquares.reduce((acc, square) => acc + (square === player ? 1 : 0), 0);
    
    if (score === 2 && lineSquares.includes('')) {
      return line; 
    }
  }

  return null; 
};





export default Game;
