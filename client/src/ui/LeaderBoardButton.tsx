import React from 'react';

interface LeaderBoardButtonProps {
  onClick: () => void;
}

const LeaderBoardButton: React.FC<LeaderBoardButtonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 mx-10 my-10 text-white font-bold py-2 px-4 rounded"
      style={{ width: '210px' }}
      onClick={onClick}
    >
      Leaderboard
    </button>
  );
};

export default LeaderBoardButton;
