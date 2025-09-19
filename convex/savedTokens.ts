import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSavedToken = mutation({
  args: {
    token: v.object({
      id: v.string(),
      userId: v.string(),
      name: v.string(),
      symbol: v.string(),
      logoURI: v.string(),
      chain: v.string(), // 'solana' | 'bsc' | 'base'
    }),
  },
  handler: async (ctx, { token }) => {
    const doc: any = { ...token, updatedAt: Date.now() };
    await ctx.db.insert("savedTokens", doc);
    const inserted = await ctx.db
      .query("savedTokens")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", token.userId))
      .order("desc")
      .first();
    return (inserted as any) ?? null;
  },
});

export const getSavedToken = query({
  args: { id: v.string(), userId: v.string() },
  handler: async (ctx, { id, userId }) => {
    const rows = await ctx.db
      .query("savedTokens")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    return (rows.find((r) => (r as any).id === id) as any) ?? null;
  },
});

export const findSavedTokensByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("savedTokens")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return rows as any[];
  },
});

export const deleteSavedToken = mutation({
  args: { id: v.string(), userId: v.string() },
  handler: async (ctx, { id, userId }) => {
    const rows = await ctx.db
      .query("savedTokens")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", userId))
      .collect();
    const doc = rows.find((r) => (r as any).id === id);
    if (!doc) return false;
    await ctx.db.delete(doc._id);
    return true;
  },
});
