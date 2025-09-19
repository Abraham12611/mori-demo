import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { MeiliSearch } from "meilisearch";
import { findTokens } from "@/db/services/tokens";

export const POST = async (req: NextRequest) => {
  try {
    const authCode = req.nextUrl.searchParams.get("authCode");
    if (process.env.CRAWL_AUTH_CODE && authCode !== process.env.CRAWL_AUTH_CODE) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const MEILI_HOST = process.env.MEILI_HOST as string | undefined;
    const MEILI_API_KEY = process.env.MEILI_API_KEY as string | undefined;
    if (!MEILI_HOST || !MEILI_API_KEY) {
      return NextResponse.json({ error: "Meilisearch not configured" }, { status: 500 });
    }

    const meili = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_API_KEY });
    const index = meili.index("tokens");

    const tokens = await findTokens();
    if (!Array.isArray(tokens)) {
      return NextResponse.json({ error: "No tokens found" }, { status: 404 });
    }

    // Ensure index exists and add documents with primary key id
    await index.updateSettings({ searchableAttributes: ["symbol", "name", "tags"] });
    const task = await index.addDocuments(tokens as any[], { primaryKey: "id" });

    return NextResponse.json({ enqueuedTask: task, count: tokens.length });
  } catch (err) {
    console.error("reindex-tokens error:", err);
    return NextResponse.json({ error: "Reindex failed" }, { status: 500 });
  }
};
