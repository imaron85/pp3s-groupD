import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold tracking-tighter">Game Night</h1>
        <p className="text-muted-foreground text-xl">Create a new game or join an existing one.</p>
      </div>
      <div className="flex flex-col gap-4 mt-12">
        <Link
          href="/create"
          className="inline-flex items-center justify-center w-full h-14 px-12 text-lg rounded-md bg-neutral-200 text-black shadow transition-colors hover:bg-black/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Create Game
        </Link>
        <Link
          href="/join"
          className="inline-flex items-center justify-center w-full h-14 px-12 text-lg rounded-md bg-black text-white shadow transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={true}
        >
          Join via Code
        </Link>
      </div>
    </div>
  )
}