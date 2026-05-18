import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function isAdminSeller(): Promise<boolean> {
  const user = await currentUser();
  const roles = user?.publicMetadata?.roles as string[] | undefined;
  return Array.isArray(roles) && roles.includes("adminSeller");
}

export async function requireAdmin() {
  // TODO: restaurar chequeo cuando Clerk tenga el rol asignado
  // if (!(await isAdminSeller())) redirect("/dashboard");
}

export async function checkAdminApi(): Promise<boolean> {
  return isAdminSeller();
}
