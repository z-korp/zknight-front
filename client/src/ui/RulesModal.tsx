import character from '../../public/character.png';
import login from '../../public/login.png';
import board from '../../public/board.png';

const RulesModal = () => {
  return (
    <div className="text-black flex  flex-col justify-center h-3/4">
      <h2 className="mb-4 text-center">Rules of the game</h2>
      <hr className="my-4 border-2" />
      <div className="text-black grid grid-cols-3 gap-4 m-5">
        <div className="relative">
          <span className=" flex items-center text-center text-black font-bold text-lg ">
            Choose your name and launch the game
          </span>
          <img src={login} alt="login" className="w-50 h-32 mx-auto mt-2" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div className="relative row-start-2 col-start-2 -mt-10 justify-center ">
          <span className=" flex items-center text-center text-black font-bold text-lg ">
            You play this character, click on blue tiles to move
          </span>
          <img
            src={character}
            alt="character"
            className="w-50 h-32 flex items-center mx-auto mt-2"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="relative row-start-3 col-start-3 -mt-10 justify-center">
          <span className="flex items-center text-center text-black font-bold text-lg">
            Kill all the enemies to move to next level
          </span>
          <img src={board} alt="map" className="w-50 h-32 mx-auto mt-2" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>
    </div>
  );
};
export default RulesModal;
