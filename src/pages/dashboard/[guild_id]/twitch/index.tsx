import DashboardLayout from "@/components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { ChannelType, DiscordState } from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import {
  saveDB,
  setTwitchChannelId,
  setTwitchMessage,
  setTwitchTwitchId,
} from "@/store/namespace/databaseSlice";
import type { TwitchAlert } from "@/models/Guilds";

export default function Twitch() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;
  const twitch_alert = useSelector<RootState>(
    (state) => state.database.data?.twitch_alert
  ) as TwitchAlert;

  return (
    <>
      <DashboardLayout>
        <div className="space-y-12">
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Twitch
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Twitch</p>
              </div>
              <div className="flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = router.query.guild_id as string;
                    const data = {
                      "twitch_alert.channel_id": twitch_alert.channel_id,
                      "twitch_alert.twitch_id": twitch_alert.twitch_id,
                      "twitch_alert.message": twitch_alert.message,
                    };
                    dispatch(saveDB({ id, data })).then((result) => {
                      if (result.meta.requestStatus == "rejected") {
                        alert("Error");
                      }
                    });
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="border-b border-gray-900/10 pb-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Send a message when channel is live
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Notify Message Chaneel
                  </label>
                  <div className="mt-2">
                    <select
                      defaultValue={twitch_alert?.channel_id}
                      onChange={(e) =>
                        dispatch(setTwitchChannelId(e.target.value))
                      }
                      className="block w-full m- rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
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
                    Twitch ID
                  </label>
                  <div className="mt-2">
                    <input
                      defaultValue={twitch_alert?.twitch_id}
                      onChange={(e) =>
                        dispatch(setTwitchTwitchId(e.target.value))
                      }
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alert Message
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      defaultValue={twitch_alert?.message}
                      onChange={(e) =>
                        dispatch(setTwitchMessage(e.target.value))
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
