import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { useDojo } from '../DojoContext';
import { getEntityIdFromKeys } from '../dojo/createSystemCalls';
import { Coordinate } from '../type/GridElement';

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
}

const createMob = (health?: number, mob_position?: Coordinate): Mob => {
  return { health, position: mob_position };
};

export const useComponentStates = () => {
  const {
    setup: {
      components: { Character, Game, Map, Tile },
    },
    account: { account },
  } = useDojo();

  const entityId = parseInt(account.address) as EntityIndex;
  const game = useComponentValue(Game, entityId);

  // useEffect(() => {
  //   console.log('game', game);
  // }, [game]);

  const entityId2 = game?.game_id as EntityIndex;
  const map = useComponentValue(Map, entityId2);

  // ===================================================================================================================
  // KNIGHT
  const knight = useComponentValue(
    Character,
    getEntityIdFromKeys([game?.game_id ? BigInt(game?.game_id) : BigInt(0), BigInt(TileType.Knight)])
  );

  let entityId3 = 0 as EntityIndex;
  if (game && game.game_id !== undefined && map && map.map_id !== undefined && knight && knight.index !== undefined)
    entityId3 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.map_id),
      BigInt(knight?.index),
    ]);
  const knight_position = useComponentValue(Tile, entityId3);

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
    map.map_id !== undefined &&
    barbarian &&
    barbarian.index !== undefined
  )
    entityId4 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.map_id),
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
  if (game && game.game_id !== undefined && map && map.map_id !== undefined && bowman && bowman.index !== undefined)
    entityId5 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.map_id),
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
  if (game && game.game_id !== undefined && map && map.map_id !== undefined && wizard && wizard.index !== undefined)
    entityId6 = getEntityIdFromKeys([
      game?.game_id ? BigInt(game?.game_id) : BigInt(0),
      BigInt(map?.map_id),
      BigInt(wizard?.index),
    ]);
  const wizard_position = useComponentValue(Tile, entityId6);

  //const [pos, setPost] = useState({ x: 4, y: 4 });

  //console.log(knight_position, barbarian_position, bowman_position, wizard_position);

  return {
    game: { id: game?.game_id, score: game?.score },
    map: { id: map?.map_id, size: map?.size },
    knight: createMob(knight?.health, knight_position),
    barbarian: createMob(barbarian?.health, barbarian_position),
    bowman: createMob(bowman?.health, bowman_position),
    wizard: createMob(wizard?.health, wizard_position),
    //moveWizard: (x: number, y: number) => setPost({ x, y }),
  };
};
