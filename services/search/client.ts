import "server-only";
import { MeiliSearch } from "meilisearch";

// Meilisearch setup using environment variables
// Required envs:
// - MEILI_HOST: e.g. "http://localhost:7700" or your Meilisearch Cloud host
// - MEILI_API_KEY: API key with search permissions
const MEILI_HOST = process.env.MEILI_HOST as string | undefined;
const MEILI_API_KEY = process.env.MEILI_API_KEY as string | undefined;
let tokensIndex: ReturnType<MeiliSearch["index"]> | null = null;
if (MEILI_HOST && MEILI_API_KEY) {
  const meiliClient = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_API_KEY });
  tokensIndex = meiliClient.index("tokens");
}

// Adapter to preserve the Azure Search client's API shape used elsewhere:
// services/search/tokens.ts expects:
//   tokensSearchClient.search(q, { top: 10 }) returning an object with `results`
//   where `results` is an async iterable yielding objects shaped like { document }
export const tokensSearchClient = {
  async search(query: string, options?: { top?: number }) {
    const limit = options?.top ?? 10;
    if (!tokensIndex) {
      async function* empty() { /* no-op */ }
      return { results: empty() as AsyncIterable<{ document: unknown }> };
    }
    // Azure code calls with `${q}*`. Meilisearch supports prefix search implicitly,
    // so we strip a trailing '*' to preserve intent without passing a literal '*'.
    const normalizedQuery = query.endsWith("*") ? query.slice(0, -1) : query;
    const res = await tokensIndex.search(normalizedQuery, { limit });
    const hits = res.hits ?? [];
    async function* makeResults() {
      for (const h of hits) {
        yield { document: h } as { document: unknown };
      }
    }
    return { results: makeResults() } as { results: AsyncIterable<{ document: unknown }> };
  },
};