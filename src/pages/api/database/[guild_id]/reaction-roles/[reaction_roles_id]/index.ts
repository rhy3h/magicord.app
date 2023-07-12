import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { GuildModel, ReactionRolesModel, ReactionsModel } from "@/models";
import type { Reactions } from "@/models/Guilds";
import { Types } from "mongoose";

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
      const modifiedReactions: Array<Reactions> = req.body.modifiedReactions;
      const addedReactions: Array<Reactions> = req.body.addedReactions;
      const removedReactions: Array<Reactions> = req.body.removedReactions;
      const channel_id: string = req.body.channel_id;
      const message: string = req.body.message;

      const modifiedBulk = modifiedReactions.map((m) => {
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
      const addBulk = addedReactions.map((m) => {
        return {
          insertOne: {
            document: m,
          },
        };
      });
      const removeBulk = removedReactions.map((m) => {
        return {
          deleteOne: {
            filter: {
              _id: m._id,
            },
          },
        };
      });

      const bulkWrites = [...modifiedBulk, ...addBulk, ...removeBulk];
      try {
        // TODO: transactions
        const reactionResult = await ReactionsModel.bulkWrite(bulkWrites);
        const newInsert: Array<Types.ObjectId> = Object.entries(
          reactionResult.insertedIds
        ).map((m) => m[1]);
        await ReactionRolesModel.bulkWrite([
          {
            updateOne: {
              filter: { _id: new Types.ObjectId(reaction_roles_id as string) },
              update: {
                $set: {
                  channel_id: channel_id,
                  message: message,
                },
              },
            },
          },
          {
            updateOne: {
              filter: { _id: new Types.ObjectId(reaction_roles_id as string) },
              update: {
                $push: {
                  reactions: {
                    $each: [...newInsert] as Array<any>,
                  },
                },
              },
            },
          },
          {
            updateOne: {
              filter: { _id: new Types.ObjectId(reaction_roles_id as string) },
              update: {
                $pullAll: {
                  reactions: [
                    ...removedReactions.map((m) => new Types.ObjectId(m._id)),
                  ] as Array<any>,
                },
              },
            },
          },
        ]);
      } catch (error) {}

      await ReactionRolesModel.findById(reaction_roles_id)
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
  }
}
