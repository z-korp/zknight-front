import { Sprite } from '@pixi/react';
import overlay_blue from '../assets/tilesets/overlay_blue.png';
import overlay_yellow from '../assets/tilesets/overlay_yellow.png';
import { to_center, to_screen_coordinate } from '../utils/grid';

interface TileMarkerProps {
  x: number;
  y: number;
  color: 'blue' | 'yellow';
}

const image = { blue: overlay_blue, yellow: overlay_yellow };

const TileMarker: React.FC<TileMarkerProps> = ({ x, y, color }) => {
  const { x: finalX, y: finalY } = to_center(to_screen_coordinate({ x, y }));

  return <Sprite zIndex={4} image={image[color]} anchor={0.5} scale={2} x={finalX} y={finalY} />;
};

export default TileMarker;
