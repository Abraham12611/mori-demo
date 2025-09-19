import { User } from "@privy-io/react-auth";

export const pfpURL = (user: User, cacheBust: boolean = true) => {
    const base = process.env.NEXT_PUBLIC_IMAGES_BASE_URL as string | undefined;
    if (base && base.length > 0) {
        // New storage: public base URL (e.g., Vercel Blob). Cache-bust via ?t=
        return `${base}/images/${user.id}${cacheBust ? `?t=${Date.now()}` : ""}`;
    }
    // Fallback to Azure variables to preserve current behavior exactly
    const accountUrl = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_URL as string;
    const sas = process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_STRING as string;
    const tail = `${cacheBust ? `&t=${Date.now()}` : ""}`;
    return `${accountUrl}/images/${user.id}?sv=${sas}${tail}`;
}