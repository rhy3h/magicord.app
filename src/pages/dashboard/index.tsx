import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [guilds, setGuilds] = useState<IGuild[]>([]);

  const fetchGuildsData = async () => {
    const response = await fetch(`/api/discord/guilds`);
    setGuilds(await response.json());
  };

  useEffect(() => {
    fetchGuildsData();
  }, []);

  return (
    <>
      <main className={`flex min-h-screen items-center justify-evenly p-24`}>
        {guilds &&
          guilds.map((guilds, index) => (
            <Link
              key={index}
              className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              href={`dashboard/${guilds.id}`}
            >
              {guilds.name} {!guilds.setup && "Setup"}
            </Link>
          ))}
      </main>
    </>
  );
}
