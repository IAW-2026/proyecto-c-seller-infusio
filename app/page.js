import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const roles = user?.publicMetadata?.roles;
  const isAdmin = Array.isArray(roles)
    ? roles.includes("adminSeller") || roles.includes("admin")
    : roles === "adminSeller" || roles === "admin";

  redirect(isAdmin ? "/admin" : "/dashboard");
}
