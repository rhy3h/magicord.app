import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { ReactionRolesModel, ReactionsModel } from "@/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reaction_roles_id, reaction_id } = req.query;

  await dbConnect();

  switch (req.method) {
    case "DELETE": {
      let result = await ReactionsModel.findByIdAndDelete(reaction_id, {
        returnOriginal: false,
      });
      await ReactionRolesModel.findByIdAndUpdate(
        reaction_roles_id,
        {
          $pull: {
            reactions: result?._id,
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
    }
    case "PATCH": {
      break;
    }
  }
}
