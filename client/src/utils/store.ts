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
  knight: Knight;
  map: Map;
  add_hole: (x: number, y: number) => void;
  set_size: (size: number) => void;
}

export const useElementStore = create<State>((set) => ({
  knight: { position: { x: 0, y: 0 }, target: { x: 10, y: 10 } },
  map: { size: 0, holes: [] },
  add_hole: (x: number, y: number) =>
    set((state) => ({
      map: { size: state.map.size, holes: [...state.map.holes, { x, y }] },
    })),
  set_size: (size: number) => set((state) => ({ map: { size, holes: state.map.holes } })),
}));
