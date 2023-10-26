import { useCallback, useEffect, useState } from 'react';
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
  if (barbarian.health !== 0 && barbarian.position && areCoordsEqual(tile, barbarian.position)) return true;
  else if (knight.health !== 0 && knight.position && areCoordsEqual(tile, knight.position)) return true;
  else if (wizard.health !== 0 && wizard.position && areCoordsEqual(tile, wizard.position)) return true;
  else if (bowman.health !== 0 && bowman.position && areCoordsEqual(tile, bowman.position)) return true;
  return false;
};

export const useGrid = (grid: GridElement[][]): any => {
  const mobs = useComponentStates();

  const [knightNeighbors, setKnightNeighbors] = useState<ActionableTile[]>([]);
  const [barbarianNeighbors, setBarbarianNeighbors] = useState<ActionableTile[]>([]);
  const [bowmanNeighbors, setBowmanNeighbors] = useState<ActionableTile[]>([]);
  const [wizardNeighbors, setWizardNeighbors] = useState<ActionableTile[]>([]);

  const getActionableTiles = useCallback(
    (type: MobType): ActionableTile[] => {
      const mob = mobs[type];
      if (mob && mob.position) {
        if (type === 'knight') {
          if (mob.health !== 0) {
            const n = getNeighbors(mob.position, grid);
            return n.map((e) => ({
              tile: e,
              action: isOtherOnThisTile(e, mobs) ? 'attack' : 'walk',
            }));
          }
        } else if (type === 'barbarian') {
          if (mob.health !== 0) {
            const n = getNeighbors(mob.position, grid);
            return n.map((e) => ({ tile: e, action: 'attack' }));
          }
        } else if (type === 'bowman') {
          if (mob.health !== 0) {
            const n = getBowAttack(mob.position, grid);
            return n.map((e) => ({ tile: e, action: 'attack' }));
          }
        } else if (type === 'wizard') {
          if (mob.health !== 0) {
            const n = getWizardAttack(mob.position, grid);
            return n.map((e) => ({ tile: e, action: 'attack' }));
          }
        }
      }
      return [];
    },
    [grid, mobs]
  );

  useEffect(() => {
    setKnightNeighbors(getActionableTiles('knight'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobs.knight.position, mobs.barbarian.position, mobs.bowman.position, mobs.wizard.position]);

  useEffect(() => {
    setBarbarianNeighbors(getActionableTiles('barbarian'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobs.barbarian.position]);

  useEffect(() => {
    setBowmanNeighbors(getActionableTiles('bowman'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobs.bowman.position]);

  useEffect(() => {
    setWizardNeighbors(getActionableTiles('wizard'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobs.wizard.position]);

  return { knightNeighbors, barbarianNeighbors, bowmanNeighbors, wizardNeighbors };
};
