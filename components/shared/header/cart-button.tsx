import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";

const CartButton = async () => {
  const cart = await getMyCart();
  const itemCount = cart?.items.reduce((total, item) => total + item.qty, 0) ?? 0;

  return (
    <Button asChild variant="ghost" size="sm" className="relative h-9 px-3">
      <Link href="/cart" className="inline-flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        <span>Cart</span>
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#e31837] px-1.5 py-0.5 text-xs font-bold text-white">
          {itemCount}
        </span>
      </Link>
    </Button>
  );
};

export default CartButton;
