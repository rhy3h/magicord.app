import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { ReactionRolesModel, ReactionsModel } from "@/models";
import { Reactions } from "@/models/Guilds";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reaction_roles_id } = req.query;

  await dbConnect();

  switch (req.method) {
    case "POST": {
      let result = await ReactionsModel.create({});
      await ReactionRolesModel.findByIdAndUpdate(
        reaction_roles_id,
        {
          $push: {
            reactions: result._id,
          },
        },
        {
          upsert: true,
          returnOriginal: false,
        }
      )
        .select("reactions")
        .populate({
          path: "reactions",
        })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
      break;
    }
    case "PATCH": {
      const writes = req.body.map((m: Reactions) => {
        return {
          updateOne: {
            filter: {
              _id: m._id,
            },
            update: {
              $set: {
                emoji_id: m.emoji_id,
                emoji_name: m.emoji_name,
                role_id: m.role_id,
              },
            },
          },
        };
      });

      await ReactionsModel.bulkWrite(writes)
        .then((result) => {
          res
            .status(200)
            .send(
              `Matched Data: ${result.matchedCount}\nModified Data: ${result.modifiedCount}`
            );
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
      break;
    }
  }
}
