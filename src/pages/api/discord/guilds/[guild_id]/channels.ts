import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guild_id } = req.query;

  await axios
    .get(`https://discord.com/api/guilds/${guild_id}/channels`, {
      headers: {
        Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
      },
    })
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch((error) => {
      const { status, data } = error.response;
      res.status(status).send(data);
    });
}
