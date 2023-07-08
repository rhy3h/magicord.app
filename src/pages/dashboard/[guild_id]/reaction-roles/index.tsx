import DashboardLayout from "@/components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/router";
import {
  addReactionRole,
  removeReactionRole,
} from "@/store/namespace/databaseSlice";
import type { ReactionRoles } from "@/models/Guilds";
import Link from "next/link";
import { DiscordState } from "@/store/namespace/discordSlice";

export default function ReactionRolesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const discordStore = useSelector<RootState>(
    (state) => state.discord
  ) as DiscordState;
  const reaction_roles = useSelector<RootState>(
    (state) => state.database.data?.reaction_roles
  ) as Array<ReactionRoles>;

  return (
    <>
      <DashboardLayout>
        <div className="space-y-12">
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Reaction Roles
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Let your members get roles by reacting to a message
                </p>
              </div>
            </div>

            <div className="p-6 mt-6 bg-slate-100 rounded-lg">
              <div className="flex justify-between">
                <h2 className="text-base font-semibold leading-7 text-gray-900 ">
                  New reaction role
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const id = router.query.guild_id as string;
                    dispatch(addReactionRole(id));
                  }}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 mt-6 bg-slate-100 rounded-lg">
            <div className="border-b border-gray-900/10 pb-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Your messages
              </h2>
            </div>

            <ul role="list" className="pt-6">
              {reaction_roles &&
                reaction_roles.map((m) => {
                  return (
                    <li
                      key={m._id.toString()}
                      className="[&:not(:first-child)]:mt-2"
                    >
                      <Link
                        href={`/dashboard/${
                          router.query.guild_id
                        }/reaction-roles/${m._id.toString()}`}
                      >
                        <div className="flex justify-between gap-x-6 p-5 bg-slate-300 rounded cursor-pointer hover hover:border-gray-700 border-transparent border-2">
                          <div className="flex gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                {m.name}
                                {m.channel_id && (
                                  <span className="text-gray-500">
                                    {` # ${
                                      discordStore.channels.text.find(
                                        (f) => f.id == m.channel_id
                                      )?.name
                                    }`}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-x-4">
                            <p className="text-sm font-semibold leading-6 ">
                              {m.message_id ? (
                                <span className=" text-gray-900">Publish</span>
                              ) : (
                                <span className=" text-gray-500">Draft</span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-x-4">
                            <p className="text-sm font-semibold leading-6 ">
                              {m.message_id ? (
                                <span className=" text-gray-900">{`#${m.message_id}`}</span>
                              ) : (
                                <span className=" text-gray-500">
                                  Not publish yet
                                </span>
                              )}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              const guild_id = router.query.guild_id as string;
                              const reaction_role_id = m._id.toString();
                              const channel_id = m.channel_id as string;
                              const message_id = m.message_id as string;

                              e.preventDefault();
                              e.stopPropagation();

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
                                }
                              });
                            }}
                            type="button"
                            className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                          >
                            Delete
                          </button>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
