import { Container, Sprite, Stage, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useEffect, useState } from 'react';
import { shortString } from 'starknet';
import { useDojo } from '../DojoContext';
import heart from '../assets/heart1.png';
import skull from '../assets/skull.png';
import { TileType, useComponentStates } from '../hooks/useComponentStates';
import { useGrid } from '../hooks/useGrid';
import useIP from '../hooks/useIP';
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
import Sword from './Sword';

interface CanvasProps {
  setMusicPlaying: (bool: boolean) => void;
}

const getYFromMob = (m: TileType) => {
  if (m === TileType.Knight) return 59;
  else if (m === TileType.Barbarian) return 99;
  else if (m === TileType.Bowman) return 139;
  else return 189;
};

const Canvas: React.FC<CanvasProps> = ({ setMusicPlaying }) => {
  const {
    setup: {
      systemCalls: { play, spawn, create },
      network: { graphSdk },
    },
    account: { account },
  } = useDojo();

  const contractState = useComponentStates();
  const { knight, barbarian, wizard, bowman, hitter, game, map: mapState, hitPosition } = contractState;

  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [grid, setGrid] = useState<GridElement[][]>([]);
  const [hoveredTile, setHoveredTile] = useState<Coordinate | undefined>(undefined);
  const [hoveredMob, setHoveredMob] = useState<MobType | undefined>(undefined);
  const [absolutePosition, setAbsolutePosition] = useState<Coordinate | undefined>(undefined);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const { map, turn, add_hole, set_size, reset_holes, set_ip, add_to_leaderboard, set_hit_mob, set_turn } =
    useElementStore((state) => state);

  useEffect(() => {
    if (turn === TileType.Knight) {
      setHasPlayed(false);
    }
  }, [turn]);

  const [pseudo, setPseudo] = useState('');
  const { ip, loading, error } = useIP();
  useEffect(() => {
    if (!loading && ip) {
      set_ip(ip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, loading]);

  const generateNewGame = async () => {
    const storedIsMusicPlaying = localStorage.getItem('isMusicPlaying');
    if (storedIsMusicPlaying === null) {
      setMusicPlaying(true);
    } else {
      setMusicPlaying(JSON.parse(storedIsMusicPlaying));
    }
    reset_holes();

    const pseudoFelt = shortString.encodeShortString(pseudo);
    create(account, ip, 1000, pseudoFelt, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
  };

  useEffect(() => {
    if (game.over === true) {
      setIsGameOver(true);
    }
  }, [game.over]);

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
      spawn(account, ip, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
    }
  }, [mapState.spawn]);

  const { knightNeighbors, barbarianNeighbors, bowmanNeighbors, wizardNeighbors } = useGrid(grid);

  const passTurn = () => {
    // pass turn is a play but with same position
    if (knight.position)
      play(account, ip, knight.position?.x, knight.position?.y, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
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

          const tileCoords = { x: tileX, y: tileY };
          if (hoveredTile === undefined || !areCoordsEqual(hoveredTile, tileCoords)) {
            setHoveredTile(tileCoords);
            setAbsolutePosition({
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            });
          }
        }}
        onPointerDown={(e) => {
          if (!hasPlayed) {
            console.log('Click on map');
            const gridPos = to_grid_coordinate({
              x: e.nativeEvent.offsetX - WIDTH / 2,
              y: e.nativeEvent.offsetY - H_OFFSET + 18, // 18 otherwise mouse not centered on the tile
            });
            const tileX = Math.round(gridPos.x);
            const tileY = Math.round(gridPos.y);

            if (knight.position) {
              const result = getNeighbors({ x: knight.position.x, y: knight.position.y }, grid);

              //verify if the tile is in the result
              const tile = result.find((e) => e.x === tileX && e.y === tileY);
              if (tile) {
                console.log('--------- play');
                setHasPlayed(true);
                play(account, ip, tileX, tileY, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
              }
            }
          }
        }}
      >
        <Container sortableChildren={true}>
          <Map hoveredTile={hoveredTile} />

          {knight.position && knight.health !== undefined && (
            <Mob
              type="knight"
              targetPosition={knight.position}
              isHovered={
                turn === TileType.Knight || (hoveredTile !== undefined && areCoordsEqual(hoveredTile, knight.position))
              }
              health={knight.health}
              isHitter={hitter === TileType.Knight}
              knightPosition={knight.position}
              hitPosition={hitPosition}
              neighbors={knightNeighbors}
            />
          )}

          {barbarian.position && barbarian.health !== undefined && (
            <Mob
              type="barbarian"
              targetPosition={barbarian.position}
              isHovered={hoveredTile !== undefined && areCoordsEqual(hoveredTile, barbarian.position)}
              health={barbarian.health}
              isHitter={hitter === TileType.Barbarian}
              knightPosition={knight.position}
              hitPosition={hitPosition}
              neighbors={barbarianNeighbors}
            />
          )}
          {bowman.position && bowman.health !== undefined && (
            <Mob
              type="bowman"
              targetPosition={bowman.position}
              isHovered={hoveredTile !== undefined && areCoordsEqual(hoveredTile, bowman.position)}
              health={bowman.health}
              isHitter={hitter === TileType.Bowman}
              knightPosition={knight.position}
              hitPosition={hitPosition}
              neighbors={bowmanNeighbors}
            />
          )}
          {wizard.position && wizard.health !== undefined && (
            <Mob
              type="wizard"
              targetPosition={wizard.position}
              isHovered={hoveredTile !== undefined && areCoordsEqual(hoveredTile, wizard.position)}
              health={wizard.health}
              isHitter={hitter === TileType.Wizard}
              knightPosition={knight.position}
              hitPosition={hitPosition}
              neighbors={wizardNeighbors}
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
              //console.log('mtype', mtype);
              if (m === 'game' || m === 'map' || m === 'hitter' || m === 'hitPosition') return null;
              const health = contractState[mtype].health;

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
                          x={950 - i * 30}
                          y={59 + (j - 2) * 40}
                        />
                      );
                    })
                  ) : (
                    <Sprite key={`skull`} image={skull} anchor={0.5} scale={0.5} x={950} y={59 + (j - 2) * 40} />
                  )}

                  <Text
                    text={m.charAt(0).toUpperCase() + m.slice(1)}
                    x={980}
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
          {map.size !== 0 && <Sword targetY={getYFromMob(turn)} />}
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
