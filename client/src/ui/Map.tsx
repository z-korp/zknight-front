import { Sprite } from '@pixi/react';
import { SCALE_MODES, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import groundTile from '../assets/tilesets/0_1.png';
import waterTile4 from '../assets/tilesets/water_full.png';
import waterTile2 from '../assets/tilesets/water_left.png';
import waterTile1 from '../assets/tilesets/water_middle.png';
import waterTile3 from '../assets/tilesets/water_right.png';
import { Coordinate, GridElement } from '../type/GridElement';
import { H_OFFSET, WIDTH, generateGrid, to_screen_coordinate } from '../utils/grid';
import { useElementStore } from '../utils/store';

interface MapProps {
  hoveredTile?: Coordinate;
}

const Map: React.FC<MapProps> = ({ hoveredTile }) => {
  const [grid, setGrid] = useState<GridElement[][]>([]);

  const { map } = useElementStore((state) => state);

  useEffect(() => {
    setGrid(generateGrid(map));
  }, [map]);

  if (!map.size) return null;

  //console.log(grid);

  const newGrid = [
    [
      { x: -2, y: 0, layer: 'base', type: 'water' },
      { x: -2, y: 1, layer: 'base', type: 'water' },
      { x: -2, y: 2, layer: 'base', type: 'water' },
      { x: -2, y: 3, layer: 'base', type: 'water' },
      { x: -2, y: 4, layer: 'base', type: 'water' },
      { x: -2, y: 5, layer: 'base', type: 'water' },
      { x: -2, y: 6, layer: 'base', type: 'water' },
      { x: -2, y: 7, layer: 'base', type: 'water' },
    ],
    [
      { x: -1, y: 0, layer: 'base', type: 'water' },
      { x: -1, y: 1, layer: 'base', type: 'water' },
      { x: -1, y: 2, layer: 'base', type: 'water' },
      { x: -1, y: 3, layer: 'base', type: 'water' },
      { x: -1, y: 4, layer: 'base', type: 'water' },
      { x: -1, y: 5, layer: 'base', type: 'water' },
      { x: -1, y: 6, layer: 'base', type: 'water' },
      { x: -1, y: 7, layer: 'base', type: 'water' },
    ],
    ...grid,
    [
      { x: 8, y: 0, layer: 'base', type: 'water' },
      { x: 8, y: 1, layer: 'base', type: 'water' },
      { x: 8, y: 2, layer: 'base', type: 'water' },
      { x: 8, y: 3, layer: 'base', type: 'water' },
      { x: 8, y: 4, layer: 'base', type: 'water' },
      { x: 8, y: 5, layer: 'base', type: 'water' },
      { x: 8, y: 6, layer: 'base', type: 'water' },
      { x: 8, y: 7, layer: 'base', type: 'water' },
    ],
    [
      { x: 9, y: 0, layer: 'base', type: 'water' },
      { x: 9, y: 1, layer: 'base', type: 'water' },
      { x: 9, y: 2, layer: 'base', type: 'water' },
      { x: 9, y: 3, layer: 'base', type: 'water' },
      { x: 9, y: 4, layer: 'base', type: 'water' },
      { x: 9, y: 5, layer: 'base', type: 'water' },
      { x: 9, y: 6, layer: 'base', type: 'water' },
      { x: 9, y: 7, layer: 'base', type: 'water' },
    ],
  ];

  //console.log(newGrid);

  return newGrid.map((row: any, i) => {
    const newRow = [
      { x: i - 2, y: -2, layer: 'base', type: 'water' },
      { x: i - 2, y: -1, layer: 'base', type: 'water' },
      ...row,
      { x: i - 2, y: 8, layer: 'base', type: 'water' },
      { x: i - 2, y: 9, layer: 'base', type: 'water' },
    ];
    return newRow.map((tile: any) => {
      const screenPos = to_screen_coordinate(tile);
      const adjustment =
        hoveredTile && hoveredTile.x === tile.x && hoveredTile.y === tile.y && tile.type === 'ground' ? 5 : 0;

      // Use water tile for border and your original tile for inside
      let tileImage = groundTile;
      let adj = 0;
      if (tile.type === 'water') {
        tileImage = waterTile1;
        if (tile.x === 17 && tile.y === 17) {
          tileImage = waterTile4;
          adj = -12;
        } else if (tile.y === 17) {
          tileImage = waterTile2;
          adj = -12;
        } else if (tile.x === 17) {
          tileImage = waterTile3;
          adj = -12;
        }
      }
      Texture.from(tileImage).baseTexture.scaleMode = SCALE_MODES.NEAREST;
      return (
        <Sprite
          key={`${tile.x}-${tile.y}`}
          image={tileImage}
          anchor={0.5}
          scale={2}
          x={screenPos.x + WIDTH / 2}
          y={screenPos.y + H_OFFSET - adjustment - adj}
        />
      );
    });
  });
};

export default Map;
