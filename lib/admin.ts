import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function isAdminSeller(): Promise<boolean> {
  const user = await currentUser();
  const roles = user?.publicMetadata?.roles;
  if (Array.isArray(roles)) return roles.includes("adminSeller") || roles.includes("admin");
  if (typeof roles === "string") return roles === "adminSeller" || roles === "admin";
  return false;
}

export async function requireAdmin() {
  if (!(await isAdminSeller())) redirect("/dashboard");
}

export async function checkAdminApi(): Promise<boolean> {
  return isAdminSeller();
}
