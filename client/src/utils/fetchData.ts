import { shortString } from 'starknet';

export const fetchData = async (graphSdk: any): Promise<{ stage: number; score: number; player: string }[]> => {
  try {
    const { data } = await graphSdk.getFinishedGames();

    console.log('data', data);

    if (data && data.mapComponents && data.mapComponents.edges) {
      const gameComponentsWithKeys: any[] = [];

      data.mapComponents.edges.forEach((edge: any) => {
        if (edge && edge.node?.score !== undefined && edge.node?.name && edge.node?.level) {
          gameComponentsWithKeys.push({
            score: edge.node?.score,
            stage: edge.node?.level, // Changed 'level' to 'stage' to match the return type
            player: shortString.decodeShortString(edge.node?.name),
          });
        }
      });

      console.log('gameComponentsWithKeys', gameComponentsWithKeys);
      return gameComponentsWithKeys;
    } else {
      return []; // Return an empty array if the conditions are not met
    }
  } catch (error) {
    console.error('Error fetching games:', error);
    return []; // Return an empty array in case of an error
  }
};
