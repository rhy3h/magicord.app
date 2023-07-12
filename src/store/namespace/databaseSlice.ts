import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Guilds, ReactionRoles, Reactions } from "@/models/Guilds";

export interface DBState {
  data: Guilds | null;
  original_data: Guilds | null;
  loading: boolean;
  error: string | undefined;
  removedReactions: Array<Reactions>;
}

const initialState: DBState = {
  data: null,
  original_data: null,
  loading: false,
  error: undefined,
  removedReactions: [],
};

export const fetchDatabase = createAsyncThunk(
  "database/fetchAll",
  async (id: string) => {
    return axios.get(`/api/database/${id}`).then((response) => response.data);
  }
);

export const saveDB = createAsyncThunk(
  "database/saveDB",
  async ({ id, data }: { id: string; data: any }) => {
    return axios
      .patch(`/api/database/${id}`, data)
      .then((response) => response.data);
  }
);

export const addReactionRole = createAsyncThunk(
  "database/add-reaction-role",
  async (id: string) => {
    return axios
      .post(`/api/database/${id}/reaction-roles`)
      .then((response) => response.data);
  }
);

export const removeReactionRole = createAsyncThunk(
  "database/remove-reaction-role",
  async ({
    guild_id,
    reaction_role_id,
    channel_id,
    message_id,
  }: {
    guild_id: string;
    reaction_role_id: string;
    channel_id: string;
    message_id: string;
  }) => {
    if (message_id) {
      await axios
        .delete(`/api/discord/channels/${channel_id}/messages/${message_id}`)
        .catch((error) => {
          console.log(error);
        });
    }
    return axios
      .delete(`/api/database/${guild_id}/reaction-roles/${reaction_role_id}`)
      .then((response) => response.data);
  }
);

export const updateReactionRole = createAsyncThunk(
  "database/update-reaction-role",
  async ({
    guild_id,
    reaction_role_id,
    data,
  }: {
    guild_id: string;
    reaction_role_id: string;
    data: any;
  }) => {
    return axios
      .patch(
        `/api/database/${guild_id}/reaction-roles/${reaction_role_id}`,
        data
      )
      .then((response) => response.data);
  }
);

export const updateReactions = createAsyncThunk(
  "database/update-reactions",
  async ({
    guild_id,
    reaction_role_id,
    data,
  }: {
    guild_id: string;
    reaction_role_id: string;
    data: Array<Reactions>;
  }) => {
    return axios
      .patch(
        `/api/database/${guild_id}/reaction-roles/${reaction_role_id}/reactions`,
        data
      )
      .then((response) => response.data);
  }
);

