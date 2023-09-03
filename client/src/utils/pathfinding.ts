import { Coordinate, GridElement } from '../type/GridElement';

export const getNeighbors = (tile: Coordinate, grid: GridElement[][]): Coordinate[] => {
  const number_tiles = grid.length;
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 }, // Horizontal et vertical
  ];

  const neighbors: Coordinate[] = [];
  for (const { x: dx, y: dy } of directions) {
    const x = tile.x + dx;
    const y = tile.y + dy;
    if (x >= 0 && y >= 0 && x < number_tiles && y < number_tiles && grid[x][y].type !== 'water') {
      neighbors.push({ x, y });
    }
  }

  return neighbors;
};

export const getBowAttack = (tile: Coordinate, grid: GridElement[][]): Coordinate[] => {
  const number_tiles = grid.length;
  const directions = [
    { x: -2, y: 0 },
    { x: -3, y: 0 },
    { x: -4, y: 0 },
    { x: -5, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 0, y: -2 },
    { x: 0, y: -3 },
    { x: 0, y: -4 },
    { x: 0, y: -5 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 },
  ];

  const tiles: Coordinate[] = [];
  for (const { x: dx, y: dy } of directions) {
    const x = tile.x + dx;
    const y = tile.y + dy;
    if (x >= 0 && y >= 0 && x < number_tiles && y < number_tiles && grid[x][y].type !== 'water') {
      tiles.push({ x, y });
    }
  }

  return tiles;
};

export const getWizardAttack = (tile: Coordinate, grid: GridElement[][]): Coordinate[] => {
  const number_tiles = grid.length;
  const directions = [
    { x: -1, y: 0 },
    { x: -2, y: 0 },
    { x: -3, y: 0 },
    { x: -4, y: 0 },
    { x: -5, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 0, y: -3 },
    { x: 0, y: -4 },
    { x: 0, y: -5 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 },
  ];

  const tiles: Coordinate[] = [];
  for (const { x: dx, y: dy } of directions) {
    const x = tile.x + dx;
    const y = tile.y + dy;
    if (x >= 0 && y >= 0 && x < number_tiles && y < number_tiles && grid[x][y].type !== 'water') {
      tiles.push({ x, y });
    }
  }

  return tiles;
};

// const costToMove = (from: Coordinate, to: Coordinate): number => {
//   return from.x === to.x || from.y === to.y ? 2 : 1;
// };

// export const aStarPathfinding = (
//   start: Coordinate,
//   end: Coordinate,
//   number_tiles: number,
//   grid: GridElement[][]
// ): Coordinate[] => {
//   const cameFrom: Map<string, Coordinate> = new Map();
//   const costSoFar: Map<string, number> = new Map();
//   const priorityQueue: [number, Coordinate][] = [[0, start]];
//   costSoFar.set(`${start.x}-${start.y}`, 0);

//   while (priorityQueue.length > 0) {
//     priorityQueue.sort((a, b) => a[0] - b[0]); // Tri en ordre croissant
//     const current = priorityQueue.shift()![1]; // Prendre le nœud avec la plus faible priorité

//     if (current.x === end.x && current.y === end.y) {
//       // Reconstruct path
//       let temp = current;
//       const path = [temp];
//       while (cameFrom.has(`${temp.x}-${temp.y}`)) {
//         temp = cameFrom.get(`${temp.x}-${temp.y}`)!;
//         path.push(temp);
//       }
//       return path.reverse();
//     }

//     for (const neighbor of getNeighbors(current, number_tiles, grid)) {
//       const newCost = costSoFar.get(`${current.x}-${current.y}`)! + costToMove(current, neighbor);

//       if (!costSoFar.has(`${neighbor.x}-${neighbor.y}`) || newCost < costSoFar.get(`${neighbor.x}-${neighbor.y}`)!) {
//         costSoFar.set(`${neighbor.x}-${neighbor.y}`, newCost);
//         cameFrom.set(`${neighbor.x}-${neighbor.y}`, current);
//         const priority = newCost + heuristic(neighbor, end);
//         priorityQueue.push([priority, neighbor]);
//       }
//     }
//   }

//   return [];
// };

// // Fonction heuristique: distance de Manhattan adaptée
// const heuristic = (a: Coordinate, b: Coordinate): number => {
//   const dx = Math.abs(a.x - b.x);
//   const dy = Math.abs(a.y - b.y);
//   return 2 * (dx + dy) - Math.min(dx, dy);
// };

// export const accessibleTiles = (
//   start: Coordinate,
//   maxCost: number,
//   number_tiles: number,
//   grid: GridElement[][]
// ): Coordinate[] => {
//   const priorityQueue: [number, Coordinate][] = [[0, start]]; // Utilisez une file de priorité
//   const costSoFar: Map<string, number> = new Map();

//   costSoFar.set(`${start.x}-${start.y}`, 0);

//   const accessible: Coordinate[] = [];

//   while (priorityQueue.length > 0) {
//     priorityQueue.sort((a, b) => a[0] - b[0]); // Tri en ordre croissant
//     const current = priorityQueue.shift()![1]; // Prendre le nœud avec la plus faible priorité

//     const currentCost = costSoFar.get(`${current.x}-${current.y}`);
//     if (currentCost === undefined) {
//       continue;
//     }

//     if (currentCost <= maxCost) {
//       accessible.push(current);
//     }

//     for (const neighbor of getNeighbors(current, number_tiles, grid)) {
//       const newCost = currentCost + costToMove(current, neighbor);

//       if (
//         newCost <= maxCost &&
//         (!costSoFar.has(`${neighbor.x}-${neighbor.y}`) || newCost < costSoFar.get(`${neighbor.x}-${neighbor.y}`)!)
//       ) {
//         costSoFar.set(`${neighbor.x}-${neighbor.y}`, newCost);
//         const priority = newCost; // Ici, la priorité est simplement le nouveau coût
//         priorityQueue.push([priority, neighbor]);
//       }
//     }
//   }

//   return accessible;
// };
