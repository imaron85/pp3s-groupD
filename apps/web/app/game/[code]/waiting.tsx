export default function GameWaiting({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold text-card-foreground">
            Waiting Lobby
          </h1>
          <div className="bg-primary px-6 py-3 rounded-lg text-primary-foreground font-semibold text-2xl">
            {code}
          </div>
          <ul className="w-full space-y-4">
            <li className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground font-bold">
                  J
                </div>
                <div className="text-muted-foreground">John Doe</div>
              </div>
            </li>
            <li className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center text-secondary-foreground font-bold">
                  S
                </div>
                <div className="text-muted-foreground">Sarah Smith</div>
              </div>
            </li>
            <li className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-muted-foreground rounded-full w-10 h-10 flex items-center justify-center text-muted font-bold">
                  M
                </div>
                <div className="text-muted-foreground">Michael Johnson</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
