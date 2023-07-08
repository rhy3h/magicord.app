import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Reactions } from "@/models/Guilds";
import type { Channel, Emoji, Guild, Role } from "@/types/discord";

export interface DiscordState {
  guilds: {
    data: Array<Guild>;
    loading: boolean;
    error: string | undefined;
  };
  channels: {
    data: Array<Channel>;
    text: Array<Channel>;
    voice: Array<Channel>;
    loading: boolean;
    error: string | undefined;
  };
  roles: {
    data: Array<Role>;
    loading: boolean;
    error: string | undefined;
  };
  emojis: {
    data: Array<Emoji>;
    loading: boolean;
    error: string | undefined;
  };
}

export const enum ChannelType {
  CATEGORY = 4,
  TEXT_CHANNEL = 0,
  VOICE_CHANNEL = 2,
}

const initialState: DiscordState = {
  guilds: {
    data: [],
    loading: true,
    error: undefined,
  },
  channels: {
    data: [],
    text: [],
    voice: [],
    loading: true,
    error: undefined,
  },
  roles: {
    data: [],
    loading: false,
    error: undefined,
  },
  emojis: {
    data: [],
    loading: false,
    error: undefined,
  },
};

export const fetchGuilds = createAsyncThunk("discord/fetchGuilds", () => {
  return axios.get(`/api/discord/guilds`).then((response) => response.data);
});

export const fetchChannels = createAsyncThunk(
  "discord/fetchChannels",
  async (guild_id: string) => {
    return axios
      .get(`/api/discord/guilds/${guild_id}/channels`)
      .then((response) => response.data);
  }
);

export const fetchRoles = createAsyncThunk(
  "discord/fetchRoles",
  async (guild_id: string) => {
    return axios
      .get(`/api/discord/guilds/${guild_id}/roles`)
      .then((response) => response.data);
  }
);

export const fetchEmojis = createAsyncThunk(
  "discord/fetchEmojis",
  async (guild_id: string) => {
    return axios
      .get(`/api/discord/guilds/${guild_id}/emojis`)
      .then((response) => response.data);
  }
);

export const postMessasge = createAsyncThunk(
  "discord/postMessasge",
  async ({
    channel_id,
    data,
  }: {
    channel_id: string;
    data: {
      reaction_role_id: string;
      message: string;
      reactions: Array<Reactions>;
    };
  }) => {
    return axios
      .post(`/api/discord/channels/${channel_id}/messages`, data)
      .then((response) => response.data);
  }
);

export const editMessasge = createAsyncThunk(
  "discord/editMessasge",
  async ({
    channel_id,
    message_id,
    data,
  }: {
    channel_id: string;
    message_id: string;
    data: {
      message: string;
      reactions: Array<Reactions>;
    };
  }) => {
    return axios
      .patch(`/api/discord/channels/${channel_id}/messages/${message_id}`, data)
      .then((response) => {
        response.data;
      });
  }
);

export const discordSlice = createSlice({
  name: "discord",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGuilds.pending, (state) => {
      state.guilds.loading = true;
      state.guilds.error = undefined;
    });
    builder.addCase(fetchGuilds.fulfilled, (state, action) => {
      state.guilds.loading = false;
      state.guilds.data = action.payload;
      state.guilds.error = undefined;
    });
    builder.addCase(fetchGuilds.rejected, (state, action) => {
      state.guilds.loading = false;
      state.guilds.data = [];
      state.guilds.error = action.error.message;
    });

    builder.addCase(fetchChannels.pending, (state) => {
      state.channels.loading = true;
      state.channels.data = [];
      state.channels.text = [];
      state.channels.voice = [];
    });
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.channels.loading = false;
      state.channels.error = undefined;

      const categorys: Array<Channel> = action.payload
        .filter((f: Channel) => f.type == ChannelType.CATEGORY)
        .sort((a: Channel, b: Channel) => {
          return a.position - b.position;
        });

      const channels: Array<Channel> = [];
      for (let i = 0, l = categorys.length; i < l; i++) {
        const category = categorys[i];
        channels.push(category);
        const childChannels: Array<Channel> = action.payload
          .filter((f: Channel) => f.parent_id == category.id)
          .sort((a: Channel, b: Channel) => {
            return a.position - b.position;
          });
        channels.push(
          ...childChannels.filter((f) => f.type == ChannelType.TEXT_CHANNEL),
          ...childChannels.filter((f) => f.type == ChannelType.VOICE_CHANNEL)
        );
      }

      state.channels.data = channels;
      state.channels.text = channels.filter(
        (f: Channel) =>
          f.type == ChannelType.CATEGORY || f.type == ChannelType.TEXT_CHANNEL
      );
      state.channels.voice = channels.filter(
        (f: Channel) =>
          f.type == ChannelType.CATEGORY || f.type == ChannelType.VOICE_CHANNEL
      );
    });
    builder.addCase(fetchChannels.rejected, (state, action) => {
      state.channels.loading = false;
      state.channels.error = action.error.message as string;
    });

    builder.addCase(fetchRoles.pending, (state) => {
      state.roles.loading = true;
      state.roles.error = undefined;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      state.roles.loading = false;
      state.roles.data = action.payload;
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.roles.loading = false;
      state.roles.error = action.error.message;
    });

    builder.addCase(fetchEmojis.pending, (state) => {
      state.emojis.loading = true;
      state.emojis.error = undefined;
    });
    builder.addCase(fetchEmojis.fulfilled, (state, action) => {
      state.emojis.loading = false;
      state.emojis.data = action.payload.map((m: Emoji) => {
        return {
          ...m,
          url: `https://cdn.discordapp.com/emojis/${m.id}.${
            m.animated ? "gif" : "webp"
          }`,
        };
      });
    });
    builder.addCase(fetchEmojis.rejected, (state, action) => {
      state.emojis.loading = false;
      state.emojis.error = action.error.message;
    });
  },
});

export default discordSlice.reducer;
