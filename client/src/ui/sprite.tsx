import { Sprite, useTick } from '@pixi/react';
import { useEffect, useState } from 'react';

function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}

interface BunnyProps {
  xInput: number;
  yInput: number;
  targetXInput: number;
  targetYInput: number;
}

export const Bunny: React.FC<BunnyProps> = ({ xInput, yInput, targetXInput, targetYInput }) => {
  // states
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [targetX, setTargetX] = useState<number | null>(null);
  const [targetY, setTargetY] = useState<number | null>(null);

  useEffect(() => {
    setX(xInput);
    setY(yInput);
  }, [xInput, yInput]);

  useEffect(() => {
    setTargetX(targetXInput);
    setTargetY(targetYInput);
  }, [targetXInput, targetYInput]);

  useTick((delta) => {
    if (targetX !== null && targetY !== null && targetX != x && targetY != y) {
      console.log('targetX', targetX);
      setX((prevX) => lerp(prevX, targetX, 0.05));
      setY((prevY) => lerp(prevY, targetY, 0.05));

      // Check if the sprite is close enough to the target
      if (Math.abs(x - targetX) < 1 && Math.abs(y - targetY) < 1) {
        setTargetX(null);
        setTargetY(null);
      }
    }
  });

  return (
    <Sprite
      image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
      anchor={0.5}
      x={x}
      y={y}
      interactive
    />
  );
};
