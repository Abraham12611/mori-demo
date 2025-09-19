import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const key = `images/${fileName}`;
    await del(key);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete image error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
