import Link from "next/link";
import { ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatCurreny } from "@/lib/utils";
import { Cart } from "@/types";

type OffersBasketProps = {
  cart?: Cart | null;
  displayPostcode: string;
  title?: string;
  deliveryLabel?: string;
  collectLabel?: string;
  collectMeta?: string;
  emptyMessage?: string;
  voucherPlaceholder?: string;
  addVoucherLabel?: string;
  cartHref?: string;
  cartButtonLabel?: string;
  showVoucherField?: boolean;
  className?: string;
};

const OffersBasket = ({
  cart,
  displayPostcode,
  title = "Your Basket",
  deliveryLabel = "Deliver",
  collectLabel = "Collect",
  collectMeta = "FREE",
  emptyMessage = "Your basket is empty at this moment. Why not add something delicious from our menu?",
  voucherPlaceholder = "Add Voucher Code",
  addVoucherLabel = "Add",
  cartHref = "/cart",
  cartButtonLabel = "Go to Cart",
  showVoucherField = true,
  className,
}: OffersBasketProps) => {
  const itemCount = cart?.items.reduce((total, item) => total + item.qty, 0) ?? 0;

  return (
    <aside className={cn("flex min-h-screen flex-col bg-[#f2f2f2]", className)}>
      <div className="border-b border-black/10 bg-white px-6 py-10">
        <h2 className="text-[34px] font-black leading-none tracking-tight text-[#1a1717]">
          {title}
        </h2>
      </div>

      <div className="border-b border-black/10 bg-[#ececec] p-6">
        <div className="grid grid-cols-2 gap-0 border border-[#d7d7d7] bg-[#e7e7e7]">
          <div className="border-r border-[#d7d7d7] bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-[#ed1c24]" />
              <div>
                <div className="text-[18px] font-black text-[#1a1717]">{deliveryLabel}</div>
                <div className="text-[16px] text-[#5a5a5a]">{displayPostcode}</div>
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-[#3d3d3d]" />
              <div>
                <div className="text-[18px] font-black text-[#1a1717]">{collectLabel}</div>
                <div className="text-[16px] text-[#5a5a5a]">{collectMeta}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-6 border-b border-black/10 bg-white px-6 py-8">
          {!cart || cart.items.length === 0 ? (
            <p className="text-[24px] font-medium leading-[1.35] text-[#6b6b6b]">{emptyMessage}</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start justify-between gap-3 border-b border-[#ececec] pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-[18px] font-black text-[#1a1717]">{item.name}</p>
                      <p className="text-[16px] text-[#5a5a5a]">Qty {item.qty}</p>
                    </div>
                    <div className="shrink-0 text-[18px] font-black text-[#1a1717]">
                      {formatCurreny(Number(item.price) * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 bg-[#f4f4f4] p-5">
                <div className="flex items-center justify-between text-[18px] text-[#5a5a5a]">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex items-center justify-between text-[20px] font-black text-[#1a1717]">
                  <span>Subtotal</span>
                  <span>{formatCurreny(cart.itemsPrice)}</span>
                </div>
              </div>

              <Button
                asChild
                className="h-14 w-full rounded-none bg-[#ed1c24] text-[18px] font-black hover:bg-[#d3161d]"
              >
                <Link href={cartHref}>{cartButtonLabel}</Link>
              </Button>
            </>
          )}
        </div>

        {showVoucherField && (
          <div className="bg-[#ececec] p-6">
            <div className="flex overflow-hidden border border-[#d7d7d7] bg-white">
              <Input
                placeholder={voucherPlaceholder}
                className="h-[72px] rounded-none border-0 px-5 text-[18px] focus-visible:ring-0"
              />
              <Button className="h-[72px] rounded-none bg-[#ed1c24] px-8 text-[18px] font-black hover:bg-[#d3161d]">
                {addVoucherLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default OffersBasket;
