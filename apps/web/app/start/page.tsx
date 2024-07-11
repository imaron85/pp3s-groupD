"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "../../src/util";
import { Game, Quiz } from "shared-types";
import { Commet } from "react-loading-indicators";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

export default function StartGame() {
  const { isPending, error, data } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/quiz/quizzes`, {
        withCredentials: true,
      });
      return response.data as { quizzes: Quiz[] };
    },
  });

  const mutation = useMutation({
    mutationFn: async (quizId: string): Promise<{ data: { game: Game } }> => {
      return await axios.post(
        backendUrl + "/game",
        { quizId: quizId },
        { withCredentials: true }
      );
    },
  });

  const startGame = (quiz: string) => {
    mutation.mutate(quiz);
  };

  useEffect(() => {
    if (mutation.isSuccess)
      redirect(`/game/${mutation.data?.data?.game?.gameCode}`);
  }, [mutation.isSuccess]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Head>
        <title>Start Game - Quiz Night</title>
      </Head>
      {isPending ? (
        <Commet color="black" size="medium" text="" textColor="" />
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data!.quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-lg shadow-md overflow-hidden h-full"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
                    <p className="text-gray-500">{quiz.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      startGame(quiz._id!);
                    }}
                    className="bg-black text-white shadow transition-colors hover:bg-black/80 font-bold py-2 px-4 rounded-xl mt-4"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/create"
              className="bg-black text-white shadow transition-colors hover:bg-black/80 font-bold py-2 px-4 rounded-xl"
            >
              Create New Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
