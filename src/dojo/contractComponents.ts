/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from '@latticexyz/recs';

export function defineContractComponents(world: World) {
  return {
    Character: (() => {
      const name = 'Character';
      return defineComponent(
        world,
        {
          health: RecsType.Number,
          index: RecsType.Number,
          hitter: RecsType.Number, // type of the last mob that hit the Character
          hit: RecsType.Number, // damage from the hitter
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Game: (() => {
      const name = 'Game';
      return defineComponent(
        world,
        {
          game_id: RecsType.Number,
          over: RecsType.Number,
          seed: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Map: (() => {
      const name = 'Map';
      return defineComponent(
        world,
        {
          level: RecsType.Number,
          size: RecsType.Number,
          spawn: RecsType.Number, // true: map is playing, false: the player has finished its level, should call spawn
          score: RecsType.Number,
          over: RecsType.Boolean,
          name: RecsType.String,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Tile: (() => {
      const name = 'Tile';
      return defineComponent(
        world,
        {
          _type: RecsType.Number,
          x: RecsType.Number,
          y: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    AuthStatus: (() => {
      const name = 'AuthStatus';
      return defineComponent(
        world,
        {
          is_authorized: RecsType.Boolean,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    AuthRole: (() => {
      const name = 'AuthRole';
      return defineComponent(
        world,
        {
          id: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
  };
}