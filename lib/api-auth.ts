import { NextResponse } from "next/server";

export function validateApiKey(request: Request): NextResponse | null {
  const authHeader = request.headers.get("Authorization");
  const xApiKey = request.headers.get("x-api-key");

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : xApiKey;

  if (!token || token !== process.env.API_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return null;
}
