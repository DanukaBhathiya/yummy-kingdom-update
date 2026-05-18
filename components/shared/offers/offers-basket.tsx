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
    <aside className={cn("h-full bg-[#f8f7f6]", className)}>
      <div className="top-4 space-y-4 xl:sticky">
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 px-5 py-5">
            <h2 className="text-3xl font-black leading-none tracking-tight text-[#1a1717]">
              {title}
            </h2>
          </div>

          <div className="border-b border-black/10 bg-[#f5f5f5] p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2 rounded-lg border border-[#d9d9d9] bg-white p-1">
              <button
                type="button"
                className="flex min-w-0 items-center gap-2 rounded-md bg-[#fff2f3] px-3 py-2 text-left"
              >
                <Truck className="h-4 w-4 text-[#ed1c24]" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1a1717]">{deliveryLabel}</div>
                  <div className="truncate text-xs text-[#5a5a5a]">{displayPostcode}</div>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left"
              >
                <ShoppingBag className="h-4 w-4 text-[#3d3d3d]" />
                <div>
                  <div className="text-sm font-bold text-[#1a1717]">{collectLabel}</div>
                  <div className="text-xs text-[#5a5a5a]">{collectMeta}</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4 px-5 py-5">
            {!cart || cart.items.length === 0 ? (
              <p className="rounded-lg bg-[#f8f8f8] p-4 text-sm leading-relaxed text-[#6b6b6b]">
                {emptyMessage}
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-start justify-between gap-3 border-b border-[#ececec] pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-base font-semibold leading-snug text-[#1a1717] break-words">
                          {item.name}
                        </p>
                        <p className="text-sm text-[#5a5a5a]">Qty {item.qty}</p>
                      </div>
                      <div className="shrink-0 text-sm font-bold text-[#1a1717]">
                        {formatCurreny(Number(item.price) * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 rounded-lg bg-[#f7f7f7] p-4">
                  <div className="flex items-center justify-between text-sm text-[#5a5a5a]">
                    <span>Items</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-[#1a1717]">
                    <span>Subtotal</span>
                    <span>{formatCurreny(cart.itemsPrice)}</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="h-11 w-full bg-[#ed1c24] text-sm font-bold hover:bg-[#d3161d]"
                >
                  <Link href={cartHref}>{cartButtonLabel}</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {showVoucherField && (
          <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-[#1a1717]">Voucher Code</label>
            <div className="flex overflow-hidden rounded-lg border border-[#d7d7d7] bg-white">
              <Input
                placeholder={voucherPlaceholder}
                className="h-11 rounded-none border-0 px-3 text-sm focus-visible:ring-0"
              />
              <Button className="h-11 rounded-none bg-[#ed1c24] px-5 text-sm font-bold hover:bg-[#d3161d]">
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
