import React, { useState } from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  const [boardSize, setBoardSize] = useState(3); // Initialize state with a default board size

  // Determine the maxWidthClass based on boardSize
  const getMaxWidthClass = () => {
    if (boardSize === 3  || boardSize === 4 || boardSize === 5) return 'max-w-md'; 
    if (boardSize === 6) return 'max-w-2xl'; 
    if (boardSize === 10) return 'max-w-4xl'; 
    return 'max-w-full'; // Default fallback
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 text-white">
      <div className={`bg-gray-800 p-10 rounded-lg shadow-lg w-full ${getMaxWidthClass()} text-center`}>
        <h1 className="text-5xl font-extrabold mb-6 animate-bounce">Tic Tac Toe</h1>
        <Game boardSize={boardSize} setBoardSize={setBoardSize} /> {/* Pass setBoardSize to Game */}
      </div>
    </div>
  );
};

export default App;
