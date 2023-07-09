import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { GuildModel, ReactionRolesModel, ReactionsModel } from "@/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guild_id, reaction_roles_id } = req.query;

  await dbConnect();

  switch (req.method) {
    case "DELETE": {
      let result = await ReactionRolesModel.findByIdAndDelete(
        reaction_roles_id,
        {
          returnOriginal: false,
        }
      );
      await ReactionsModel.deleteMany({
        _id: result?.reactions,
      });
      await GuildModel.findByIdAndUpdate(
        guild_id,
        {
          $pull: {
            reaction_roles: result?._id,
          },
        },
        {
          upsert: true,
          returnOriginal: false,
        }
      )
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
    case "PATCH": {
      await ReactionRolesModel.findByIdAndUpdate(reaction_roles_id, req.body, {
        returnOriginal: false,
      })
        .select(Object.keys(req.body).join(" "))
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
    }
  }
}
