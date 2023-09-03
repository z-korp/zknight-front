// GameOverModal.js
import React from 'react';
import Modal from 'react-modal';

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
      <div className="modal">
        <div className="modal-content">
          <h2 className="text-black">Game Over</h2>
          <hr></hr>
          <h3 className="text-black">Score: {score}</h3>
          <button className="text-black" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GameOverModal;
