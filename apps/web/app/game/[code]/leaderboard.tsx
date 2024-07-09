import { WsScores } from "shared-types";

export const GameLeaderboard = ({ scores }: { scores: WsScores }) => {
  const top = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md rounded-lg bg-white shadow-md">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-bold">Leaderboard</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          {scores.slice(0, 5).map((score, index) => (
            <div
              key={score.player + index}
              className="flex items-center justify-between font-medium"
            >
              <div
                className={`${index < 3 ? "bg-black" : "bg-neutral-400"} text-white rounded-full px-3 py-1 text-sm font-semibold`}
              >
                {top[index]}
              </div>
              <div className="flex-1 ml-4">{score.player}</div>
              <div>{score.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
