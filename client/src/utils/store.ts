import { create } from 'zustand';
import { Coordinate } from '../type/GridElement';
import { MobType } from '../ui/Mob';

interface Knight {
  position: Coordinate;
  target: Coordinate;
}

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
  map: Map;
  leaderboard: Score[];
  add_hole: (x: number, y: number) => void;
  set_size: (size: number) => void;
  reset_holes: () => void;
  set_ip: (ip: number) => void;
  add_to_leaderboard: (s: Score) => void;
  set_hit_mob: (mob: MobType) => void;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  leaderboard: [],
  hit_mob: undefined,
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
}));
