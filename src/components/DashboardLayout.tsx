import React, { PropsWithChildren } from "react";
import SideBar from "./SideBar";

export default function DashboardLayout(props: PropsWithChildren) {
  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="w-full h-screen overflow-auto">
          <div className="w-full h-[80px] border-b border-gray-300">
            <div className="h-full flex justify-between p-6">
              <div></div>
              <div className="flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <div className="p-[40px] h-[calc(100vh-80px)] overflow-auto">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}
