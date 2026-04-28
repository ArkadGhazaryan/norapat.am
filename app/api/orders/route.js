import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/orders";

export async function GET() {
  return NextResponse.json({ orders: getOrders() });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.deliveryAddress) {
      return NextResponse.json(
        { error: "Name, phone and delivery address are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const order = createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      deliveryAddress: body.deliveryAddress,
      paymentMethod: body.paymentMethod || "cash",
      promoCode: body.promoCode,
      items: body.items,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Order creation failed" },
      { status: 500 }
    );
  }
}
