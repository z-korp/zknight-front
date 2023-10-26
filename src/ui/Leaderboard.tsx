import { useElementStore } from '../utils/store';

const Leaderboard = () => {
  const { leaderboard } = useElementStore((state) => state);

  const playerScores: { [key: string]: number } = {};
  for (const game of leaderboard) {
    if (!playerScores[game.player] || playerScores[game.player] < game.score) {
      playerScores[game.player] = game.score;
    }
  }

  // Convert the object into an array and sort by score
  const sortedPlayers = Object.keys(playerScores)
    .map((player) => ({ player, score: playerScores[player] }))
    .sort((a, b) => b.score - a.score);

  // Split the players into two columns
  const leftPlayers = sortedPlayers.slice(0, 10);
  const rightPlayers = sortedPlayers.slice(10, 20);

  return (
    <>
      <h1 className="text-black mb-4 text-center">Leaderboard</h1>
      <hr className="my-4 border-2" />
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-start w-1/2">
          {leftPlayers.map((entry, index) => (
            <div key={index} className="flex justify-around w-full py-2 text-black">
              <span className="w-10 text-right">{index + 1}.</span>
              <span className="mr-50 w-40">{entry.player}</span>
              <span className="ml-50 w-40 text-right">{entry.score}</span>
            </div>
          ))}
        </div>
        <hr className="border-2 mx-4 h-[400px]"></hr> {/* This is the vertical divider */}
        <div className="flex flex-col items-center justify-start w-1/2">
          {rightPlayers.map((entry, index) => (
            <div key={index + 10} className="flex justify-around w-full py-2 text-black">
              <span className="w-10 text-right">{index + 11}.</span>
              <span className="mr-50 w-40">{entry.player}</span>
              <span className="ml-50 w-40 text-right">{entry.score}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
