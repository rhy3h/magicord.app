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

export interface User extends BaseGuild {}

export interface Channel extends BaseGuild {
  type: number;
  parent_id: string;
  guild_id: string;
  position: number;
}

export interface Role extends BaseGuild {
  color: number;
  hoist: boolean;
  icon?: string;
  unicode_emoji?: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  description?: string;
  flags: number;
}

export interface Emoji extends BaseGuild {
  roles?: Array<Role>;
  user?: User;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
}
