"use server";

import { redirect } from "next/navigation";
import {
  clearCustomerSession,
  createUser,
  getCurrentUser,
  loginUser,
  saveAddress,
  setCustomerSession,
  toggleWishlist,
  updateUser,
} from "@/lib/users";

export async function registerCustomer(formData) {
  const user = createUser({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  await setCustomerSession(user.id);
  redirect("/account");
}

export async function loginCustomer(formData) {
  const user = loginUser({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!user) redirect("/account?error=login");
  await setCustomerSession(user.id);
  redirect("/account");
}

export async function logoutCustomer() {
  await clearCustomerSession();
  redirect("/account");
}

export async function saveCustomerProfile(formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  updateUser(user.id, {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });
  redirect("/account");
}

export async function addCustomerAddress(formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  saveAddress(user.id, {
    label: formData.get("label"),
    address: formData.get("address"),
    isDefault: formData.get("isDefault") === "on",
  });
  redirect("/account");
}

export async function toggleCustomerWishlist(formData) {
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  toggleWishlist(user.id, formData.get("productId"));
  redirect(formData.get("redirectTo") || "/account");
}
