import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Reactions } from "@/models/Guilds";
import { postReactionsOnMessage } from "./module";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const channel_id = req.query.channel_id as string;
  const message_id = req.query.message_id as string;

  switch (req.method) {
    case "DELETE": {
      await axios
        .delete(
          `https://discord.com/api/channels/${channel_id}/messages/${message_id}`,
          {
            headers: {
              Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
            },
          }
        )
        .then(() => {
          res.status(200).send("OK");
        })
        .catch((error) => {
          const { status, data } = error.response;
          res.status(status).send(data);
        });
      break;
    }
    case "PATCH": {
      const message = req.body.message as string;
      const reactions = req.body.reactions as Array<Reactions>;

      await axios.patch(
        `https://discord.com/api/channels/${channel_id}/messages/${message_id}`,
        {
          content: message,
        },
        {
          headers: {
            Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
          },
        }
      );
      await axios.delete(
        `https://discord.com/api/channels/${channel_id}/messages/${message_id}/reactions`,
        {
          headers: {
            Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
          },
        }
      );
      await postReactionsOnMessage(channel_id, message_id, reactions);
      res.status(200).send("OK");
    }
  }
}
