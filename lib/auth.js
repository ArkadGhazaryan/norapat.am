import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "norapat_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === getAdminPassword();
}

export async function requireAdmin() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, getAdminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function assertAdminApi() {
  if (!(await isAdminSession())) {
    return false;
  }
  return true;
}
