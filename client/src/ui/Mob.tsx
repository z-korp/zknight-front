import { AnimatedSprite, useTick } from '@pixi/react';
import { Assets, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import { ActionableTile } from '../hooks/useGrid';
import { Coordinate } from '../type/GridElement';
import { to_center, to_grid_coordinate, to_screen_coordinate } from '../utils/grid';
import TileMarker from './TileMarker';
import { Direction, getFramesFromType, Animation } from '../utils/animation';

export type MobType = 'bowman' | 'barbarian' | 'knight' | 'wizard';

interface MobProps {
  type: MobType;
  targetPosition: Coordinate;
  isHovered: boolean;
  health: number;
  isHitter: boolean;
  knightPosition?: Coordinate;
  hitPosition?: Coordinate;
  neighbors?: ActionableTile[];
}

function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}

const getDirection = (start: Coordinate, end: Coordinate, orientation: Direction): Direction => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Conversion de coordonnées cartésiennes à coordonnées isométriques
  const iso_dx = dx - dy;
  const iso_dy = (dx + dy) / 2;

  if (iso_dx > 0 && iso_dy >= 0) return Direction.SE;
  if (iso_dx <= 0 && iso_dy > 0) return Direction.SW;
  if (iso_dx < 0 && iso_dy <= 0) return Direction.NW;
  if (iso_dx >= 0 && iso_dy < 0) return Direction.NE;

  return orientation; // Retourner NONE si aucune direction n'est trouvée
};

const getStartOrientation = (mob_coord: Coordinate, knight_position?: Coordinate) => {
  return getDirection(mob_coord, knight_position ? knight_position : mob_coord, Direction.S);
};

