"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdmin } from "@/lib/auth";
import { deleteCategory, deleteProduct, upsertCategory, upsertProduct } from "@/lib/products";
import { deletePromoCode, upsertPromoCode } from "@/lib/promos";
import { updateOrderStatus } from "@/lib/orders";

function checkbox(formData, name) {
  return formData.get(name) === "on";
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveProduct(formData) {
  await requireAdmin();
  let imageUrl = formData.get("imageUrl");
  const imageFile = formData.get("imageFile");
  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const extension = path.extname(imageFile.name || "upload.jpg") || ".jpg";
    const filename = `product-${Date.now()}${extension}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }
  upsertProduct({
    id: formData.get("id") || undefined,
    categoryId: formData.get("categoryId"),
    slug: formData.get("slug"),
    name: formData.get("name"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice"),
    imageUrl,
    stockQuantity: formData.get("stockQuantity"),
    isAvailable: checkbox(formData, "isAvailable"),
    isFeatured: checkbox(formData, "isFeatured"),
    isPopular: checkbox(formData, "isPopular"),
  });
  redirect("/admin");
}

export async function removeProduct(formData) {
  await requireAdmin();
  deleteProduct(formData.get("id"));
  redirect("/admin");
}

export async function saveCategory(formData) {
  await requireAdmin();
  upsertCategory({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
    isActive: checkbox(formData, "isActive"),
  });
  redirect("/admin");
}

export async function removeCategory(formData) {
  await requireAdmin();
  deleteCategory(formData.get("id"));
  redirect("/admin");
}

export async function savePromo(formData) {
  await requireAdmin();
  upsertPromoCode({
    id: formData.get("id") || undefined,
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    minOrderAmount: formData.get("minOrderAmount"),
    maxUses: formData.get("maxUses"),
    isActive: checkbox(formData, "isActive"),
  });
  redirect("/admin");
}

export async function removePromo(formData) {
  await requireAdmin();
  deletePromoCode(formData.get("id"));
  redirect("/admin");
}

export async function changeOrderStatus(formData) {
  await requireAdmin();
  updateOrderStatus(formData.get("id"), formData.get("status"));
  redirect("/admin");
}
