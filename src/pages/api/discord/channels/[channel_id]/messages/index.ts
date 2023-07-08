import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import type { Reactions } from "@/models/Guilds";
import { ReactionRolesModel } from "@/models";
import { postReactionsOnMessage } from "./module";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const channel_id = req.query.channel_id as string;

  switch (req.method) {
    case "POST": {
      const reaction_role_id = req.body.reaction_role_id as string;
      const message = req.body.message as string;
      const reactions = req.body.reactions as Array<Reactions>;

      let result;
      try {
        result = await axios.post(
          `https://discord.com/api/channels/${channel_id}/messages`,
          {
            content: message,
          },
          {
            headers: {
              Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
            },
          }
        );
      } catch (error: any) {
        const { status, data } = error.response;
        res.status(status).send(data);
        return;
      }

      const message_id = result.data.id as string;
      await postReactionsOnMessage(channel_id, message_id, reactions);

      try {
        await dbConnect();
        await ReactionRolesModel.findByIdAndUpdate(reaction_role_id, {
          message_id: message_id,
        });
      } catch (error) {
        res.status(400).send(error);
        return;
      }

      res.status(200).send({ message_id: message_id });
      break;
    }
  }
}
