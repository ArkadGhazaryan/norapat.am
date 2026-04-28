import { createId, db } from "@/lib/db";

export function getPromoCodes() {
  return db
    .prepare("SELECT * FROM promo_codes ORDER BY created_at DESC")
    .all()
    .map(mapPromo);
}

export function getPromoByCode(code) {
  if (!code) return null;
  const row = db
    .prepare("SELECT * FROM promo_codes WHERE UPPER(code) = UPPER(?) AND is_active = 1")
    .get(code.trim());
  return row ? mapPromo(row) : null;
}

export function calculatePromoDiscount(code, subtotal) {
  const promo = getPromoByCode(code);
  if (!promo) return { promo: null, discount: 0 };
  if (subtotal < promo.minOrderAmount) return { promo, discount: 0 };
  if (promo.maxUses && promo.usedCount >= promo.maxUses) return { promo, discount: 0 };

  const discount =
    promo.type === "percent"
      ? Math.round((subtotal * promo.value) / 100)
      : promo.value;

  return { promo, discount: Math.min(discount, subtotal) };
}

export function incrementPromoUse(code) {
  if (!code) return;
  db.prepare("UPDATE promo_codes SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP WHERE UPPER(code) = UPPER(?)").run(code);
}

export function upsertPromoCode(data) {
  const id = data.id || createId("promo");
  db.prepare(
    `INSERT INTO promo_codes (id, code, type, value, min_order_amount, is_active, max_uses)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(code) DO UPDATE SET
       type = excluded.type,
       value = excluded.value,
       min_order_amount = excluded.min_order_amount,
       is_active = excluded.is_active,
       max_uses = excluded.max_uses,
       updated_at = CURRENT_TIMESTAMP`
  ).run(
    id,
    data.code.trim().toUpperCase(),
    data.type,
    Number(data.value),
    Number(data.minOrderAmount || 0),
    data.isActive ? 1 : 0,
    data.maxUses ? Number(data.maxUses) : null
  );
  return getPromoByCode(data.code);
}

export function deletePromoCode(id) {
  db.prepare("DELETE FROM promo_codes WHERE id = ?").run(id);
}

function mapPromo(row) {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minOrderAmount: row.min_order_amount,
    isActive: Boolean(row.is_active),
    usedCount: row.used_count,
    maxUses: row.max_uses,
    createdAt: row.created_at,
  };
}
