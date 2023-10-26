import React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
  disabled?: boolean; // Optional disabled prop
}

const NewGameButton: React.FC<NewGameButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      className={`bg-blue-500 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
      } my-10 text-white font-bold py-2 px-4 rounded w-full`}
      onClick={onClick}
      disabled={disabled}
    >
      New Game
    </button>
  );
};

export default NewGameButton;
