import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";

interface ISidebarItem {
  name: string;
  icon: string;
  url: string;
}

export default function SidebarItem(props: ISidebarItem) {
  const router = useRouter();
  const routeUrl = router.pathname.split("/").pop();
  const { name, url } = props;

  return (
    <>
      <li>
        <Link
          className={classNames({
            "relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6":
              true,
            "border-indigo-500": url == routeUrl,
          })}
          href={`/dashboard/${router.query.guild_id}/${url}`}
        >
          <span className="inline-flex justify-center items-center ml-4">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">{name}</span>
        </Link>
      </li>
    </>
  );
}