const Mob: React.FC<MobProps> = ({
  type,
  targetPosition,
  isHovered,
  health,
  isHitter,
  knightPosition,
  hitPosition,
  neighbors,
}) => {
  const [animation, setAnimation] = useState<Animation>(Animation.Idle);
  const [counterAnim, setCounterAnim] = useState(0);

  const [orientation, setOrientation] = useState<Direction>(getStartOrientation(targetPosition, knightPosition));
  const [frames, setFrames] = useState<Texture[]>([]);
  const [resource, setResource] = useState<any>(undefined);
  const [currentFrame, setCurrentFrame] = useState(0);

  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (resource) {
      if (animation === Animation.Walk) {
        const or = getDirection(
          to_grid_coordinate(absolutePosition),
          to_grid_coordinate(absoluteTargetPosition),
          orientation
        );
        setOrientation(or);
        setFrames(getFramesFromType(type, Animation.Walk, or, resource));
      } else if (animation === Animation.BowAttack) {
        setFrames(getFramesFromType(type, Animation.BowAttack, orientation, resource));
      } else if (animation === Animation.StaffAttack) {
        setFrames(getFramesFromType(type, Animation.StaffAttack, orientation, resource));
      } else if (animation === Animation.SwordAttack) {
        setFrames(getFramesFromType(type, Animation.SwordAttack, orientation, resource));
      } else if (animation === Animation.Hurt) {
        setFrames(getFramesFromType(type, Animation.Hurt, orientation, resource));
      } else if (animation === Animation.Death) {
        setFrames(getFramesFromType(type, Animation.Death, orientation, resource));
      } else {
        setFrames(getFramesFromType(type, Animation.Idle, orientation, resource));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, resource]);

  useEffect(() => {
    setCurrentFrame(0);
    if (health === 0) {
      setAnimation(Animation.Death);
    } else {
      if (
        (health === 10 && type === 'knight') ||
        (health === 1 && type === 'barbarian') ||
        (health === 1 && type === 'wizard') ||
        (health === 1 && type === 'bowman')
      ) {
        setAnimation(Animation.Jump);
      } else {
        setAnimation(Animation.Hurt);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [health]);

  useEffect(() => {
    if (isMoving) {
      setAnimation(Animation.Walk);
    }
  }, [isMoving]);

  useEffect(() => {
    if (isHitter === true) {
      setCurrentFrame(0);

      if (hitPosition !== undefined) {
        const new_orientation = hitPosition ? getDirection(targetPosition, hitPosition, orientation) : orientation;
        setOrientation(new_orientation);

        if (type === 'knight' || type === 'barbarian') setAnimation(Animation.SwordAttack);
        else if (type === 'bowman') setAnimation(Animation.BowAttack);
        else if (type === 'wizard') setAnimation(Animation.StaffAttack);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHitter]);

  // current position absolute during movement
  // will be changing during the movement, towards the absoluteTargetPosition
  const [absolutePosition, setAbsolutePosition] = useState<Coordinate>(to_center(to_screen_coordinate(targetPosition)));
  const [absoluteTargetPosition, setAbsolutetargetPosition] = useState<Coordinate>(
    to_center(to_screen_coordinate(targetPosition))
  );

  // Only at init
  useEffect(() => {
    const load = async () => {
      const resource = await Assets.load(`assets/${type}/${type}.json`);
      setResource(resource);
    };
    load();
    // init position
    setAbsolutePosition(to_center(to_screen_coordinate(targetPosition)));
  }, []);

  // If we receive a new targetPosition from props, we transform it into absolute pixel pos and work on it for the move
  useEffect(() => {
    setAbsolutetargetPosition(to_center(to_screen_coordinate(targetPosition)));
  }, [targetPosition]);

  // Here we work only in absolute positions
  useTick(() => {
    const currentX = absolutePosition.x;
    const currentY = absolutePosition.y;
    const targetX = absoluteTargetPosition.x;
    const targetY = absoluteTargetPosition.y;
    if (Math.abs(targetX - currentX) >= 1 || Math.abs(targetY - currentY) >= 1) {
      setIsMoving(true);
      const newX = lerp(currentX, targetX, 0.05);
      const newY = lerp(currentY, targetY, 0.05);
      setAbsolutePosition({ x: newX, y: newY });
    } else {
      setIsMoving(false);
    }
  });

  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isDead, setIsDead] = useState(false);

  useTick(() => {
    if (shouldAnimate) {
      setCounterAnim((prevCounter) => prevCounter + 1);
      if (counterAnim === 1000) setCounterAnim(0);

      if (counterAnim % 10 === 0) {
        if (animation === Animation.Idle) {
          // if IDLE, loop through frames
          if (frames && frames.length > 0) {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length); // change to the next frame and back to f0
          }
        } else {
          // otherwise we do only the frames, and then go IDLE
          if (frames && frames.length > 0 && currentFrame < frames.length - 1) {
            setCurrentFrame((prevFrame) => prevFrame + 1); // change to the next frame
          } else {
            // last frame of the animation
            if (animation === Animation.Death) {
              setShouldAnimate(false);
              setIsDead(true);
            } else if (
              animation === Animation.BowAttack ||
              animation === Animation.StaffAttack ||
              animation === Animation.SwordAttack
            ) {
              setCurrentFrame(0);
              setAnimation(Animation.Idle);
            } else {
              setCurrentFrame(0);
              setAnimation(Animation.Idle);
            }
          }
        }
      }
    }
  });

  if (frames.length === 0) {
    return null;
  }

  return (
    <>
      <AnimatedSprite
        zIndex={to_grid_coordinate(absolutePosition).x + to_grid_coordinate(absolutePosition).y}
        x={isDead ? -100 /*lol*/ : absolutePosition.x}
        y={isDead ? -100 /*lol*/ : absolutePosition.y - 36}
        anchor={0.5}
        scale={2}
        isPlaying={false}
        textures={frames}
        initialFrame={currentFrame}
      />

      {!isMoving &&
        isHovered &&
        health !== 0 &&
        neighbors &&
        neighbors.map((move, index) => (
          <TileMarker key={index} x={move.tile.x} y={move.tile.y} color={move.action === 'walk' ? 'blue' : 'yellow'} />
        ))}
    </>
  );
};

export default Mob;
