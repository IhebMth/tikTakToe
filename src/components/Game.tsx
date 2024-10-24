import React, { useState, useEffect } from 'react';
import Board from './Board';

const Game: React.FC = () => {
  const [squares, setSquares] = useState(Array(9).fill('')); //Start by making 9squares
  const [xIsNext, setXIsNext] = useState(true); // to see if it's X turn (by default it is)
  const [score, setScore] = useState({ X: 0, O: 0 });  // calcualte how many times X or O Won, no cheating and forgetting how many times your friend has won you :D
  const [isPlayingWithComputer, setIsPlayingWithComputer] = useState(false); // To see if you're playing vs robot or a friend by default(friend)


  /*

   When you click a square : 
   you can't tap on the filled squares or if there's winner
   you set an X or an O based on square state
   there is a check on the winner after each move
   If there’s no winner and squares are available, it toggles to the next player.
  */
  const handleClick = (index: number) => {
    //you can't tap on the filled squares or if there's winner
    if (squares[index] || calculateWinner(squares)) return;

    // creating a new array of squares that can be updated we can't mutate the state directly
    const nextSquares = [...squares];
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);


    // calculate the winner based on the nexSquares and  if one of combinations are met 

    const winner = calculateWinner(nextSquares);
    if (winner) {
      setScore(prevScore => ({
        ...prevScore,
        [winner]: (prevScore[winner as keyof typeof prevScore] || 0) + 1,
      }));
          // clear the squares if they are filled and there's no winner.
    } else if (nextSquares.every(square => square !== '')) {
      resetGame();
    } else {
      setXIsNext(!xIsNext); 
    }
  };

  // if it's the computer turn , the computers looks for the empty squares and choose a square randomly to take after a 500ms
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

  // reseting the game clear squares and the X to play when i first click on the board
  const resetGame = () => {
    setSquares(Array(9).fill(''));
    setXIsNext(true);
  };

  // set playing with computer and friend and clear the board
  const togglePlayMode = () => {
    setIsPlayingWithComputer(!isPlayingWithComputer);
    resetGame(); 
  };

  return (
    <div className='flex flex-col items-center'>
      <Board squares={squares} onClick={handleClick} />
      <div className="mt-4 text-center">
        {calculateWinner(squares) ? (
          <div className="text-2xl font-bold text-green-500">Winner: {calculateWinner(squares)} 🎉</div>
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
    </div>
  );
};

const calculateWinner = (squares: string[]) => {
  // these are all winning combinitions
    const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  //  if index 0 exists and index 0 === index 1 and index 0 === index 2 then there a winner which is the value of those squares
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default Game;
