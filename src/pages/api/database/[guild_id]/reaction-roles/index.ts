import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { GuildModel, ReactionRolesModel } from "@/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guild_id } = req.query;

  await dbConnect();

  switch (req.method) {
    case "POST": {
      let result = await ReactionRolesModel.create({});
      await GuildModel.findByIdAndUpdate(
        guild_id,
        {
          $push: {
            reaction_roles: result._id,
          },
        },
        {
          upsert: true,
          returnOriginal: false,
        }
      )
        .select("reaction_roles")
        .populate({
          path: "reaction_roles",
        })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
      break;
    }
  }
}
