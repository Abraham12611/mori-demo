import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addChat = mutation({
  args: {
    chat: v.object({
      id: v.string(),
      userId: v.string(),
      messages: v.array(v.any()),
      tagline: v.string(),
      chain: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { chat }) => {
    const doc: any = { ...chat, updatedAt: Date.now() };
    await ctx.db.insert("chats", doc);
    const inserted = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", chat.userId))
      .order("desc")
      .first();
    return (inserted as any) ?? null;
  },
});

export const getChat = query({
  args: { id: v.string(), userId: v.string() },
  handler: async (ctx, { id, userId }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    return (rows.find((r) => (r as any).id === id) as any) ?? null;
  },
});

export const findChatsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return rows as any[];
  },
});

export const updateChatTagline = mutation({
  args: { id: v.string(), userId: v.string(), tagline: v.string() },
  handler: async (ctx, { id, userId, tagline }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const chat = rows.find((r) => (r as any).id === id);
    if (!chat) return false;
    await ctx.db.patch(chat._id, { tagline, updatedAt: Date.now() });
    return true;
  },
});

export const updateChatChain = mutation({
  args: { id: v.string(), userId: v.string(), chain: v.string() },
  handler: async (ctx, { id, userId, chain }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const chat = rows.find((r) => (r as any).id === id);
    if (!chat) return false;
    await ctx.db.patch(chat._id, { chain, updatedAt: Date.now() });
    return true;
  },
});

export const addMessageToChat = mutation({
  args: { id: v.string(), userId: v.string(), message: v.any() },
  handler: async (ctx, { id, userId, message }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const chat = rows.find((r) => (r as any).id === id);
    if (!chat) return false;
    const messages = [ ...(chat as any).messages, message ];
    await ctx.db.patch(chat._id, { messages, updatedAt: Date.now() });
    return true;
  },
});

export const updateChatMessages = mutation({
  args: { id: v.string(), userId: v.string(), messages: v.array(v.any()), chain: v.optional(v.string()) },
  handler: async (ctx, { id, userId, messages, chain }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const chat = rows.find((r) => (r as any).id === id);
    if (!chat) return false;
    const patch: any = { messages, updatedAt: Date.now() };
    if (chain !== undefined) patch.chain = chain;
    await ctx.db.patch(chat._id, patch);
    return true;
  },
});

export const deleteChat = mutation({
  args: { id: v.string(), userId: v.string() },
  handler: async (ctx, { id, userId }) => {
    const rows = await ctx.db
      .query("chats")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const chat = rows.find((r) => (r as any).id === id);
    if (!chat) return false;
    await ctx.db.delete(chat._id);
    return true;
  },
});
