import type { Channel, Guild } from "@/types/discord";
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
    loading: boolean;
    error: string;
  };
}

const initialState: DiscordState = {
  guilds: {
    data: [],
    loading: false,
    error: "",
  },
  channels: {
    data: [],
    loading: false,
    error: "",
  },
};

export const fetchGuilds = createAsyncThunk("discord/fetchGuilds", () => {
  return axios.get(`/api/discord/guilds`).then((response) => response.data);
});

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
  },
});

export default discordSlice.reducer;
