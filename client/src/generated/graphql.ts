import { print } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Cursor: { input: any; output: any };
  DateTime: { input: any; output: any };
  bool: { input: any; output: any };
  felt252: { input: any; output: any };
  u8: { input: any; output: any };
  u32: { input: any; output: any };
};

export type Character = {
  __typename?: 'Character';
  entity?: Maybe<Entity>;
  health?: Maybe<Scalars['u8']['output']>;
  hit?: Maybe<Scalars['u8']['output']>;
  hitter?: Maybe<Scalars['u8']['output']>;
  index?: Maybe<Scalars['u32']['output']>;
};

export type CharacterConnection = {
  __typename?: 'CharacterConnection';
  edges?: Maybe<Array<Maybe<CharacterEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Character>;
};

export type CharacterOrder = {
  direction: Direction;
  field: CharacterOrderOrderField;
};

export enum CharacterOrderOrderField {
  Health = 'HEALTH',
  Hit = 'HIT',
  Hitter = 'HITTER',
  Index = 'INDEX',
}

export type CharacterWhereInput = {
  health?: InputMaybe<Scalars['Int']['input']>;
  healthGT?: InputMaybe<Scalars['Int']['input']>;
  healthGTE?: InputMaybe<Scalars['Int']['input']>;
  healthLT?: InputMaybe<Scalars['Int']['input']>;
  healthLTE?: InputMaybe<Scalars['Int']['input']>;
  healthNEQ?: InputMaybe<Scalars['Int']['input']>;
  hit?: InputMaybe<Scalars['Int']['input']>;
  hitGT?: InputMaybe<Scalars['Int']['input']>;
  hitGTE?: InputMaybe<Scalars['Int']['input']>;
  hitLT?: InputMaybe<Scalars['Int']['input']>;
  hitLTE?: InputMaybe<Scalars['Int']['input']>;
  hitNEQ?: InputMaybe<Scalars['Int']['input']>;
  hitter?: InputMaybe<Scalars['Int']['input']>;
  hitterGT?: InputMaybe<Scalars['Int']['input']>;
  hitterGTE?: InputMaybe<Scalars['Int']['input']>;
  hitterLT?: InputMaybe<Scalars['Int']['input']>;
  hitterLTE?: InputMaybe<Scalars['Int']['input']>;
  hitterNEQ?: InputMaybe<Scalars['Int']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  indexGT?: InputMaybe<Scalars['Int']['input']>;
  indexGTE?: InputMaybe<Scalars['Int']['input']>;
  indexLT?: InputMaybe<Scalars['Int']['input']>;
  indexLTE?: InputMaybe<Scalars['Int']['input']>;
  indexNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type ComponentUnion = Character | Game | Map | Tile;

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Entity = {
  __typename?: 'Entity';
  componentNames?: Maybe<Scalars['String']['output']>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars['Int']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Event>;
};

export type Game = {
  __typename?: 'Game';
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']['output']>;
  name?: Maybe<Scalars['felt252']['output']>;
  over?: Maybe<Scalars['bool']['output']>;
  score?: Maybe<Scalars['u8']['output']>;
  seed?: Maybe<Scalars['felt252']['output']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type GameEdge = {
  __typename?: 'GameEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Game>;
};

export type GameOrder = {
  direction: Direction;
  field: GameOrderOrderField;
};

export enum GameOrderOrderField {
  GameId = 'GAME_ID',
  Name = 'NAME',
  Over = 'OVER',
  Score = 'SCORE',
  Seed = 'SEED',
}

export type GameWhereInput = {
  game_id?: InputMaybe<Scalars['Int']['input']>;
  game_idGT?: InputMaybe<Scalars['Int']['input']>;
  game_idGTE?: InputMaybe<Scalars['Int']['input']>;
  game_idLT?: InputMaybe<Scalars['Int']['input']>;
  game_idLTE?: InputMaybe<Scalars['Int']['input']>;
  game_idNEQ?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameGT?: InputMaybe<Scalars['String']['input']>;
  nameGTE?: InputMaybe<Scalars['String']['input']>;
  nameLT?: InputMaybe<Scalars['String']['input']>;
  nameLTE?: InputMaybe<Scalars['String']['input']>;
  nameNEQ?: InputMaybe<Scalars['String']['input']>;
  over?: InputMaybe<Scalars['Int']['input']>;
  overGT?: InputMaybe<Scalars['Int']['input']>;
  overGTE?: InputMaybe<Scalars['Int']['input']>;
  overLT?: InputMaybe<Scalars['Int']['input']>;
  overLTE?: InputMaybe<Scalars['Int']['input']>;
  overNEQ?: InputMaybe<Scalars['Int']['input']>;
  score?: InputMaybe<Scalars['Int']['input']>;
  scoreGT?: InputMaybe<Scalars['Int']['input']>;
  scoreGTE?: InputMaybe<Scalars['Int']['input']>;
  scoreLT?: InputMaybe<Scalars['Int']['input']>;
  scoreLTE?: InputMaybe<Scalars['Int']['input']>;
  scoreNEQ?: InputMaybe<Scalars['Int']['input']>;
  seed?: InputMaybe<Scalars['String']['input']>;
  seedGT?: InputMaybe<Scalars['String']['input']>;
  seedGTE?: InputMaybe<Scalars['String']['input']>;
  seedLT?: InputMaybe<Scalars['String']['input']>;
  seedLTE?: InputMaybe<Scalars['String']['input']>;
  seedNEQ?: InputMaybe<Scalars['String']['input']>;
};

export type Map = {
  __typename?: 'Map';
  entity?: Maybe<Entity>;
  level?: Maybe<Scalars['u32']['output']>;
  size?: Maybe<Scalars['u32']['output']>;
  spawn?: Maybe<Scalars['bool']['output']>;
};

export type MapConnection = {
  __typename?: 'MapConnection';
  edges?: Maybe<Array<Maybe<MapEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type MapEdge = {
  __typename?: 'MapEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Map>;
};

export type MapOrder = {
  direction: Direction;
  field: MapOrderOrderField;
};

export enum MapOrderOrderField {
  Level = 'LEVEL',
  Size = 'SIZE',
  Spawn = 'SPAWN',
}

export type MapWhereInput = {
  level?: InputMaybe<Scalars['Int']['input']>;
  levelGT?: InputMaybe<Scalars['Int']['input']>;
  levelGTE?: InputMaybe<Scalars['Int']['input']>;
  levelLT?: InputMaybe<Scalars['Int']['input']>;
  levelLTE?: InputMaybe<Scalars['Int']['input']>;
  levelNEQ?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sizeGT?: InputMaybe<Scalars['Int']['input']>;
  sizeGTE?: InputMaybe<Scalars['Int']['input']>;
  sizeLT?: InputMaybe<Scalars['Int']['input']>;
  sizeLTE?: InputMaybe<Scalars['Int']['input']>;
  sizeNEQ?: InputMaybe<Scalars['Int']['input']>;
  spawn?: InputMaybe<Scalars['Int']['input']>;
  spawnGT?: InputMaybe<Scalars['Int']['input']>;
  spawnGTE?: InputMaybe<Scalars['Int']['input']>;
  spawnLT?: InputMaybe<Scalars['Int']['input']>;
  spawnLTE?: InputMaybe<Scalars['Int']['input']>;
  spawnNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  characterComponents?: Maybe<CharacterConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  gameComponents?: Maybe<GameConnection>;
  mapComponents?: Maybe<MapConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
  tileComponents?: Maybe<TileConnection>;
};

export type QueryCharacterComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<CharacterOrder>;
  where?: InputMaybe<CharacterWhereInput>;
};

export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};

export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGameComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};

