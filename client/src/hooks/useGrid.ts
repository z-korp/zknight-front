import { Coordinate, GridElement } from '../type/GridElement';
import { MobType } from '../ui/Mob';
import { areCoordsEqual } from '../utils/grid';
import { getBowAttack, getNeighbors, getWizardAttack } from '../utils/pathfinding';
import { useComponentStates } from './useComponentStates';

export interface ActionableTile {
  tile: Coordinate;
  action: 'walk' | 'attack';
}

const isOtherOnThisTile = (tile: Coordinate, mobs: any): boolean => {
  const { knight, barbarian, wizard, bowman } = mobs;
  if (barbarian.position && areCoordsEqual(tile, barbarian.position)) return true;
  else if (knight.position && areCoordsEqual(tile, knight.position)) return true;
  else if (wizard.position && areCoordsEqual(tile, wizard.position)) return true;
  else if (bowman.position && areCoordsEqual(tile, bowman.position)) return true;
  return false;
};

export const useGrid = (grid: GridElement[][]): any => {
  const mobs = useComponentStates();

  const getActionableTiles = (type: MobType): ActionableTile[] => {
    const mob = mobs[type];
    if (mob && mob.position) {
      if (type === 'knight') {
        const n = getNeighbors(mob.position, grid);
        return n.map((e) => ({
          tile: e,
          action: isOtherOnThisTile(e, mobs) ? 'attack' : 'walk',
        }));
      } else if (type === 'barbarian') {
        const n = getNeighbors(mob.position, grid);
        return n.map((e) => ({ tile: e, action: 'attack' }));
      } else if (type === 'bowman') {
        const n = getBowAttack(mob.position, grid);
        return n.map((e) => ({ tile: e, action: 'attack' }));
      } else if (type === 'wizard') {
        const n = getWizardAttack(mob.position, grid);
        return n.map((e) => ({ tile: e, action: 'attack' }));
      }
    }
    return [];
  };

  return { getActionableTiles };
};
