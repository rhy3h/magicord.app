import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DiscordState, fetchGuilds } from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;

  useEffect(() => {
    dispatch(fetchGuilds());
  }, []);

  return (
    <>
      <main className={`flex min-h-screen items-center justify-evenly p-24`}>
        {discordStore.guilds.loading ? (
          <div
            className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          discordStore.guilds.data.map((guilds, index) => (
            <Link
              key={index}
              className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              href={`dashboard/${guilds.id}`}
            >
              {guilds.name} {!guilds.setup && "Setup"}
            </Link>
          ))
        )}
      </main>
    </>
  );
}
