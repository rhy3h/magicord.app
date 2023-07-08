import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DiscordState, fetchGuilds } from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";
import Spinner from "@/components/Modules/Spinner";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
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
          <Spinner width="w-12" height="h-12" />
        ) : (
          discordStore.guilds.data.map((guilds, index) => (
            <Link
              key={index}
              onClick={async (e) => {
                if (guilds.setup) {
                  return;
                }

                e.preventDefault();
                function buildURL(baseURL: string, queryParams: any) {
                  const encodedParams = Object.keys(queryParams).map((key) => {
                    const encodedKey = encodeURIComponent(key);
                    const encodedValue = encodeURIComponent(queryParams[key]);
                    return `${encodedKey}=${encodedValue}`;
                  });

                  const queryString = encodedParams.join("&");
                  return `${baseURL}?${queryString}`;
                }
                const baseURL = "https://discord.com/oauth2/authorize";
                const queryParams = {
                  scope: "bot identify",
                  response_type: "code",
                  permissions: 8,
                  client_id: process.env.NEXT_PUBLIC_MAGICORD_CLIENT_ID,
                  guild_id: guilds.id,
                  redirect_uri: `${process.env.NEXT_PUBLIC_MAGICORD_URL}/guild-oauth`,
                };
                const inviteUrl = buildURL(baseURL, queryParams);
                let popupWindow = window.open(
                  inviteUrl,
                  undefined,
                  "height=776, width=500"
                );
                window.addEventListener("message", function (e) {
                  if (
                    e.source == popupWindow &&
                    e.data.type == "access_confirm"
                  ) {
                    router.push(`dashboard/${e.data.body.guild_id}`);
                  }
                });
              }}
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
