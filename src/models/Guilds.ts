import { Severity, modelOptions, prop } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";

@modelOptions({ schemaOptions: { _id: false, strict: "throw" } })
class GuildBase {
  @prop({ default: true })
  active: boolean;

  @prop({ default: "" })
  channel_id: string;
}

export class GuildWithMessage extends GuildBase {
  @prop({ default: "" })
  message: string;
}

export class GuildWithName extends GuildBase {
  @prop({ default: "" })
  name: string;
}

@modelOptions({ schemaOptions: { collection: "reactions", strict: "throw" } })
export class Reactions {
  _id: Types.ObjectId;

  @prop({ default: "" })
  emoji_id: string;

  @prop({ default: "" })
  emoji_name: string;

  @prop({ default: "" })
  role_id: string;
}

@modelOptions({
  schemaOptions: { collection: "reaction_roles", strict: "throw" },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class ReactionRoles {
  _id: Types.ObjectId;

  @prop({ default: true })
  active: boolean;

  @prop({ default: "New Reaction Role" })
  name: string;

  @prop({ default: "" })
  channel_id: string;

  @prop({ default: "" })
  message_id: string;

  @prop({ default: "" })
  message: string;

  @prop({
    type: Array<Schema.Types.Mixed>,
    ref: Reactions,
    default: [],
  })
  reactions: Array<Schema.Types.ObjectId | Reactions>;
}

@modelOptions({
  schemaOptions: { collection: "guilds", strict: "throw" },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Guilds {
  @prop({ required: true })
  _id: string;

  @prop({ default: {} })
  guild_member_add: GuildWithMessage;

  @prop({ default: {} })
  guild_member_remove: GuildWithMessage;

  @prop({ default: {} })
  temporary_channels: GuildWithName;

  @prop({ default: {} })
  twitch_alert: GuildWithMessage;

  @prop({ default: {} })
  member_count: GuildWithMessage;

  @prop({
    type: Schema.Types.Mixed,
    ref: ReactionRoles,
    default: [],
  })
  reaction_roles: Array<Schema.Types.ObjectId | ReactionRoles>;
}
