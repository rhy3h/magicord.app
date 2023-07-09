import DashboardLayout from "@/components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { ChannelType, DiscordState } from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import {
  saveDB,
  setGuildMemberAddChannelId,
  setGuildMemberAddMessage,
  setGuildMemberRemoveChannelId,
  setGuildMemberRemoveMessage,
} from "@/store/namespace/databaseSlice";
import type { GuildWithMessage } from "@/models/Guilds";

export default function Welcome() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;
  const guild_member_add = useSelector<RootState>(
    (state) => state.database.data?.guild_member_add
  ) as GuildWithMessage;
  const guild_member_remove = useSelector<RootState>(
    (state) => state.database.data?.guild_member_remove
  ) as GuildWithMessage;

  return (
    <>
      <DashboardLayout>
        <div className="space-y-12">
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Welcome & Goodbye
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Automatically send messages and give roles to your new members
                  and send a message when a members leaves your server
                </p>
              </div>
              <div className="flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const id = router.query.guild_id as string;
                    const data = {
                      "guild_member_add.channel_id":
                        guild_member_add.channel_id,
                      "guild_member_add.message": guild_member_add.message,
                      "guild_member_remove.channel_id":
                        guild_member_remove.channel_id,
                      "guild_member_remove.message":
                        guild_member_remove.message,
                    };
                    dispatch(saveDB({ id, data })).then((result) => {
                      if (result.meta.requestStatus == "rejected") {
                        alert("Error");
                      }
                    });
                  }}
                  type="button"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="border-b border-gray-900/10 pb-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Send a message when a user joins the server
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Welcome Message Channel
                  </label>
                  <div className="mt-2">
                    <select
                      defaultValue={guild_member_add?.channel_id}
                      onChange={(e) =>
                        dispatch(setGuildMemberAddChannelId(e.target.value))
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value={""}></option>
                      {discordStore.channels.text.map((channel, index) => (
                        <option
                          key={index}
                          value={channel.id}
                          disabled={channel.type == ChannelType.CATEGORY}
                        >
                          {channel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Welcome Message
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      defaultValue={guild_member_add?.message}
                      onChange={(e) =>
                        dispatch(setGuildMemberAddMessage(e.target.value))
                      }
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="border-b border-gray-900/10 pb-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Send a message when a user leaves the server
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Goodbye Message Channel
                  </label>
                  <div className="mt-2">
                    <select
                      defaultValue={guild_member_remove?.channel_id}
                      onChange={(e) =>
                        dispatch(setGuildMemberRemoveChannelId(e.target.value))
                      }
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value={""}></option>
                      {discordStore.channels.text.map((channel, index) => (
                        <option
                          key={index}
                          value={channel.id}
                          disabled={channel.type == ChannelType.CATEGORY}
                        >
                          {channel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Goodbye Message
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      defaultValue={guild_member_remove?.message}
                      onChange={(e) =>
                        dispatch(setGuildMemberRemoveMessage(e.target.value))
                      }
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
