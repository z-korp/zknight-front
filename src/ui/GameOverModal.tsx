// GameOverModal.js
import React from 'react';
import Modal from 'react-modal';
import { TwitterShareButton } from 'react-share';

const modalStyle = {
  content: {
    top: '50%', // centré verticalement
    left: '50%', // centré horizontalement
    width: '80%', // Reduit la largeur
    height: '60%', // Reduit la hauteur
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    // fontFamily: '"Press Start 2P", cursive', // Utilisez la police qui vous donne un look de pixel art
    fontSize: '16px',
    border: '4px solid #000',
    boxShadow: '5px 5px #000',
    textColor: 'red',
  },
};

interface GameOverModalProps {
  score: number;
  isOpen: boolean;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyle} ariaHideApp={false}>
      <div className="relative">
        <button onClick={onClose} className="absolute top-[-10px] right-0 p-2">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 w-1 h-full bg-black transform rotate-45 origin-center"></div>
            <div className="absolute inset-0 w-1 h-full bg-black transform -rotate-45 origin-center"></div>
          </div>
        </button>

        <h2 className="text-black text-center mb-4">Game Over</h2>
        <hr className="my-4 border-2" />
        <div className="flex flex-col items-center justify-between mt-20">
          <h3 className="text-black">Score: {score}</h3>
          <h3 className="text-black mt-10">Click on 'new game' on the main screen to start over!</h3>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-md">
            <TwitterShareButton
              url="https://app.zknight.xyz/"
              title={`🎉 I scored ${score} points in zKnight, the new onchain game on Starknet 🔥 Do you think you can beat me? @zkorp_`}
            >
              Share on Twitter
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GameOverModal;
