import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const filenameField = formData.get("filename");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const filename = typeof filenameField === "string" && filenameField.length > 0
      ? filenameField
      : file.name;

    const key = `images/${filename}`;

    // Preserve overwrite behavior and public access
    const blob = await put(key, file, {
      access: "public",
      allowOverwrite: true,
    });

    // Return the public URL (no query params needed)
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
