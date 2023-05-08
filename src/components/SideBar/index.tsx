import SidebarItem from "./SidebarItem";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { DiscordState, fetchGuilds } from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";

export default function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;

  useEffect(() => {
    if (!discordStore.guilds.data.length) {
      dispatch(fetchGuilds());
    }
  }, []);

  const onGuildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const guildId = e.target.value;
    router.replace(
      {
        pathname: "/dashboard/[guild_id]",
        query: { guild_id: guildId },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen p-3 bg-white w-72 border-r border-gray-300">
        <Link href={"/"}>
          <div className="flex items-center justify-center h-14">
            <div>Magicord</div>
          </div>
        </Link>

        <div className="px-4">
          <select
            id="channel"
            name="channel"
            value={router.query.guild_id}
            className="block w-full m- rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            onChange={onGuildChange}
          >
            {discordStore.guilds.data.map((guild, index) => (
              <option key={index} value={guild.id}>
                {guild.name}
              </option>
            ))}
          </select>
        </div>

        {discordStore.guilds.loading ? (
          <div className="flex items-center justify-center h-screen">
            <div
              className="animate-spin inline-block w-12 h-12 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                    SERVER MANAGEMENT
                  </div>
                </div>
              </li>
              <SidebarItem
                name={"Welcome & Goodbye"}
                url={"welcome"}
                icon={"#wavehand"}
              ></SidebarItem>
              <SidebarItem
                name={"Reaction Roles"}
                url={"reaction_roles"}
                icon={"#reaction"}
              ></SidebarItem>
              <SidebarItem
                name={"Member Count"}
                url={"member_count"}
                icon={"#count"}
              ></SidebarItem>
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                    UTILITIES
                  </div>
                </div>
              </li>
              <SidebarItem
                name={"Temporary Channel"}
                url={"temporary_channel"}
                icon={"#voicechannel"}
              ></SidebarItem>
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                    SOCIAL ALERTS
                  </div>
                </div>
              </li>
              <SidebarItem
                name={"Twitch Alerts"}
                url={"twitch"}
                icon={"#twitch"}
              ></SidebarItem>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
