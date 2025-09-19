import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addUser = mutation({
  args: {
    user: v.object({
      id: v.string(),
      username: v.string(),
    }),
  },
  handler: async (ctx, { user }) => {
    const now = Date.now();
    await ctx.db.insert("users", { ...user, createdAt: now, updatedAt: now } as any);
    const inserted = await ctx.db.query("users").withIndex("by_id", (q) => q.eq("id", user.id)).first();
    return (inserted as any) ?? null;
  },
});

export const getUser = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const user = await ctx.db.query("users").withIndex("by_id", (q) => q.eq("id", id)).first();
    return (user as any) ?? null;
  },
});

export const updateUsername = mutation({
  args: { id: v.string(), username: v.string() },
  handler: async (ctx, { id, username }) => {
    const user = await ctx.db.query("users").withIndex("by_id", (q) => q.eq("id", id)).first();
    if (!user) return false;
    await ctx.db.patch(user._id, { username, updatedAt: Date.now() });
    return true;
  },
});
