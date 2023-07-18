import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import { Guild } from "@/types/discord";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const promises = [];
  promises.push(
    axios
      .get("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      })
      .then((result) => {
        return result.data.filter((f: Guild) => {
          return (f.permissions & (1 << 3)) == 1 << 3; // Administrator
        });
      }),
    axios
      .get("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
        },
      })
      .then((result) => {
        return result.data;
      })
  );
  try {
    const result = await Promise.all(promises);
    const meGuilds: Guild[] = result[0];
    const botGuilds: Guild[] = result[1];

    meGuilds.forEach((guild) => {
      const result = botGuilds.find((f) => f.id == guild.id);
      guild.setup = !!result;
    });

    res.send(meGuilds);
  } catch (error) {
    res.status(400).send(error);
  }
}
