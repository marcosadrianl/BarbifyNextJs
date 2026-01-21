import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Hola! " }, { status: 201 });
}

export async function POST() {
  return NextResponse.json(
    { message: "POST request received" },
    { status: 200 },
  );
}
