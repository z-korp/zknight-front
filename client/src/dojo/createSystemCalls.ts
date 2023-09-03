import { Components, EntityIndex, Schema, setComponent, updateComponent } from '@latticexyz/recs';
import { poseidonHashMany } from 'micro-starknet';
import { Account, Event, InvokeTransactionReceiptResponse, shortString } from 'starknet';
import { TileType } from '../hooks/useComponentStates';
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
    reset_holes: () => void
  ) => {
    try {
      const tx = await execute(signer, 'Create', [ip, seed, pseudo]);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      console.log(events);
      if (events) {
        setComponentsFromEvents(contractComponents, events, add_hole, set_size, reset_holes);
        console.log(receipt);
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
    reset_holes: () => void
  ) => {
    try {
      const tx = await execute(signer, 'Play', [ip, x, y]);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      let game_id = 0;
      if (events) {
        game_id = await setComponentsFromEvents(contractComponents, events, add_hole, set_size, reset_holes);
        console.log(receipt);

        updateComponent(Character, getEntityIdFromKeys([BigInt(game_id), BigInt(TileType.Wizard)]), { hitter: 0 });
        updateComponent(Character, getEntityIdFromKeys([BigInt(game_id), BigInt(TileType.Barbarian)]), { hitter: 0 });
        updateComponent(Character, getEntityIdFromKeys([BigInt(game_id), BigInt(TileType.Knight)]), { hitter: 0 });
        updateComponent(Character, getEntityIdFromKeys([BigInt(game_id), BigInt(TileType.Bowman)]), { hitter: 0 });
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
    reset_holes: () => void
  ) => {
    try {
      const tx = await execute(signer, 'Spawn', [ip]);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;

      const events = receipt.events;

      console.log(events);
      if (events) {
        setComponentsFromEvents(contractComponents, events, add_hole, set_size, reset_holes);
        console.log(receipt);
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

export async function setComponentsFromEvents(
  components: Components,
  events: Event[],
  add_hole: (x: number, y: number) => void,
  set_size: (size: number) => void,
  reset_holes: () => void
) {
  let game_id = 0;
  for (const event of events) {
    const { componentName: name, gameId } = setComponentFromEvent(
      components,
      event.data,
      add_hole,
      set_size,
      reset_holes
    );
    game_id = gameId;
    if (Map_size !== undefined && Number_of_holes >= Map_size) {
      if (name === 'Character') await sleep(500);
    }
  }
  await sleep(1000);
  return game_id;
}

export function setComponentFromEvent(
  components: Components,
  eventData: string[],
  add_hole: (x: number, y: number) => void,
  set_size: (size: number) => void,
  reset_holes: () => void
) {
  // retrieve the component name

  const componentName = hexToAscii(eventData[0]);

  // retrieve the component from name
  const component = components[componentName];

  // get keys
  const keysNumber = parseInt(eventData[1]);
  let index = 2 + keysNumber + 1;

  const keys = eventData.slice(2, 2 + keysNumber).map((key) => BigInt(key));

  // get entityIndex from keys
  const entityIndex = getEntityIdFromKeys(keys);

  // get values
  const numberOfValues = parseInt(eventData[index++]);

  // get values
  const values = eventData.slice(index, index + numberOfValues);

  // create component object from values with schema
  const componentValues = Object.keys(component.schema).reduce((acc: Schema, key, index) => {
    const value = values[index];
    acc[key] = Number(value);
    return acc;
  }, {});

  // set component
  setComponent(component, entityIndex, componentValues);

  let gameId = 0;
  if (componentName === 'Map') {
    const [game_id] = keys;
    const [level, size, spawn, score, over, name] = values;
    console.log(
      `[Map: KEYS: (game_id: ${game_id}) - VALUES: (level: ${level}, size: ${size}, spawn: ${spawn}, score: ${Number(
        score
      )}), over: ${Boolean(Number(over))}, name: ${shortString.decodeShortString(name)}]`
    );
    set_size(Number(values[1]));
    Map_size = Number(values[1]);
    if (Number(spawn) === 0) {
      reset_holes();
    }
  } else if (componentName === 'Game') {
    const [player_id] = keys;
    const [game_id, over, seed] = values;
    gameId = Number(game_id);
    console.log(
      `[Game: KEYS: (player_id: ${player_id}) - VALUES: (game_id: ${Number(game_id)}, over: ${Boolean(
        Number(over)
      )}, seed: ${Number(seed)}, )]`
    );
  } else if (componentName === 'Tile') {
    const [game_id, map_id, index] = keys;
    const [_type, x, y] = values;
    console.log(
      `[Tile: KEYS: (game_id: ${game_id}, map_id: ${map_id}, index: ${index}) - VALUES: (_type: ${Number(
        _type
      )}, (x: ${Number(x)}, y: ${Number(y)}))]`
    );
    if (Number(_type) === TileType.Hole) {
      add_hole(Number(x), Number(y));
      Number_of_holes++;
    }
  } else if (componentName === 'Character') {
    const [game_id, _type] = keys;
    const [health, index, hitter, hit] = values;
    console.log(
      `[Character: KEYS: (game_id: ${game_id}, _type: ${_type}) - VALUES: (health: ${Number(health)}, index: ${Number(
        index
      )}, hitter: ${Number(hitter)}, hit: ${Number(hit)})]`
    );
  } else {
    console.log('eventData', eventData);
    console.log('componentName', componentName);
    console.log('keys', keys);
    console.log('entityIndex', entityIndex);
    console.log('numberOfValues', numberOfValues);
    console.log('values', values);
  }
  //}

  console.log('------------------');
  return { componentName, gameId };
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
