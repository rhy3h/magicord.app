import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const { error, error_description } = router.query;
    const { code, guild_id, permissions } = router.query;

    if (!window.opener) {
      router.push(`dashboard`);
      return;
    }
    if (guild_id) {
      window.opener.postMessage(
        {
          type: "access_confirm",
          body: {
            code,
            guild_id,
            permissions,
          },
        },
        "*"
      );
    }
    if (error) {
      window.opener.postMessage(
        {
          type: "access_denied",
          body: {
            error,
            error_description,
          },
        },
        "*"
      );
    }
    window.close();
  }, [router.isReady]);

  return <></>;
}
