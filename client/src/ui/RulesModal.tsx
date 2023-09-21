import character from '../../public/character.png';
import login from '../../public/login.png';
import board from '../../public/board.png';

const RulesModal = () => {
  return (
    <div className="text-black flex  flex-col justify-center">
      <h2 className="mb-4 text-center">Rules of the game</h2>
      <hr className="my-4 border-2" />
      <div>
        <img
          src={login}
          alt="Twitter"
          className="w-50 h-32 mr-2"
          style={{ imageRendering: 'pixelated', display: 'inline-block' }}
        />
        <span style={{ display: 'inline-block' }}>Choose your name and launch the game</span>
      </div>
      <div className="my-4">
        <img
          src={character}
          alt="Twitter"
          className="w-50 h-32 mr-2"
          style={{ imageRendering: 'pixelated', display: 'inline-block' }}
        />
        <span style={{ display: 'inline-block' }}>You play this character</span>
      </div>
      <div>
        <img
          src={board}
          alt="Twitter"
          className="w-50 h-32 mr-2"
          style={{ imageRendering: 'pixelated', display: 'inline-block' }}
        />
        <span style={{ display: 'inline-block' }}>Kill all the enemies to move to next level</span>
      </div>
    </div>
  );
};
export default RulesModal;
