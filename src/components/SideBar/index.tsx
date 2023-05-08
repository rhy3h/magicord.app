import SidebarItem from "./SidebarItem";
import Link from "next/link";

export default function SideBar() {
  const sideBarItems = [];

  return (
    <>
      <div className="flex flex-col h-screen p-3 bg-white w-60 bg-slate-200 border-r border-gray-300">
        <Link href={"/"}>
          <div className="flex items-center justify-center h-14">
            <div>Magicord</div>
          </div>
        </Link>

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
      </div>
    </>
  );
}
