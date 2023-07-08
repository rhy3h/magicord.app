import axios from "axios";
import { type Reactions } from "@/models/Guilds";

async function putReactionOnMessage(
  channel_id: string,
  message_id: string,
  emoji_name: string,
  emoji_id: string
) {
  return await axios.put(
    `https://discord.com/api/channels/${channel_id}/messages/${message_id}/reactions/${emoji_name}%3A${emoji_id}/@me`,
    null,
    {
      headers: {
        Authorization: `Bot ${process.env.MAGICORD_ACCESS_TOKEN}`,
      },
    }
  );
}

export async function postReactionsOnMessage(
  channel_id: string,
  message_id: string,
  reactions: Array<Reactions>
) {
  return new Promise(async (resolve) => {
    for (let i = 0, l = reactions.length; i < l; i++) {
      const reaction = reactions[i] as Reactions;

      await putReactionOnMessage(
        channel_id,
        message_id,
        reaction.emoji_name,
        reaction.emoji_id
      ).catch((error) => {
        console.log(error);
      });

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(true);
        }, 0.3 * 1000)
      );
    }
    resolve(true);
  });
}
