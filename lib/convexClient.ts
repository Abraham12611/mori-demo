import "server-only";

// Minimal Convex HTTP client wrapper without relying on generated types.
// NOTE: Requires NEXT_PUBLIC_CONVEX_URL to be set to your Convex deployment URL.
import { ConvexHttpClient } from "convex/browser";

const url = process.env.NEXT_PUBLIC_CONVEX_URL as string | undefined;

export const convexClient = url ? new ConvexHttpClient(url) : null;

export const useConvex = !!convexClient && process.env.USE_CONVEX === "true";
