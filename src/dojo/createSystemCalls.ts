import { Component, Components, EntityIndex, Schema, setComponent, updateComponent } from '@latticexyz/recs';
import { poseidonHashMany } from 'micro-starknet';
import { Account, Call, Event, InvokeTransactionReceiptResponse, shortString } from 'starknet';
import { TileType } from '../hooks/useComponentStates';
import { MobType } from '../ui/Mob';
import { ClientComponents } from './createClientComponents';
import { SetupNetworkResult } from './setupNetwork';

let Number_of_holes = 0;
let Map_size: number | undefined = undefined;

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Character }: ClientComponents
) {
  const create = async (
    signer: Account,
    ip: number, // felt
    seed: number,
    pseudo: string, // felt
    add_hole: (x: number, y: number) => void,
    set_size: (size: number) => void,
    reset_holes: () => void,
    set_hit_mob: (mob: MobType) => void,
    set_turn: (mob: TileType) => void
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: import.meta.env.VITE_PUBLIC_ACTIONS_ADDRESS || '',
          entrypoint: 'create',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, ip, seed, pseudo],
        },
      ];

      const tx = await execute(signer, calls);

      // console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        await executeEvents(eventsTransformed, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const play = async (
    signer: Account,
    ip: number, // felt
    x: number,
    y: number,
    add_hole: (x: number, y: number) => void,
    set_size: (size: number) => void,
    reset_holes: () => void,
    set_hit_mob: (mob: MobType) => void,
    set_turn: (mob: TileType) => void
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: import.meta.env.VITE_PUBLIC_ACTIONS_ADDRESS || '',
          entrypoint: 'play',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, ip, x, y],
        },
      ];

      const tx = await execute(signer, calls);

      // console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        await executeEvents(eventsTransformed, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const spawn = async (
    signer: Account,
    ip: number,
    add_hole: (x: number, y: number) => void,
    set_size: (size: number) => void,
    reset_holes: () => void,
    set_hit_mob: (mob: MobType) => void,
    set_turn: (mob: TileType) => void
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: import.meta.env.VITE_PUBLIC_ACTIONS_ADDRESS || '',
          entrypoint: 'spawn',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, ip],
        },
      ];
      const tx = await execute(signer, calls);

      // console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      // console.log(events);
      if (events) {
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        await executeEvents(eventsTransformed, add_hole, set_size, reset_holes, set_hit_mob, set_turn);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  return {
    create,
    play,
    spawn,
  };
}

export async function executeEvents(
  events: TransformedEvent[],
  add_hole: (x: number, y: number) => void,
  set_size: (size: number) => void,
  reset_holes: () => void,
  set_hit_mob: (mob: MobType) => void,
  set_turn: (mob: TileType) => void
) {
  const gameEvents = events.filter((e): e is GameEvent & ComponentData => e.type === 'Game');
  // console.log('gameEvents', gameEvents);
  for (const e of gameEvents) {
    setComponent(e.component, e.entityIndex, e.componentValues);
  }

  const mapEvents = events.filter((e): e is MapEvent & ComponentData => e.type === 'Map');
  // console.log('mapEvents', mapEvents);
  for (const e of mapEvents) {
    set_size(e.size);

    Map_size = e.size;
    if (e.spawn === 0) {
      reset_holes();
    }
    setComponent(e.component, e.entityIndex, e.componentValues);
  }

  const tileEvents = events.filter((e): e is TileEvent & ComponentData => e.type === 'Tile');
  // console.log('tileEvents', tileEvents);
  for (const e of tileEvents) {
    if (e._type === TileType.Hole) {
      add_hole(e.x, e.y);
      Number_of_holes++;
    }
    setComponent(e.component, e.entityIndex, e.componentValues);
  }

  const characterEvents = events.filter((e): e is CharacterEvent & ComponentData => e.type === 'Character');
  // console.log('characterEvents', characterEvents);
  for (const e of characterEvents) {
    if (e.hitter !== 0) {
      set_turn(e.hitter);
      // the mob has taken dmg
      let hit_mob: MobType = 'knight';
      if (e._type === TileType.Barbarian) hit_mob = 'barbarian';
      else if (e._type === TileType.Bowman) hit_mob = 'bowman';
      else if (e._type === TileType.Wizard) hit_mob = 'wizard';
      // console.log('set_hit_mob', hit_mob);
      set_hit_mob(hit_mob);
    } else {
      set_turn(e._type);
    }
    //console.log(e._type);
    setComponent(e.component, e.entityIndex, e.componentValues);
    //if (e._type === TileType.Knight) await sleep(3000);
    await sleep(700);
    updateComponent(e.component, e.entityIndex, { hitter: 0 });
  }
  set_turn(TileType.Knight);

  await sleep(1000);
}

// DISCUSSION: MUD expects Numbers, but entities in Starknet are BigInts (from poseidon hash)
// so I am converting them to Numbers here, but it means that there is a bigger risk of collisions
export function getEntityIdFromKeys(keys: bigint[]): EntityIndex {
  if (keys.length === 1) {
    return parseInt(keys[0].toString()) as EntityIndex;
  }
  // calculate the poseidon hash of the keys
  const poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
  return parseInt(poseidon.toString()) as EntityIndex;
}

