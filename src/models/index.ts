import { getModelForClass, pre } from "@typegoose/typegoose";
import { Guilds, ReactionRoles, Reactions } from "@/models/Guilds";

export const GuildModel = getModelForClass(Guilds);
export const ReactionRolesModel = getModelForClass(ReactionRoles);
export const ReactionsModel = getModelForClass(Reactions);
