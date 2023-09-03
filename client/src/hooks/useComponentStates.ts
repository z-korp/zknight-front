import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { useEffect } from 'react';
import { useDojo } from '../DojoContext';
import { getEntityIdFromKeys } from '../dojo/createSystemCalls';
import { Coordinate } from '../type/GridElement';
import { useElementStore } from '../utils/store';

export enum TileType {
  Ground,
  Hole,
  Knight,
  Barbarian,
  Bowman,
  Wizard,
}

interface Mob {
  health?: number;
  position?: Coordinate;
  hitter?: number;
  hit?: number;
}

const mobFromIndex = ['ground', 'water', 'Knight', 'Barbarian', 'Bowman', 'Wizard'];

const createMob = (type: string, health?: number, mob_position?: Coordinate, hitter?: number, hit?: number): Mob => {
  //console.log(type, health, mob_position?.x, mob_position?.y, 'hitter', mobFromIndex[hitter ? hitter : 0], hit);
  return { health, position: mob_position, hitter, hit };
};

const getHitter = (
  knight: Mob | undefined,
  barbarian: Mob | undefined,
  wizard: Mob | undefined,
  bowman: Mob | undefined
): number => {
  if (knight && knight.hitter && knight.hitter !== 0) return knight.hitter;
  else if (barbarian && barbarian.hitter && barbarian.hitter !== 0) return barbarian.hitter;
  else if (wizard && wizard.hitter && wizard.hitter !== 0) return wizard.hitter;
  else if (bowman && bowman.hitter && bowman.hitter !== 0) return bowman.hitter;
  return 0;
};

export const useComponentStates = () => {
  const {
    setup: {
      components: { Character, Game, Map, Tile },
    },
  } = useDojo();

  const { ip } = useElementStore((state) => state);

  const entityId = ip as EntityIndex;
  const game = useComponentValue(Game, entityId);

  useEffect(() => {
    console.log('game', game);
  }, [game]);

  const entityId2 = game?.game_id as EntityIndex;
  const map = useComponentValue(Map, entityId2);
  //console.log('map', map);

  // ===================================================================================================================
  // KNIGHT
  const knight = useComponentValue(
    Character,
    getEntityIdFromKeys([game?.game_id ? BigInt(game?.game_id) : BigInt(0), BigInt(TileType.Knight)])
  );

  let entityId3 = 0 as EntityIndex;
  if (game && game.game_id !== undefined && map && map.level !== undefined && knight && knight.index !== undefined)
    entityId3 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.level),
      BigInt(knight?.index),
    ]);
  const knight_position = useComponentValue(Tile, entityId3);

  useEffect(() => {
    console.log(knight);
  }, [knight]);

  // ===================================================================================================================
  // BARBARIAN
  const barbarian = useComponentValue(
    Character,
    getEntityIdFromKeys([game?.game_id ? BigInt(game?.game_id) : BigInt(0), BigInt(TileType.Barbarian)])
  );

  let entityId4 = 0 as EntityIndex;
  if (
    game &&
    game.game_id !== undefined &&
    map &&
    map.level !== undefined &&
    barbarian &&
    barbarian.index !== undefined
  )
    entityId4 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.level),
      BigInt(barbarian?.index),
    ]);
  const barbarian_position = useComponentValue(Tile, entityId4);

  // ===================================================================================================================
  // BOWMAN
  const bowman = useComponentValue(
    Character,
    getEntityIdFromKeys([game?.game_id ? BigInt(game?.game_id) : BigInt(0), BigInt(TileType.Bowman)])
  );

  let entityId5 = 0 as EntityIndex;
  if (game && game.game_id !== undefined && map && map.level !== undefined && bowman && bowman.index !== undefined)
    entityId5 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.level),
      BigInt(bowman?.index),
    ]);
  const bowman_position = useComponentValue(Tile, entityId5);

  // ===================================================================================================================
  // WIZARD
  const wizard = useComponentValue(
    Character,
    getEntityIdFromKeys([game?.game_id ? BigInt(game?.game_id) : BigInt(0), BigInt(TileType.Wizard)])
  );

  let entityId6 = 0 as EntityIndex;
  if (game && game.game_id !== undefined && map && map.level !== undefined && wizard && wizard.index !== undefined)
    entityId6 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.level),
      BigInt(wizard?.index),
    ]);
  const wizard_position = useComponentValue(Tile, entityId6);

  //const [pos, setPost] = useState({ x: 4, y: 4 });

  //console.log(knight_position, barbarian_position, bowman_position, wizard_position);

  return {
    game: { id: game?.game_id, score: game?.score, over: game?.over, seed: game?.seed },
    map: { level: map?.level, size: map?.size, spawn: map?.spawn },
    knight: createMob('knight', knight?.health, knight_position, knight?.hitter, knight?.hit),
    barbarian: createMob('barbarian', barbarian?.health, barbarian_position, barbarian?.hitter, barbarian?.hit),
    bowman: createMob('bowman', bowman?.health, bowman_position, bowman?.hitter, bowman?.hit),
    wizard: createMob('wizard', wizard?.health, wizard_position, wizard?.hitter, wizard?.hit),
    hitter: getHitter(knight, barbarian, wizard, bowman),
    //moveWizard: (x: number, y: number) => setPost({ x, y }),
  };
};