function hexToAscii(hex: string) {
  let str = '';
  for (let n = 2; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MapEvent = ComponentData & {
  type: 'Map';
  game_id: number;
  level: number;
  size: number;
  spawn: number;
  score: number;
  over: boolean;
  name: string;
};

function handleMapEvent(
  keys: bigint[],
  values: string[]
): Omit<MapEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [game_id] = keys;
  const [level, size, spawn, score, over, name] = values;
  console.log(
    `[Map: KEYS: (game_id: ${game_id}) - VALUES: (level: ${level}, size: ${size}, spawn: ${spawn}, score: ${Number(
      score
    )}), over: ${Boolean(Number(over))}, name: ${shortString.decodeShortString(name)}]`
  );

  return {
    type: 'Map',
    game_id: Number(game_id),
    level: Number(level),
    size: Number(size),
    spawn: Number(spawn),
    score: Number(score),
    over: Boolean(over),
    name: shortString.decodeShortString(name),
  };
}

type GameEvent = ComponentData & {
  type: 'Game';
  player_id: number;
  game_id: number;
  over: boolean;
  seed: number;
};

function handleGameEvent(
  keys: bigint[],
  values: string[]
): Omit<GameEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [player_id] = keys.map((k) => Number(k));
  const [game_id, over, seed] = values.map((v) => Number(v));
  console.log(
    `[Game: KEYS: (player_id: ${player_id}) - VALUES: (game_id: ${game_id}, over: ${Boolean(over)}, seed: ${seed}, )]`
  );
  return {
    type: 'Game',
    player_id,
    game_id,
    over: Boolean(over),
    seed,
  };
}

type CharacterEvent = ComponentData & {
  type: 'Character';
  game_id: number;
  _type: TileType;
  health: number;
  index: number;
  hitter: number;
  hit: number;
};

function handleCharacterEvent(
  keys: bigint[],
  values: string[]
): Omit<CharacterEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [game_id, _type] = keys.map((k) => Number(k));
  const [health, index, hitter, hit] = values.map((v) => Number(v));
  // console.log(
  //   `[Character: KEYS: (game_id: ${game_id}, _type: ${_type}) - VALUES: (health: ${Number(health)}, index: ${Number(
  //     index
  //   )}, hitter: ${Number(hitter)}, hit: ${Number(hit)})]`
  // );
  return {
    type: 'Character',
    game_id,
    _type,
    health,
    index,
    hitter,
    hit,
  };
}

type TileEvent = ComponentData & {
  type: 'Tile';
  game_id: number;
  map_id: number;
  index: number;
  _type: TileType;
  x: number;
  y: number;
};

function handleTileEvent(
  keys: bigint[],
  values: string[]
): Omit<TileEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [game_id, map_id, index] = keys.map((k) => Number(k));
  const [_type, x, y] = values.map((v) => Number(v));
  // console.log(
  //   `[Tile: KEYS: (game_id: ${game_id}, map_id: ${map_id}, index: ${index}) - VALUES: (_type: ${Number(
  //     _type
  //   )}, (x: ${Number(x)}, y: ${Number(y)}))]`
  // );
  return {
    type: 'Tile',
    game_id,
    map_id,
    index,
    _type,
    x,
    y,
  };
}

type ComponentData = {
  component: Component;
  componentValues: Schema;
  entityIndex: EntityIndex;
};

type TransformedEvent = MapEvent | GameEvent | TileEvent | CharacterEvent;

export async function setComponentsFromEvents(components: Components, events: Event[]): Promise<TransformedEvent[]> {
  const transformedEvents = [];

  for (const event of events) {
    const componentName = hexToAscii(event.data[0]);
    const keysNumber = parseInt(event.data[1]);
    const keys = event.data.slice(2, 2 + keysNumber).map((key) => BigInt(key));
    let index = 2 + keysNumber + 1;
    const numberOfValues = parseInt(event.data[index++]);
    const values = event.data.slice(index, index + numberOfValues);

    // Component
    const component = components[componentName];
    const componentValues = Object.keys(component.schema).reduce((acc: Schema, key, index) => {
      const value = values[index];
      acc[key] = Number(value);
      return acc;
    }, {});
    const entity = getEntityIdFromKeys(keys);

    const baseEventData = {
      component,
      componentValues,
      entityIndex: entity,
    };

    switch (componentName) {
      case 'Map':
        transformedEvents.push({
          ...handleMapEvent(keys, values),
          ...baseEventData,
        });
        break;
      case 'Game':
        transformedEvents.push({
          ...handleGameEvent(keys, values),
          ...baseEventData,
        });
        break;
      case 'Tile':
        transformedEvents.push({
          ...handleTileEvent(keys, values),
          ...baseEventData,
        });
        break;
      case 'Character':
        transformedEvents.push({
          ...handleCharacterEvent(keys, values),
          ...baseEventData,
        });
        break;
    }
  }

  return transformedEvents;
}
