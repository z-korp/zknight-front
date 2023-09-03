import React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
  disabled?: boolean; // Optional disabled prop
}

const ResetButton: React.FC<NewGameButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      className={`bg-blue-500 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
      } mx-10 my-10 text-white font-bold py-2 px-4 rounded`}
      style={{ width: '160px' }}
      onClick={onClick}
      disabled={disabled}
    >
      Reset Game
    </button>
  );
};

export default ResetButton;
