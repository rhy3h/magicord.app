import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function LoggingButton() {
  return (
    <button
      className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      onClick={() => {
        signIn("discord");
      }}
    >
      Login with Discord
    </button>
  );
}

function Panel(props: { user: Session }) {
  const { user } = props;

  return (
    <>
      <div className={`flex-col items-center text-center p-24`}>
        <h1>Hello, {user.user?.name}</h1>

        <div className="mt-5">
          <Link
            className="group rounded-lg border  px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            href={`dashboard`}
          >
            Dashboard
          </Link>
        </div>

        <div>
          <button
            className="group rounded-lg border mt-5 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={() => {
              signOut();
            }}
          >
            Logout Discord
          </button>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <main className={`flex min-h-screen items-center justify-evenly p-24`}>
        {session ? <Panel user={session} /> : <LoggingButton />}
      </main>
    </>
  );
}
