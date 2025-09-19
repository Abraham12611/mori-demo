import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Tokens: preserve existing behavior from db/services/tokens.ts

export const addToken = mutation({
  args: {
    token: v.object({
      id: v.string(),
      name: v.string(),
      symbol: v.string(),
      decimals: v.number(),
      tags: v.array(v.string()),
      logoURI: v.string(),
      freezeAuthority: v.union(v.string(), v.null()),
      mintAuthority: v.union(v.string(), v.null()),
      permanentDelegate: v.union(v.string(), v.null()),
      extensions: v.object({
        coingeckoId: v.optional(v.string()),
      }),
    }),
  },
  handler: async (ctx, { token }) => {
    const doc = {
      ...token,
      symbolLower: token.symbol.toLowerCase(),
      updatedAt: Date.now(),
    } as any;
    await ctx.db.insert("tokens", doc);
    const inserted = await ctx.db
      .query("tokens")
      .withIndex("by_id", (q) => q.eq("id", token.id))
      .first();
    return (inserted as any) ?? null;
  },
});

export const getToken = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db
      .query("tokens")
      .withIndex("by_id", (q) => q.eq("id", id))
      .first();
    return (doc as any) ?? null;
  },
});

export const findTokens = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("tokens")
      .withIndex("by_updatedAt")
      .order("desc")
      .collect();
    return rows as any[];
  },
});

export const findTokensBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, { symbol }) => {
    const symbolLower = symbol.toLowerCase();
    const rows = await ctx.db
      .query("tokens")
      .withIndex("by_symbolLower", (q) => q.eq("symbolLower", symbolLower))
      .collect();
    return rows as any[];
  },
});

export const getTokenBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, { symbol }) => {
    const tokens = (await ctx.runQuery(findTokensBySymbol, { symbol })) as any[];
    if (!tokens || tokens.length === 0) return null;
    if (tokens.length === 1) return tokens[0];
    const verified = tokens.find((t) => Array.isArray(t.tags) && t.tags.includes("verified"));
    if (verified) return verified;
    const community = tokens.find((t) => Array.isArray(t.tags) && t.tags.includes("community"));
    if (community) return community;
    return tokens[0];
  },
});

export const deleteToken = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db
      .query("tokens")
      .withIndex("by_id", (q) => q.eq("id", id))
      .first();
    if (!doc) return false;
    await ctx.db.delete(doc._id);
    return true;
  },
});
