import { UserAnswer } from "shared-types";
import GameLoading from "./loading";
import { use, useEffect, useState } from "react";
import { AnimationControls, motion } from "framer-motion";

export default function GamePlaying({
  question,
  answers,
  onAnswer,
  isOwner,
  remainingTime,
}: {
  remainingTime: string;
  question: string;
  answers: string[];
  onAnswer: (answerIndex: number) => void;
  isOwner: boolean;
}) {
  const answerColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
  ];

  if (!question) return <GameLoading />;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-full max-w-2xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="w-full bg-card rounded-lg p-6 shadow-lg">
            <h1 className="text-4xl font-bold text-card-foreground text-center">
              {question}
            </h1>
            <hr className="my-4" />
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-card-foreground">
                Time Remaining
              </div>
              <div className="text-4xl font-bold text-primary">
                {remainingTime}
              </div>
            </div>
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
              <div
                id="timer"
                className="h-full bg-primary transition-all duration-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full">
            {answerColors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  onAnswer(index);
                }}
                disabled={isOwner}
                className={`${color} aspect-square rounded-lg ${isOwner ? "" : "hover:brightness-75"} transition p-6 shadow-lg text-4xl text-white font-medium`}
              >
                {answers[index]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
