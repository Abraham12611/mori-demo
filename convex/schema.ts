import { defineSchema, defineTable, v } from "convex/schema";

export default defineSchema({
  chats: defineTable({
    id: v.string(),
    userId: v.string(),
    messages: v.array(v.any()),
    tagline: v.string(),
    chain: v.optional(v.string()),
    updatedAt: v.number(), // ms-since-epoch to mirror Cosmos `_ts` ordering
  }).index("by_userId_updatedAt", ["userId", "updatedAt"]),

  knowledge: defineTable({
    id: v.string(),
    baseUrl: v.string(),
    name: v.string(),
    summary: v.string(),
    summaryEmbedding: v.array(v.float64()),
    markdownEmbedding: v.optional(v.array(v.float64())),
    markdown: v.string(),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    favicon: v.optional(v.string()),
  })
    .index("by_baseUrl", ["baseUrl"]) 
    .index("by_url", ["url"]) 
    .vectorIndex("by_summaryEmbedding", {
      vectorField: "summaryEmbedding",
      dimensions: 1536,
      filterFields: ["baseUrl"],
    }),

  tokens: defineTable({
    id: v.string(),
    name: v.string(),
    symbol: v.string(),
    symbolLower: v.string(),
    decimals: v.number(),
    tags: v.array(v.string()),
    logoURI: v.string(),
    freezeAuthority: v.union(v.string(), v.null()),
    mintAuthority: v.union(v.string(), v.null()),
    permanentDelegate: v.union(v.string(), v.null()),
    extensions: v.object({
      coingeckoId: v.optional(v.string()),
    }),
    updatedAt: v.number(),
  })
    .index("by_id", ["id"]) 
    .index("by_symbolLower", ["symbolLower"]) 
    .index("by_updatedAt", ["updatedAt"]),

  savedTokens: defineTable({
    id: v.string(),
    userId: v.string(),
    name: v.string(),
    symbol: v.string(),
    logoURI: v.string(),
    chain: v.string(), // "solana" | "bsc" | "base"
    updatedAt: v.number(),
  }).index("by_userId_updatedAt", ["userId", "updatedAt"]),

  users: defineTable({
    id: v.string(),
    username: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_id", ["id"]),
});
