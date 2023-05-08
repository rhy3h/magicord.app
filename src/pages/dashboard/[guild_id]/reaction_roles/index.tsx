import DashboardLayout from "@/components/DashboardLayout";
import { ReactionRole } from "@/types/discord";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReactionRoles() {
  const router = useRouter();

  const reactionRolesData: Array<ReactionRole> = [
    {
      id: "1",
      name: "New Reaction Role",
      channel_id: "Text Channel",
      message_id: "",
      message_content: "",
      reactions: [],
    },
    {
      id: "2",
      name: "New Reaction Role",
      channel_id: "Text Channel",
      message_id: "",
      message_content: "",
      reactions: [],
    },
  ];
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
              {reactionRolesData &&
                reactionRolesData.map((m) => {
                  return (
                    <li key={m.id} className="[&:not(:first-child)]:mt-2">
                      <Link
                        href={`/dashboard/${router.query.guild_id}/reaction_roles/${m.id}`}
                      >
                        <div className="flex justify-between gap-x-6 p-5 bg-slate-300 rounded cursor-pointer hover hover:border-gray-700 border-transparent border-2">
                          <div className="flex gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                {m.name}
                                <span className="text-gray-500">
                                  {` #${m.channel_id}`}
                                </span>
                              </p>
                              {/* <img
                        className="mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                        src=""
                        alt=""
                      /> */}
                            </div>
                          </div>
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
