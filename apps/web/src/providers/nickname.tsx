import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { backendUrl } from "../util";
import { Commet } from "react-loading-indicators";

export const NicknameProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [nickname, setNickname] = useState<string>("");
  const [nicknameInput, setNicknameInput] = useState<string>("");

  const { isPending, error, data } = useQuery({
    queryKey: ["nickname"],
    queryFn: async () => {
      const response = await axios.get(backendUrl + "/nickname", {
        withCredentials: true,
      });
      setNickname(response.data.nickname);
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return await axios.post(
        backendUrl + "/nickname",
        { nickname: nicknameInput },
        { withCredentials: true }
      );
    },
  });

  const handleSaveNickname = () => {
    mutation.mutate();
  };

  useEffect(() => {
    if (mutation.isSuccess) setNickname(nicknameInput);
  }, [mutation.isSuccess]);

  return (
    <>
      {nickname ? (
        children
      ) : (
        <>
          <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            {isPending || mutation.isPending ? (
              <Commet color="black" size="medium" text="" textColor="" />
            ) : (
              <div className="mx-auto w-full max-w-md space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Set Nickname
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Choose a nickname to use throughout the app.
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your nickname"
                    className="h-16 text-2xl w-full text-center outline outline-1 outline-neutral-400 rounded-2xl"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSaveNickname}
                  className="w-full bg-primary text-primary-foreground text-center hover:bg-primary/90 p-2 rounded-xl"
                >
                  Set Nickname
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
