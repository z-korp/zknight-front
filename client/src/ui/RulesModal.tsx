import { useEffect, useState } from 'react';
import { Assets, Container, Texture } from 'pixi.js';
import { Direction, getFramesFromType, Animation } from '../utils/animation';
import { AnimatedSprite, Stage } from '@pixi/react';

const RulesModal = () => {
  const [frames, setFrames] = useState<Texture[]>([]);
  const [resource, setResource] = useState<any>(undefined);

  useEffect(() => {
    const load = async () => {
      const resource = await Assets.load(`assets/knight/knight.json`);
      setResource(resource);
      setFrames(getFramesFromType('knight', Animation.Idle, Direction.S, resource));
    };
    load();
  }, []);

  return (
    <div className="text-black flex  flex-col justify-center">
      <h2 className="mb-4 text-center">Rules of the game</h2>
      <hr className="my-4 border-2" />
      <div className="flex items-center">
        <p>You are playing this character:</p>
        <Stage width={35} height={45} options={{ backgroundColor: 0xffffff }}>
          <AnimatedSprite
            x={15}
            y={20}
            animationSpeed={0.1}
            anchor={0.5}
            scale={2}
            isPlaying={true}
            textures={frames}
          />
        </Stage>
      </div>
      <p className="my-5">- Your objective is to kill all the enemies in the map</p>
      <p className="my-5">- Your character can move by one tile or attack around him each turn</p>
      <p className="my-5">- Put your mouse over a character to see his allowed actions</p>
      <p className="my-5">- When the map is clear, you move on to the next level</p>
      <p className="my-5">- Get as much point as possible to enter the leaderboard!</p>
    </div>
  );
};
export default RulesModal;
