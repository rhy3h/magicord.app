import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { GuildModel } from "@/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guild_id } = req.query;

  await dbConnect();

  switch (req.method) {
    case "POST": {
      await GuildModel.create({
        _id: guild_id as string,
      })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
      break;
    }
    case "DELETE": {
      await GuildModel.findByIdAndDelete(guild_id, {
        returnOriginal: false,
      })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
    }
    case "GET": {
      try {
        let result = await GuildModel.findById(guild_id).populate({
          path: "reaction_roles",
          populate: { path: "reactions" },
        });
        if (!result) {
          result = await GuildModel.create({
            _id: guild_id as string,
          });
        }
        res.status(200).send(result);
      } catch (error) {
        res.status(400).send(error);
      }
      break;
    }
    case "PATCH": {
      await GuildModel.findByIdAndUpdate(guild_id, req.body, {
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
