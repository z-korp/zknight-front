import { Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import sword from '../assets/sword_right.png';

interface SwordProps {
  initialY?: number;
  targetY: number;
}

const Sword: React.FC<SwordProps> = ({ initialY = 59, targetY }) => {
  const [spriteY, setSpriteY] = useState(initialY);

  // Using a ref to keep track of the animation request ID
  const animationRequestId = useRef<number | null>(null);
  const spriteYRef = useRef(spriteY); // Ref to track the current y position

  const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

  useEffect(() => {
    spriteYRef.current = spriteY; // Update the ref whenever spriteY changes
  }, [spriteY]);

  useEffect(() => {
    moveToPosition(targetY);
  }, [targetY]);

  const moveToPosition = (newTargetY: number) => {
    const speed = 0.5; // Increase the speed for faster movement

    const animate = () => {
      if (animationRequestId.current !== null) {
        const difference = Math.abs(spriteYRef.current - newTargetY);

        // Stop the animation if the difference is below a small threshold
        if (difference < 0.1) {
          setSpriteY(newTargetY); // Set the position directly to the target
          cancelAnimationFrame(animationRequestId.current);
          return;
        }

        setSpriteY((prevY) => {
          const updatedY = lerp(prevY, newTargetY, speed);
          spriteYRef.current = updatedY;
          return updatedY;
        });

        animationRequestId.current = requestAnimationFrame(animate);
      }
    };

    animationRequestId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Cleanup effect
    return () => {
      // Cancel any ongoing animations if the component is unmounted
      if (animationRequestId.current) {
        cancelAnimationFrame(animationRequestId.current);
      }
    };
  }, []);

  PIXI.Texture.from(sword).baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  return <Sprite key={`sword`} image={sword} anchor={0.5} scale={3} x={1185} y={spriteY} />;
};

export default Sword;
