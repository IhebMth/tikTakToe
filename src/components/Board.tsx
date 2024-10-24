import React from 'react';

type BoardProps = {
  squares: string[];
  onClick: (index: number) => void;
};

const Board: React.FC<BoardProps> = ({ squares, onClick }) => {
  return (
    <div className="grid grid-cols-3  gap-4 w-64">
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
