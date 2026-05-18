"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurreny } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const itemCount = cart?.items.reduce((a, c) => a + c.qty, 0) ?? 0;

  const onRemove = (productId: string) => {
    setActiveItemId(productId);
    startTransition(async () => {
      const res = await removeItemFromCart(productId);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }

      setActiveItemId(null);
    });
  };

  const onAdd = (item: Cart["items"][number]) => {
    setActiveItemId(item.productId);
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }

      setActiveItemId(null);
    });
  };

  return (
    <section className="space-y-6 py-4">
      <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-7">
        <h1 className="text-3xl font-black tracking-tight text-[#231f20] md:text-5xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Review your items and continue to secure checkout.
        </p>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card className="rounded-2xl border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <div className="rounded-full bg-red-50 p-4 text-[#ed1c24]">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#231f20]">Your cart is empty</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Add your favorite pizzas and sides to get started.
            </p>
            <Button asChild className="h-11 rounded-full bg-[#ed1c24] px-6 font-semibold hover:bg-[#d3161d]">
              <Link href="/">Go Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
          <Card className="rounded-2xl border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4 md:p-6">
              <div className="mb-4 hidden grid-cols-[minmax(0,1fr)_220px_140px] items-center border-b border-black/10 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                <span>Item</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => {
                  const isItemPending = isPending && activeItemId === item.productId;

                  return (
                    <div
                      key={item.slug}
                      className="grid gap-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px_140px] md:items-center"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex min-w-0 items-center gap-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-[#231f20]">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Unit {formatCurreny(item.price)}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between md:justify-center">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:hidden">
                          Quantity
                        </span>
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#fff8f4] p-1">
                          <Button
                            disabled={isPending}
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onRemove(item.productId)}
                          >
                            {isItemPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="min-w-6 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <Button
                            disabled={isPending}
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onAdd(item)}
                          >
                            {isItemPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:block md:text-right">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:hidden">
                          Price
                        </span>
                        <span className="text-base font-semibold text-[#231f20]">
                          {formatCurreny(item.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/70 bg-white/85 shadow-[0_20px_50px_rgba(0,0,0,0.08)] xl:sticky xl:top-24">
            <CardContent className="space-y-5 p-5 md:p-6">
              <div className="space-y-2 border-b border-black/10 pb-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Order Summary
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-base font-medium text-[#4c4341]">
                    Subtotal ({itemCount})
                  </p>
                  <p className="text-3xl font-black tracking-tight text-[#231f20]">
                    {formatCurreny(cart.itemsPrice)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-red-100 bg-red-50/70 p-3 text-sm text-[#4c4341]">
                Delivery fee and tax are calculated in the next step.
              </div>

              <Button
                className="h-12 w-full rounded-full bg-[#ed1c24] text-base font-bold hover:bg-[#d3161d]"
                disabled={isPending}
                onClick={() => startTransition(() => router.push("/shipping-address"))}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Proceed to Checkout
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[#ed1c24]" />
                Secure checkout and protected payment.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default CartTable;