export const dbSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setGuildMemberAddChannelId(state, action: PayloadAction<string>) {
      state.data!.guild_member_add.channel_id = action.payload;
    },
    setGuildMemberAddMessage(state, action: PayloadAction<string>) {
      state.data!.guild_member_add.message = action.payload;
    },
    setGuildMemberRemoveChannelId(state, action: PayloadAction<string>) {
      state.data!.guild_member_remove.channel_id = action.payload;
    },
    setGuildMemberRemoveMessage(state, action: PayloadAction<string>) {
      state.data!.guild_member_remove.message = action.payload;
    },
    setMemberCountChannelId(state, action: PayloadAction<string>) {
      state.data!.member_count.channel_id = action.payload;
    },
    setTemporaryChannelName(state, action: PayloadAction<string>) {
      state.data!.temporary_channels.name = action.payload;
    },
    setTwitchChannelId(state, action: PayloadAction<string>) {
      state.data!.twitch_alert.channel_id = action.payload;
    },
    setTwitchTwitchId(state, action: PayloadAction<string>) {
      state.data!.twitch_alert.twitch_id = action.payload;
    },
    setTwitchMessage(state, action: PayloadAction<string>) {
      state.data!.twitch_alert.message = action.payload;
    },
    setReactionRoleChannelId(
      state,
      action: PayloadAction<{ reaction_role_id: string; channel_id: string }>
    ) {
      (
        state.data!.reaction_roles.find(
          (f) =>
            (f as ReactionRoles)._id.toString() ==
            action.payload.reaction_role_id
        ) as ReactionRoles
      ).channel_id = action.payload.channel_id;
    },
    setReactionRoleMessage(
      state,
      action: PayloadAction<{ reaction_role_id: string; message: string }>
    ) {
      (
        state.data!.reaction_roles.find(
          (f) =>
            (f as ReactionRoles)._id.toString() ==
            action.payload.reaction_role_id
        ) as ReactionRoles
      ).message = action.payload.message;
    },
    setReactionRoleMessageId(
      state,
      action: PayloadAction<{ reaction_role_id: string; message_id: string }>
    ) {
      (
        state.data!.reaction_roles.find(
          (f) =>
            (f as ReactionRoles)._id.toString() ==
            action.payload.reaction_role_id
        ) as ReactionRoles
      ).message_id = action.payload.message_id;
    },
    addReaction(state, action: PayloadAction<string>) {
      (
        state.data!.reaction_roles.find(
          (f) => (f as ReactionRoles)._id.toString() == action.payload
        ) as ReactionRoles
      ).reactions.push(JSON.parse(JSON.stringify(new Reactions())));
    },
    removeReaction(
      state,
      action: PayloadAction<{
        reaction_role_id: string;
        reaction_index: number;
      }>
    ) {
      const reaction = (
        state.data!.reaction_roles.find(
          (f) =>
            (f as ReactionRoles)._id.toString() ==
            action.payload.reaction_role_id
        ) as ReactionRoles
      ).reactions.splice(action.payload.reaction_index, 1)[0] as Reactions;

      if (reaction._id) {
        state.removedReactions.push(reaction);
      }
    },
    setReactionEmojiId(
      state,
      action: PayloadAction<{
        reaction_role_id: string;
        reaction_index: number;
        emoji_name: string;
        emoji_id: string;
      }>
    ) {
      const reactions = (
        state.data!.reaction_roles.find(
          (f) =>
            (f as ReactionRoles)._id.toString() ==
            action.payload.reaction_role_id
        ) as ReactionRoles
      ).reactions[action.payload.reaction_index] as Reactions;
      reactions.emoji_name = action.payload.emoji_name;
      reactions.emoji_id = action.payload.emoji_id;
    },
    setReactionRoleId(
      state,
      action: PayloadAction<{
        reaction_role_id: string;
        reaction_index: number;
        role_id: string;
      }>
    ) {
      (
        (
          state.data!.reaction_roles.find(
            (f) =>
              (f as ReactionRoles)._id.toString() ==
              action.payload.reaction_role_id
          ) as ReactionRoles
        ).reactions[action.payload.reaction_index] as Reactions
      ).role_id = action.payload.role_id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDatabase.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchDatabase.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.loading = false;
      state.data = action.payload;
      state.original_data = action.payload;
    });
    builder.addCase(fetchDatabase.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(addReactionRole.fulfilled, (state, action) => {
      state.data!.reaction_roles = action.payload.reaction_roles;
    });
    builder.addCase(removeReactionRole.fulfilled, (state, action) => {
      state.data!.reaction_roles = action.payload.reaction_roles;
    });
    builder.addCase(updateReactionRole.fulfilled, (state, action) => {
      let index = state.data!.reaction_roles.findIndex(
        (f) => (f as ReactionRoles)._id.toString() == action.payload._id
      );
      state.data!.reaction_roles[index] = action.payload;
    });
  },
});

export const {
  setGuildMemberAddChannelId,
  setGuildMemberAddMessage,
  setGuildMemberRemoveChannelId,
  setGuildMemberRemoveMessage,
  setMemberCountChannelId,
  setTemporaryChannelName,
  setTwitchChannelId,
  setTwitchTwitchId,
  setTwitchMessage,
  setReactionRoleChannelId,
  setReactionRoleMessage,
  setReactionRoleMessageId,
  addReaction,
  removeReaction,
  setReactionEmojiId,
  setReactionRoleId,
} = dbSlice.actions;
export default dbSlice.reducer;