export type QueryMapComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<MapOrder>;
  where?: InputMaybe<MapWhereInput>;
};

export type QuerySystemArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySystemCallArgs = {
  id: Scalars['Int']['input'];
};

export type QueryTileComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TileOrder>;
  where?: InputMaybe<TileWhereInput>;
};

export type System = {
  __typename?: 'System';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  system: System;
  systemId?: Maybe<Scalars['ID']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<System>;
};

export type Tile = {
  __typename?: 'Tile';
  _type?: Maybe<Scalars['u8']['output']>;
  entity?: Maybe<Entity>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type TileConnection = {
  __typename?: 'TileConnection';
  edges?: Maybe<Array<Maybe<TileEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type TileEdge = {
  __typename?: 'TileEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Tile>;
};

export type TileOrder = {
  direction: Direction;
  field: TileOrderOrderField;
};

export enum TileOrderOrderField {
  X = 'X',
  Y = 'Y',
  Type = '_TYPE',
}

export type TileWhereInput = {
  _type?: InputMaybe<Scalars['Int']['input']>;
  _typeGT?: InputMaybe<Scalars['Int']['input']>;
  _typeGTE?: InputMaybe<Scalars['Int']['input']>;
  _typeLT?: InputMaybe<Scalars['Int']['input']>;
  _typeLTE?: InputMaybe<Scalars['Int']['input']>;
  _typeNEQ?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  xGT?: InputMaybe<Scalars['Int']['input']>;
  xGTE?: InputMaybe<Scalars['Int']['input']>;
  xLT?: InputMaybe<Scalars['Int']['input']>;
  xLTE?: InputMaybe<Scalars['Int']['input']>;
  xNEQ?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
  yGT?: InputMaybe<Scalars['Int']['input']>;
  yGTE?: InputMaybe<Scalars['Int']['input']>;
  yLT?: InputMaybe<Scalars['Int']['input']>;
  yLTE?: InputMaybe<Scalars['Int']['input']>;
  yNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never }>;

export type GetEntitiesQuery = {
  __typename?: 'Query';
  entities?: {
    __typename?: 'EntityConnection';
    edges?: Array<{
      __typename?: 'EntityEdge';
      node?: {
        __typename?: 'Entity';
        keys?: Array<string | null> | null;
        components?: Array<
          | { __typename: 'Character'; health?: any | null; index?: any | null; hitter?: any | null; hit?: any | null }
          | { __typename: 'Game'; game_id?: any | null; score?: any | null; over?: any | null; seed?: any | null }
          | { __typename: 'Map'; level?: any | null; size?: any | null; spawn?: any | null }
          | { __typename: 'Tile'; _type?: any | null; x?: any | null; y?: any | null }
          | null
        > | null;
      } | null;
    } | null> | null;
  } | null;
};

export type GetFinishedGamesQueryVariables = Exact<{ [key: string]: never }>;

export type GetFinishedGamesQuery = {
  __typename?: 'Query';
  mapComponents?: {
    __typename?: 'MapConnection';
    edges?: Array<{
      __typename?: 'MapEdge';
      node?: {
        __typename?: 'Map';
        score?: any | null;
        level?: any | null;
        over?: any | null;
        name?: string | null;
      } | null;
    } | null> | null;
  } | null;
};

export const GetEntitiesDocument = gql`
  query getEntities {
    entities(keys: ["%"]) {
      edges {
        node {
          keys
          components {
            __typename
            ... on Game {
              game_id
              score
              over
              seed
              name
            }
            ... on Map {
              level
              size
              spawn
            }
            ... on Character {
              health
              index
              hitter
              hit
            }
            ... on Tile {
              _type
              x
              y
            }
          }
        }
      }
    }
  }
`;
export const GetFinishedGamesDocument = gql`
  query getFinishedGames {
    mapComponents {
      edges {
        node {
          score
          over
          name
          level
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
const GetFinishedGamesDocumentString = print(GetFinishedGamesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntities(
      variables?: GetEntitiesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number }> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getEntities',
        'query'
      );
    },
    getFinishedGames(
      variables?: GetFinishedGamesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<{ data: GetFinishedGamesQuery; extensions?: any; headers: Dom.Headers; status: number }> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.rawRequest<GetFinishedGamesQuery>(GetFinishedGamesDocumentString, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getFinishedGames',
        'query'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
