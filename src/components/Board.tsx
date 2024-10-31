import React from 'react';

type BoardProps = {
  squares: string[];
  onClick: (index: number) => void;
  boardSize: number; 
};

const Board: React.FC<BoardProps> = ({ squares, onClick, boardSize }) => {
  const gridTemplateColumns = `repeat(${boardSize}, 1fr)`; // Grid layout

  return (
    <div
      className="gap-4 w-100"
      style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}
    >
      {squares.map((square, index) => (
        <button
          key={index}
          className="w-16 h-16 text-4xl font-bold text-white bg-gray-700 hover:bg-gray-600 border-2 border-gray-500 flex items-center justify-center"
          onClick={() => onClick(index)}
        >
          {square}
        </button>
      ))}
    </div>
  );
};

export default Board;
