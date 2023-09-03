interface LeaderboardProps {
  games: { stage: number; score: number; player: string }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ games }) => {
  const playerScores: { [key: string]: number } = {};
  for (const game of games) {
    if (!playerScores[game.player] || playerScores[game.player] < game.score) {
      playerScores[game.player] = game.score;
    }
  }

  // Convertir l'objet en un tableau et trier par score
  const sortedPlayers = Object.keys(playerScores)
    .map((player) => ({ player, score: playerScores[player] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Prendre les 10 premiers

  return (
    <>
      <h1 className="text-black mb-4 text-center">Leaderboard</h1>
      <hr className="my-4 border-2" />

      <div className="flex flex-col items-center justify-between">
        {sortedPlayers.map((entry, index) => (
          <div key={index} className="flex justify-around w-full  py-2 text-black">
            <span className="w-10 text-right">{index + 1}.</span>
            <span className="mr-50 w-40">{entry.player}</span>
            <span className="ml-50 w-40 text-right">{entry.score}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Leaderboard;
