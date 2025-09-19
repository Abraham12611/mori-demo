import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addKnowledge = mutation({
  args: {
    knowledge: v.object({
      baseUrl: v.string(),
      name: v.string(),
      summary: v.string(),
      summaryEmbedding: v.array(v.number()),
      markdown: v.string(),
      url: v.optional(v.string()),
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      favicon: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { knowledge }) => {
    // Generate a stable id if not provided by caller
    const id = crypto.randomUUID();
    await ctx.db.insert("knowledge", { id, ...knowledge } as any);
    const inserted = await ctx.db
      .query("knowledge")
      .withIndex("by_baseUrl", (q) => q.eq("baseUrl", knowledge.baseUrl))
      .first();
    return (inserted as any) ?? null;
  },
});

export const getKnowledge = query({
  args: { id: v.string(), baseUrl: v.string() },
  handler: async (ctx, { id, baseUrl }) => {
    const rows = await ctx.db
      .query("knowledge")
      .withIndex("by_baseUrl", (q) => q.eq("baseUrl", baseUrl))
      .collect();
    return (rows.find((r) => (r as any).id === id) as any) ?? null;
  },
});

export const findKnowledgeByBaseUrl = query({
  args: { baseUrl: v.string() },
  handler: async (ctx, { baseUrl }) => {
    const rows = await ctx.db
      .query("knowledge")
      .withIndex("by_baseUrl", (q) => q.eq("baseUrl", baseUrl))
      .collect();
    return rows as any[];
  },
});

export const findRelevantKnowledge = query({
  args: { vector: v.array(v.number()) },
  handler: async (ctx, { vector }) => {
    const results = await ctx.vectorSearch("knowledge", "by_summaryEmbedding", {
      vector,
      limit: 50,
    });
    const filtered = results.filter((r) => r._score >= 0.65).slice(0, 10);
    const docs = await Promise.all(
      filtered.map(async (r) => {
        const doc = await ctx.db.get(r._id);
        return doc ? ({ ...(doc as any), distance: r._score } as any) : null;
      })
    );
    return docs.filter(Boolean) as any[];
  },
});

export const findKnowledgeByUrl = query({
  args: { url: v.string() },
  handler: async (ctx, { url }) => {
    const rows = await ctx.db
      .query("knowledge")
      .withIndex("by_url", (q) => q.eq("url", url))
      .collect();
    return rows as any[];
  },
});

export const updateKnowledgeContent = mutation({
  args: {
    id: v.string(),
    baseUrl: v.string(),
    markdown: v.string(),
    markdownEmbedding: v.array(v.number()),
  },
  handler: async (ctx, { id, baseUrl, markdown, markdownEmbedding }) => {
    const rows = await ctx.db
      .query("knowledge")
      .withIndex("by_baseUrl", (q) => q.eq("baseUrl", baseUrl))
      .collect();
    const doc = rows.find((r) => (r as any).id === id);
    if (!doc) return false;
    await ctx.db.patch(doc._id, { markdown, markdownEmbedding } as any);
    return true;
  },
});

export const deleteKnowledge = mutation({
  args: { id: v.string(), baseUrl: v.string() },
  handler: async (ctx, { id, baseUrl }) => {
    const rows = await ctx.db
      .query("knowledge")
      .withIndex("by_baseUrl", (q) => q.eq("baseUrl", baseUrl))
      .collect();
    const doc = rows.find((r) => (r as any).id === id);
    if (!doc) return false;
    await ctx.db.delete(doc._id);
    return true;
  },
});
