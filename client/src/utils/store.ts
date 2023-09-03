import { create } from 'zustand';
import { Coordinate } from '../type/GridElement';

interface Knight {
  position: Coordinate;
  target: Coordinate;
}

export interface Map {
  size: number;
  holes: Coordinate[];
}

interface State {
  ip: number | undefined;
  knight: Knight;
  map: Map;
  add_hole: (x: number, y: number) => void;
  set_size: (size: number) => void;
  reset_holes: () => void;
  set_ip: (ip: number) => void;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  knight: { position: { x: 0, y: 0 }, target: { x: 10, y: 10 } },
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
}));
