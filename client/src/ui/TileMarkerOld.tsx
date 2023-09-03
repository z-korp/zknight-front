import { Graphics } from '@pixi/react';
import { to_center, to_screen_coordinate } from '../utils/grid';

const TileMarkerOld = ({ x, y, color }: { x: number; y: number; color: string }) => {
  const screenCoords = to_screen_coordinate({ x, y });
  const { x: finalX, y: finalY } = to_center({ x: screenCoords.x, y: screenCoords.y });

  return (
    <Graphics
      zIndex={4}
      draw={(graphics) => {
        graphics.clear();
        graphics.beginFill(color, 0.4); // La couleur bleue avec une opacité de 0.4
        // Coordonnées des points du rectangle isométrique
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 32, y: -16 };
        const p3 = { x: 0, y: -32 };
        const p4 = { x: -32, y: -16 };

        // Dessin des lignes pour créer le rectangle isométrique
        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(p3.x, p3.y);
        graphics.lineTo(p4.x, p4.y);
        graphics.lineTo(p1.x, p1.y);
        graphics.endFill();
      }}
      x={finalX}
      y={finalY}
    />
  );
};

export default TileMarkerOld;
