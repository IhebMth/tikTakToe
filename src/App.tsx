import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  // i wrote comments in the code to better undersand it 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 text-white">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-5xl font-extrabold mb-6 animate-bounce">Tic Tac Toe</h1>
        <Game />
      </div>
    </div>
  );
};

export default App;
