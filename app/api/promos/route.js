import { NextResponse } from "next/server";
import { calculatePromoDiscount } from "@/lib/promos";

export async function POST(request) {
  const body = await request.json();
  const subtotal = Number(body.subtotal || 0);
  const code = body.code;
  const { promo, discount } = calculatePromoDiscount(code, subtotal);

  if (!promo) {
    return NextResponse.json({ error: "Promo code not found", discount: 0 }, { status: 404 });
  }

  if (discount <= 0) {
    return NextResponse.json(
      { error: "Promo code cannot be applied to this order", promo, discount: 0 },
      { status: 400 }
    );
  }

  return NextResponse.json({ promo, discount });
}
