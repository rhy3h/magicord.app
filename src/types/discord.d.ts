interface BaseGuild {
  id: string;
  name: string;
}

export interface Guild extends BaseGuild {
  icon: string;
  owner: Boolean;
  permissions: number;
  features: Array<string>;
  permissions_new: string;
  setup?: boolean;
}

export interface Channel extends BaseGuild {
  type: number;
  parent_id: string;
  guild_id: string;
  position: number;
}

export interface ReactionRole extends BaseGuild {
  id: string;
  name: string;
  channel_id: string;
  message_id: string;
  message_content: string;
  reactions: Array<Reaction>;
}
