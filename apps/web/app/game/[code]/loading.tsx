import { Commet } from "react-loading-indicators";

export default function GameLoading({
  text,
  time,
}: {
  text?: string;
  time?: string;
}) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Commet color="black" size="medium" text="" textColor="" />
      {text ? <h1 className="text-3xl font-bold mt-12">{text}</h1> : ""}
      {time ? <h1 className="text-3xl font-bold mt-6">{time} remaining</h1> : ""}
    </div>
  );
}
