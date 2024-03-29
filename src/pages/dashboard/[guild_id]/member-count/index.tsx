import DashboardLayout from "@/components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { ChannelType, DiscordState } from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import {
  saveDB,
  setMemberCountChannelId,
} from "@/store/namespace/databaseSlice";
import { GuildWithMessage } from "@/models/Guilds";

export default function MemberCount() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;
  const member_count = useSelector<RootState>(
    (state) => state.database.data?.member_count
  ) as GuildWithMessage;

  return (
    <>
      <DashboardLayout>
        <div className="space-y-12">
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Member Count
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Member Count
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
                      "member_count.channel_id": member_count.channel_id,
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
                  Choose which channel to update server member count
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Member Count Channel
                  </label>
                  <div className="mt-2">
                    <select
                      defaultValue={member_count?.channel_id}
                      onChange={(e) =>
                        dispatch(setMemberCountChannelId(e.target.value))
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
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
