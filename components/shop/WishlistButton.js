import { toggleCustomerWishlist } from "@/app/account/actions";

export function WishlistButton({ productId, redirectTo }) {
  return (
    <form action={toggleCustomerWishlist}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button className="secondary-button" type="submit">В избранное</button>
    </form>
  );
}
