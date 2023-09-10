import { create } from 'zustand';
import { TileType } from '../hooks/useComponentStates';
import { Coordinate } from '../type/GridElement';
import { MobType } from '../ui/Mob';

export interface Map {
  size: number;
  holes: Coordinate[];
}

export interface Score {
  stage: number;
  score: number;
  player: string;
}

interface State {
  ip: number | undefined;
  hit_mob: MobType | undefined;
  turn: TileType;
  map: Map;
  leaderboard: Score[];
  add_hole: (x: number, y: number) => void;
  set_size: (size: number) => void;
  reset_holes: () => void;
  set_ip: (ip: number) => void;
  add_to_leaderboard: (s: Score) => void;
  set_hit_mob: (mob: MobType) => void;
  set_turn: (mob: TileType) => void;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  leaderboard: [],
  hit_mob: undefined,
  turn: 2,
  map: { size: 0, holes: [] },
  add_hole: (x: number, y: number) =>
    set((state) => ({
      map: { size: state.map.size, holes: [...state.map.holes, { x, y }] },
    })),
  reset_holes: () =>
    set((state) => ({
      map: { size: state.map.size, holes: [] },
    })),
  set_size: (size: number) => set((state) => ({ map: { size, holes: state.map.holes } })),
  set_ip: (ip: number) => set(() => ({ ip })),
  add_to_leaderboard: (s: Score) => set((state) => ({ leaderboard: [...state.leaderboard, s] })),
  set_hit_mob: (mob: MobType) => set(() => ({ hit_mob: mob })),
  set_turn: (mob: TileType) => set(() => ({ turn: mob })),
}));
