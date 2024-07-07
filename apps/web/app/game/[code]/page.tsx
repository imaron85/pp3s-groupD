"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import GameLoading from "./loading";

export default function Game({ params: { code } }: any) {
  const { isPending, error, data } = useQuery({
    queryKey: ["game", code],
    queryFn: async () => {
      const response = await fetch(`/api/game/${code}`);
      return response.json();
    },
  });

  return <>{isPending ? <GameLoading /> : ""}</>;
}
