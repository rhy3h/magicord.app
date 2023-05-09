import { Channel, Guild } from "@/types/discord";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface DiscordState {
  guilds: {
    data: Array<Guild>;
    loading: boolean;
    error: string;
  };
  channels: {
    data: Array<Channel>;
    text: Array<Channel>;
    voice: Array<Channel>;
    loading: boolean;
    error: string;
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
    loading: false,
    error: "",
  },
  channels: {
    data: [],
    text: [],
    voice: [],
    loading: false,
    error: "",
  },
};

export const fetchGuilds = createAsyncThunk("discord/fetchGuilds", () => {
  return axios.get(`/api/discord/guilds`).then((response) => response.data);
});

export const fetchChannels = createAsyncThunk(
  "discord/fetchChannels",
  async (id: string) => {
    return axios
      .get(`/api/discord/channels/${id}`)
      .then((response) => response.data);
  }
);

export const discordSlice = createSlice({
  name: "discord",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGuilds.pending, (state) => {
      state.guilds.loading = true;
    });
    builder.addCase(fetchGuilds.fulfilled, (state, action) => {
      state.guilds.loading = false;
      state.guilds.data = action.payload;
      state.guilds.error = "";
    });
    builder.addCase(fetchGuilds.rejected, (state, action) => {
      state.guilds.loading = false;
      state.guilds.data = [];
      state.guilds.error = action.error.message as string;
    });

    builder.addCase(fetchChannels.pending, (state) => {
      state.channels.loading = true;
      state.channels.data = [];
      state.channels.text = [];
      state.channels.voice = [];
    });
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.channels.loading = false;
      state.channels.error = "";

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
  },
});

export default discordSlice.reducer;
