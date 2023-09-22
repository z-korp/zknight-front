import React from 'react';

interface NewGameButtonProps {
  onClick: () => void;
}

const CreditsButton: React.FC<NewGameButtonProps> = ({ onClick }) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={onClick}>
      Credits
    </button>
  );
};

export default CreditsButton;
