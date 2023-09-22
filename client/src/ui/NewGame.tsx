import React, { useState } from 'react';
import NewGameButton from './NewGameButton';
import Modal from 'react-modal';
import Credits from './Credits';
import CreditsButton from './CreditsButton';

interface NewGameProps {
  onClick: () => void;
  onPseudoChange: (pseudo: string) => void; // Callback function to update parent state
}

const NewGame: React.FC<NewGameProps> = ({ onClick, onPseudoChange }) => {
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
    onPseudoChange(value); // Notify the parent of the change
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div
      className="w-full max-w-xs"
      style={{ position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, margin: 'auto' }}
    >
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pseudo">
        Username
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="pseudo"
        type="text"
        placeholder="Pseudo"
        value={username}
        onChange={handleInputChange}
        maxLength={18} // Limit the input to 30 characters
      />
      <NewGameButton onClick={onClick} disabled={!username.trim()}></NewGameButton>
      <CreditsButton onClick={toggleModal}></CreditsButton>
      <Modal isOpen={isModalOpen} onRequestClose={toggleModal} className="modal-base modal-medium" ariaHideApp={false}>
        <div className="relative">
          <button onClick={toggleModal} className="absolute top-[-10px] right-0 p-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 w-1 h-full bg-black transform rotate-45 origin-center"></div>
              <div className="absolute inset-0 w-1 h-full bg-black transform -rotate-45 origin-center"></div>
            </div>
          </button>
          <Credits />
        </div>
      </Modal>
    </div>
  );
};

export default NewGame;
