import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getRole(): Promise<string | undefined> {
  const user = await currentUser();
  return user?.publicMetadata?.role as string | undefined;
}

export async function requireAdmin() {
  const role = await getRole();
  if (role !== "admin") redirect("/dashboard");
}

export async function checkAdminApi(): Promise<boolean> {
  const role = await getRole();
  return role === "admin";
}
