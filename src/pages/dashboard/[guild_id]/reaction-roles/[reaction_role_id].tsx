import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ChannelType,
  editMessasge,
  postMessasge,
} from "@/store/namespace/discordSlice";
import { AppDispatch, RootState } from "@/store";
import {
  addReaction,
  removeReaction,
  removeReactionRole,
  setReactionEmojiId,
  setReactionRoleChannelId,
  setReactionRoleId,
  setReactionRoleMessage,
  setReactionRoleMessageId,
  updateReactionRole,
  updateReactions,
} from "@/store/namespace/databaseSlice";
import type { ReactionRoles, Reactions } from "@/models/Guilds";
import type { Channel, Emoji, Role } from "@/types/discord";

export default function ReactionRolesID() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const text_channels = useSelector<RootState>(
    (state) => state.discord.channels.text
  ) as Array<Channel>;
  const roles = useSelector<RootState>(
    (state) => state.discord.roles.data
  ) as Array<Role>;
  const emojis = useSelector<RootState>(
    (state) => state.discord.emojis.data
  ) as Array<Emoji>;
  const reaction_roles = useSelector<RootState>(
    (state) => state.database.data?.reaction_roles
  ) as Array<ReactionRoles>;
  const reaction_role = reaction_roles?.find(
    (f) => f._id.toString() == router.query.reaction_role_id
  );
  const reactions = reaction_role?.reactions as Array<Reactions>;

  const saveReactionRoles = async () => {
    const guild_id = router.query.guild_id as string;
    const reaction_role_id = router.query.reaction_role_id as string;
    return Promise.all([
      dispatch(
        updateReactionRole({
          guild_id,
          reaction_role_id,
          data: {
            channel_id: reaction_role?.channel_id,
            message: reaction_role?.message,
          },
        })
      ),
      dispatch(
        updateReactions({ guild_id, reaction_role_id, data: reactions })
      ),
    ]);
  };

  return (
    <>
      <DashboardLayout>
        <div className="space-y-12">
          <div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Link
                  href={`/dashboard/${router.query.guild_id}/reaction-roles`}
                >
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Back
                  </span>
                </Link>

                <h2 className="ml-2 text-base font-semibold leading-7 text-gray-900">
                  {reaction_role?.name}
                </h2>
                <button
                  onClick={() => {
                    const guild_id = router.query.guild_id as string;
                    const reaction_role_id = router.query
                      .reaction_role_id as string;
                    const channel_id = reaction_role?.channel_id as string;
                    const message_id = reaction_role?.message_id as string;
                    dispatch(
                      removeReactionRole({
                        guild_id,
                        reaction_role_id,
                        channel_id,
                        message_id,
                      })
                    ).then((result) => {
                      const isRemoved =
                        result.payload.reaction_roles.findIndex(
                          (f: string) => f == reaction_role_id
                        ) == -1;
                      if (!isRemoved) {
                        alert("Error");
                        return;
                      }
                      router.push(`/dashboard/${guild_id}/reaction-roles`);
                    });
                  }}
                  type="button"
                  className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                >
                  Delete
                </button>
              </div>
              <div className="flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                {!reaction_role?.message_id && (
                  <button
                    type="button"
                    onClick={() => {
                      saveReactionRoles();
                    }}
                    className="rounded-md border-slate-950 px-3 py-2 text-sm font-semibold text-gray-900 shadow-md hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Save
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await saveReactionRoles();

                    const reaction_role_id = router.query
                      .reaction_role_id as string;
                    const channel_id = reaction_role?.channel_id as string;
                    const data = {
                      reaction_role_id: reaction_role_id as string,
                      message: reaction_role?.message as string,
                      reactions: reaction_role?.reactions as Array<Reactions>,
                    };

                    if (!reaction_role?.message_id) {
                      if (!channel_id) {
                        alert("Channel ID");
                        return;
                      }
                      if (!data.message) {
                        alert("Message");
                        return;
                      }

                      const message_id = await dispatch(
                        postMessasge({ channel_id, data })
                      ).then((result) => result.payload.message_id);
                      dispatch(
                        setReactionRoleMessageId({
                          reaction_role_id,
                          message_id,
                        })
                      );
                      return;
                    }
                    const message_id = reaction_role?.message_id;
                    await dispatch(
                      editMessasge({ channel_id, message_id, data })
                    );
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {reaction_role?.message_id ? "Modify" : "Publish"}
                </button>
              </div>
            </div>

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="border-b border-gray-900/10 pb-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Channel
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Channel
                  </label>
                  <div className="mt-2">
                    <select
                      disabled={!!reaction_role?.message_id}
                      defaultValue={reaction_role?.channel_id}
                      onChange={(e) => {
                        const reaction_role_id = router.query
                          .reaction_role_id as string;
                        const channel_id = e.target.value;
                        dispatch(
                          setReactionRoleChannelId({
                            reaction_role_id,
                            channel_id,
                          })
                        );
                      }}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value={""}></option>
                      {text_channels?.map((channel, index) => (
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

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="border-b border-gray-900/10 pb-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Message
                </h2>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Message
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      defaultValue={reaction_role?.message}
                      onChange={(e) => {
                        const reaction_role_id = router.query
                          .reaction_role_id as string;
                        const message = e.target.value;
                        dispatch(
                          setReactionRoleMessage({ reaction_role_id, message })
                        );
                      }}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="border-b border-gray-900/10 pb-6 flex items-center">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Reactions and roles
                </h2>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      reactions.length &&
                      (!reactions.slice(-1)[0].emoji_id ||
                        !reactions.slice(-1)[0].role_id)
                    ) {
                      alert("Please select reaction and role first");
                      return;
                    }

                    const guild_id = router.query
                      .reaction_rolguild_ide_id as string;
                    const reaction_role_id = router.query
                      .reaction_role_id as string;

                    const data = reactions;
                    await dispatch(
                      updateReactions({ guild_id, reaction_role_id, data })
                    );
                    dispatch(addReaction({ guild_id, reaction_role_id }));
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-2 ml-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add
                </button>
              </div>

              {reactions &&
                reactions.map((reaction, index) => (
                  <div
                    key={index}
                    className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
                  >
                    <div className="row-span-full">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Select a reaction
                      </label>
                      <div className="mt-2">
                        <select
                          value={reaction.emoji_id}
                          onChange={(e) => {
                            const reaction_role_id = router.query
                              .reaction_role_id as string;
                            const reaction_id = reaction._id.toString();
                            const emoji_id = e.target.value;
                            const emoji_name = emojis.find(
                              (f) => f.id == emoji_id
                            )?.name as string;
                            dispatch(
                              setReactionEmojiId({
                                reaction_role_id,
                                reaction_id,
                                emoji_name,
                                emoji_id,
                              })
                            );
                          }}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value={""}></option>
                          {emojis.map((emoji, index) => (
                            <option key={index} value={emoji.id}>
                              {emoji.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row-span-full">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Select a role
                      </label>
                      <div className="mt-2">
                        <select
                          value={reaction.role_id}
                          onChange={(e) => {
                            const reaction_role_id = router.query
                              .reaction_role_id as string;
                            const reaction_id = reaction._id.toString();
                            const role_id = e.target.value;
                            dispatch(
                              setReactionRoleId({
                                reaction_role_id,
                                reaction_id,
                                role_id,
                              })
                            );
                          }}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value={""}></option>
                          {roles.map((role, index) => (
                            <option key={index} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row-span-full">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        &nbsp;
                      </label>
                      <div className="mt-2">
                        <div className="flex items-center justify-start gap-x-6">
                          <button
                            onClick={() => {
                              const guild_id = router.query.guild_id as string;
                              const reaction_role_id = router.query
                                .reaction_role_id as string;
                              const reaction_id = reaction._id.toString();
                              dispatch(
                                removeReaction({
                                  guild_id,
                                  reaction_role_id,
                                  reaction_id,
                                })
                              );
                            }}
                            type="button"
                            className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
