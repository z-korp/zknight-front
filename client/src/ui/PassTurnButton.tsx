import React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
}

const PassTurnButton: React.FC<NewGameButtonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 mx-10 my-10 text-white font-bold py-2 px-4 rounded"
      style={{ width: '160px', position: 'absolute', bottom: '15rem', right: '5rem' }}
      onClick={onClick}
    >
      Pass turn
    </button>
  );
};

export default PassTurnButton;
