import SidebarItem from "./SidebarItem";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  DiscordState,
  fetchChannels,
  fetchEmojis,
  fetchGuilds,
  fetchRoles,
} from "@/store/namespace/discordSlice";
import { DBState, fetchDatabase } from "@/store/namespace/databaseSlice";
import { AppDispatch, RootState } from "@/store";
import Spinner from "@/components/Modules/Spinner";
import SkeletonLoader from "@/components/Modules/SkeletonLoader";

export default function SideBar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;
  const dbStore = useSelector<RootState>((state) => state.database) as DBState;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!discordStore.guilds.data.length) {
      dispatch(fetchGuilds());
    }
    if (!discordStore.channels.data.length) {
      dispatch(fetchChannels(router.query.guild_id as string));
    }
    if (!discordStore.roles.data.length) {
      dispatch(fetchRoles(router.query.guild_id as string));
    }
    if (!discordStore.emojis.data.length) {
      dispatch(fetchEmojis(router.query.guild_id as string));
    }
    if (!dbStore.data) {
      dispatch(fetchDatabase(router.query.guild_id as string));
    }
  }, [router.isReady]);

  const onGuildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const guildId = e.target.value;
    dispatch(fetchChannels(guildId));
    dispatch(fetchRoles(guildId));
    dispatch(fetchEmojis(guildId));
    dispatch(fetchDatabase(guildId));
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
          {discordStore.guilds.loading ? (
            <div className="block w-full h-9 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
              <Spinner width="w-6" height="h-6" />
            </div>
          ) : (
            <select
              value={router.query.guild_id}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              onChange={onGuildChange}
            >
              {discordStore.guilds.data.map((guild, index) => (
                <option key={index} value={guild.id}>
                  {guild.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {discordStore.guilds.loading ||
        discordStore.channels.loading ||
        dbStore.loading ? (
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-4 space-y-1 ax-w-md rounded animate-pulse p-4">
              <li>
                <div className="flex flex-row items-center h-8">
                  <SkeletonLoader width="w-48" height="h-3.5" />
                </div>
              </li>
              {[1, 2, 3].map((item) => (
                <li key={item}>
                  <div className="relative flex flex-row items-center h-11">
                    <div className="mr-4">
                      <SkeletonLoader
                        width="w-6"
                        height="h-5"
                        bg="bg-transparent"
                      />
                    </div>
                    <SkeletonLoader width="w-full" height="h-3.5" />
                  </div>
                </li>
              ))}
              {[4, 5].map((item) => (
                <div key={item}>
                  <li>
                    <div className="flex flex-row items-center h-8">
                      <SkeletonLoader width="w-48" height="h-3.5" />
                    </div>
                  </li>
                  <li>
                    <div className="relative flex flex-row items-center h-11">
                      <div className="mr-4">
                        <SkeletonLoader
                          width="w-6"
                          height="h-5"
                          bg="bg-transparent"
                        />
                      </div>
                      <SkeletonLoader width="w-full" height="h-3.5" />
                    </div>
                  </li>
                </div>
              ))}
            </ul>
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
                url={"reaction-roles"}
                icon={"#reaction"}
              ></SidebarItem>
              <SidebarItem
                name={"Member Count"}
                url={"member-count"}
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
                url={"temporary-channel"}
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
