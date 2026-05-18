import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_CLERK_USER_ID) {
    redirect("/dashboard");
  }
  return userId!;
}

export async function checkAdminApi(): Promise<string | null> {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_CLERK_USER_ID) return null;
  return userId;
}
