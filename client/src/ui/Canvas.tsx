import { Container, Sprite, Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useEffect, useState } from 'react';
import { shortString } from 'starknet';
import { useDojo } from '../DojoContext';
import heart from '../assets/heart1.png';
import skull from '../assets/skull.png';
import { TileType, useComponentStates } from '../hooks/useComponentStates';
import { useGrid } from '../hooks/useGrid';
import { Coordinate, GridElement } from '../type/GridElement';
import { fetchData } from '../utils/fetchData';
import { HEIGHT, H_OFFSET, WIDTH, areCoordsEqual, generateGrid, to_grid_coordinate } from '../utils/grid';
import { getNeighbors } from '../utils/pathfinding';
import { useElementStore } from '../utils/store';
import GameOverModal from './GameOverModal'; // importez le composant
import Map from './Map';
import Mob, { MobType } from './Mob';
import NewGame from './NewGame';
import PassTurnButton from './PassTurnButton';
import ResetButton from './ResetButton';

interface CanvasProps {
  setMusicPlaying: (bool: boolean) => void;
}

const Canvas: React.FC<CanvasProps> = ({ setMusicPlaying }) => {
  const {
    setup: {
      systemCalls: { play, spawn, create },
      network: { graphSdk },
    },
    account: { account },
  } = useDojo();

  const contractState = useComponentStates();
  const { knight, barbarian, wizard, bowman, hitter, game, map: mapState } = contractState;

  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [grid, setGrid] = useState<GridElement[][]>([]);
  const [hoveredTile, setHoveredTile] = useState<Coordinate | undefined>(undefined);
  const [selectedTile, setSelectedTile] = useState<Coordinate | undefined>(undefined);
  const [selectedMob, setSelectedMob] = useState<MobType | undefined>(undefined);
  const [absolutePosition, setAbsolutePosition] = useState<Coordinate | undefined>(undefined);
  const [isGameOver, setIsGameOver] = useState(false);

  const { map, add_hole, set_size, reset_holes, set_ip, add_to_leaderboard } = useElementStore((state) => state);

  const [pseudo, setPseudo] = useState('');
  const [ip, setIp] = useState<number>(0);
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        const i = Number(data.ip.replaceAll('.', ''));
        setIp(i);
        set_ip(i);
      })
      .catch((e) => console.log('error while retrieving ip' + e));
  }, []);

  const generateNewGame = async () => {
    setMusicPlaying(true);

    reset_holes();

    const pseudoFelt = shortString.encodeShortString(pseudo);
    create(account, ip, 1000, pseudoFelt, add_hole, set_size, reset_holes);
  };

  useEffect(() => {
    if (knight.health === 0) {
      setIsGameOver(true);
    }
  }, [knight.health]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const array = await fetchData(graphSdk);
      array.forEach((e) => add_to_leaderboard(e));
    };

    fetchAndProcessData();
  }, [isGameOver]);

  useEffect(() => {
    setGrid(generateGrid(map));
  }, [map]);

  useEffect(() => {
    if (mapState.score) setScore(mapState.score);
  }, [mapState.score]);

  useEffect(() => {
    if (mapState.level) setLevel(mapState.level);
  }, [mapState]);

  useEffect(() => {
    if (mapState.spawn === 0) {
      spawn(account, ip, add_hole, set_size, reset_holes);
    }
  }, [mapState.spawn]);

  const { getActionableTiles } = useGrid(grid);

  const passTurn = () => {
    // pass turn is a play but with same position
    if (knight.position) play(account, ip, knight.position?.x, knight.position?.y, add_hole, set_size, reset_holes);
  };

  PIXI.Texture.from(heart).baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  PIXI.Texture.from(skull).baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

  return (
    <div style={{ position: 'relative' }}>
      <Stage
        width={WIDTH}
        height={HEIGHT}
        options={{ backgroundColor: '#242424' }}
        onPointerMove={(e) => {
          const gridPos = to_grid_coordinate({
            x: e.nativeEvent.offsetX - WIDTH / 2,
            y: e.nativeEvent.offsetY - H_OFFSET + 18, // 18 otherwise mouse not centered on the tile
          });
          const tileX = Math.round(gridPos.x);
          const tileY = Math.round(gridPos.y);

          setHoveredTile({ x: tileX, y: tileY });
          setAbsolutePosition({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          });
        }}
        onPointerDown={(e) => {
          console.log('Click on map');
          const gridPos = to_grid_coordinate({
            x: e.nativeEvent.offsetX - WIDTH / 2,
            y: e.nativeEvent.offsetY - H_OFFSET + 18, // 18 otherwise mouse not centered on the tile
          });
          const tileX = Math.round(gridPos.x);
          const tileY = Math.round(gridPos.y);

          if (tileX >= 0 && tileY >= 0) {
            if (barbarian.position && areCoordsEqual({ x: tileX, y: tileY }, barbarian.position))
              setSelectedMob('barbarian');
            else if (knight.position && areCoordsEqual({ x: tileX, y: tileY }, knight.position))
              setSelectedMob('knight');
            else if (wizard.position && areCoordsEqual({ x: tileX, y: tileY }, wizard.position))
              setSelectedMob('wizard');
            else if (bowman.position && areCoordsEqual({ x: tileX, y: tileY }, bowman.position))
              setSelectedMob('bowman');

            setSelectedTile({ x: tileX, y: tileY });
          }
          if (knight.position) {
            const result = getNeighbors({ x: knight.position.x, y: knight.position.y }, grid);

            //verify if the tile is in the result
            const tile = result.find((e) => e.x === tileX && e.y === tileY);
            if (tile) {
              play(account, ip, tileX, tileY, add_hole, set_size, reset_holes);
            }
          }
        }}
      >
        <Container sortableChildren={true}>
          <Map hoveredTile={hoveredTile} />

          {knight.position && knight.health !== undefined && (
            <Mob
              type="knight"
              grid={grid}
              targetPosition={knight.position}
              selectedTile={selectedTile}
              hoveredTile={hoveredTile}
              isSelected={selectedMob !== undefined && selectedMob === 'knight'}
              getActionableTiles={getActionableTiles}
              health={knight.health}
              isHitter={hitter === TileType.Knight}
              knightPosition={knight.position}
            />
          )}

          {barbarian.position && barbarian.health !== undefined && (
            <Mob
              type="barbarian"
              grid={grid}
              targetPosition={barbarian.position}
              selectedTile={selectedTile}
              hoveredTile={hoveredTile}
              isSelected={selectedMob !== undefined && selectedMob === 'barbarian'}
              getActionableTiles={getActionableTiles}
              health={barbarian.health}
              isHitter={hitter === TileType.Barbarian}
              knightPosition={knight.position}
            />
          )}
          {bowman.position && bowman.health !== undefined && (
            <Mob
              type="bowman"
              grid={grid}
              targetPosition={bowman.position}
              selectedTile={selectedTile}
              hoveredTile={hoveredTile}
              isSelected={selectedMob !== undefined && selectedMob === 'bowman'}
              getActionableTiles={getActionableTiles}
              health={bowman.health}
              isHitter={hitter === TileType.Bowman}
              knightPosition={knight.position}
            />
          )}
          {wizard.position && wizard.health !== undefined && (
            <Mob
              type="wizard"
              grid={grid}
              targetPosition={wizard.position}
              selectedTile={selectedTile}
              hoveredTile={hoveredTile}
              isSelected={selectedMob !== undefined && selectedMob === 'wizard'}
              getActionableTiles={getActionableTiles}
              health={wizard.health}
              isHitter={hitter === TileType.Wizard}
              knightPosition={knight.position}
            />
          )}

          {map.size !== 0 && hoveredTile && absolutePosition && (
            <>
              <Text
                text={`STAGE: ${level}`}
                x={20}
                y={50}
                style={
                  new PIXI.TextStyle({
                    align: 'center',
                    fontFamily: '"Press Start 2P", Helvetica, sans-serif',
                    fontSize: 20,
                    fontWeight: '400',
                    fill: '#ffffff',
                  })
                }
              />
              <Text
                text={`SCORE: ${score}`}
                x={20}
                y={85}
                style={
                  new PIXI.TextStyle({
                    align: 'center',
                    fontFamily: '"Press Start 2P", Helvetica, sans-serif',
                    fontSize: 20,
                    fontWeight: '400',
                    fill: '#ffffff',
                  })
                }
              />

              {/*<Text
                text={`(${hoveredTile.x}, ${hoveredTile.y})`}
                x={20}
                y={100}
                style={
                  new PIXI.TextStyle({
                    align: 'center',
                    fontFamily: '"Press Start 2P", Helvetica, sans-serif',
                    fontSize: 20,
                    fontWeight: '400',
                    fill: '#ffffff',
                  })
                }
              />
              <Text
                key={`text-${hoveredTile.x}-${hoveredTile.y}`}
                text={`(${absolutePosition.x.toFixed(0)}, ${absolutePosition.y.toFixed(0)})`}
                x={20}
                y={150}
                style={
                  new PIXI.TextStyle({
                    align: 'center',
                    fontFamily: '"Press Start 2P", Helvetica, sans-serif',
                    fontSize: 20,
                    fontWeight: '400',
                    fill: '#ffffff',
                  })
                }
              />*/}
            </>
          )}
          {map.size !== 0 &&
            Object.keys(contractState).map((m: string, j) => {
              const mtype = m as MobType;
              const health = contractState[mtype].health;
              if (m === 'game' || m === 'map' || m == 'hitter') return null;
              return (
                <>
                  {health !== undefined && health > 0 ? (
                    Array.from({ length: health as number }).map((_, i) => {
                      return (
                        <Sprite
                          key={`heart-${i}`}
                          image={heart}
                          anchor={0.5}
                          scale={1.5}
                          x={970 - i * 30}
                          y={59 + (j - 2) * 40}
                        />
                      );
                    })
                  ) : (
                    <Sprite key={`skull`} image={skull} anchor={0.5} scale={0.5} x={970} y={59 + (j - 2) * 40} />
                  )}
                  <Text
                    text={m.charAt(0).toUpperCase() + m.slice(1)}
                    x={1000}
                    y={50 + (j - 2) * 40}
                    style={
                      new PIXI.TextStyle({
                        align: 'center',
                        fontFamily: '"Press Start 2P", Helvetica, sans-serif',
                        fontSize: 20,
                        fontWeight: '400',
                        fill: health && health > 0 ? '#ffffff' : '#808080',
                      })
                    }
                  />
                </>
              );
            })}
        </Container>
      </Stage>
      {map.size !== 0 && <ResetButton onClick={generateNewGame}></ResetButton>}
      {map.size !== 0 && <PassTurnButton onClick={passTurn}></PassTurnButton>}
      {map.size === 0 && <NewGame onClick={generateNewGame} onPseudoChange={setPseudo} />}

      <GameOverModal score={score} isOpen={isGameOver} onClose={() => setIsGameOver(false)} />
    </div>
  );
};

export default Canvas;
