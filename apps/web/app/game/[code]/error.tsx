"use client";

import { AxiosError } from "axios";
import Link from "next/link";

export default function GameError({ error }: { error: AxiosError }) {
  console.log("Error:", error);
  const errorOptions: {
    [key: number]: {
      text: string;
      buttonText: string;
      link: string;
      subText: string;
    };
  } = {
    404: {
      text: "The game you are trying to join does not exist.",
      subText: "Please try again or create a new game.",
      buttonText: "Join another game",
      link: "/join",
    },
    403: {
      text: "The game you are trying to join is already running.",
      subText: "Please wait for the game to finish or join another game.",
      buttonText: "Join another game",
      link: "/join",
    },
    500: {
      text: "There was an error joining the game.",
      subText:
        "Please try again later or contact support if the issue persists.",
      buttonText: "Go to Homepage",
      link: "/",
    },
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {errorOptions[error.response?.status!]?.text}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {errorOptions[error.response?.status!]?.subText}
        </p>
        <div className="mt-6">
          <Link
            href={errorOptions[error.response?.status!]?.link || ""}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {errorOptions[error.response?.status!]?.buttonText!}
          </Link>
        </div>
      </div>
    </div>
  );
}
