import { NextResponse } from "next/server";

export function validateApiKey(request: Request): NextResponse | null {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token !== process.env.API_KEY) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return null;
}
