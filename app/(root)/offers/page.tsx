import Link from "next/link";
import { Metadata } from "next";
import { OffersBasket, OffersHeader } from "@/components/shared/offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getActivePromotions } from "@/lib/actions/promotion.actions";
import { SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Offers",
};

const OffersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    postcode?: string;
    loc?: string;
  }>;
}) => {
  const { postcode = "", loc = "" } = await searchParams;
  const promotions = await getActivePromotions({
    placement: "OFFERS",
    limit: 100,
  });
  const cart = await getMyCart();

  const displayPostcode = postcode.trim() || loc.trim() || "Your area";
  const leadPromotion = promotions[0];
  const gridPromotions = promotions.slice(1);
  const dealTabs = ["Deals"];

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_200px]">
        <div className="min-w-0 border-r border-black/10 bg-[#f7f7f7]">
          <section className="px-6 py-8 md:px-10 lg:px-12 xl:px-16">
            <div className="mx-auto max-w-6xl space-y-5">
              <OffersHeader displayPostcode={displayPostcode} dealTabs={dealTabs} className="mb-6" />

              <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-8 py-7 shadow-[0_18px_35px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="outline"
                    className="h-12 rounded-none border-[#ed1c24] px-6 text-xl font-bold text-[#ed1c24] hover:bg-red-50 hover:text-[#ed1c24]"
                  >
                    <SlidersHorizontal className="mr-2 h-5 w-5" />
                    Filters
                  </Button>
                  <div className="text-[20px] font-bold text-[#1a1717]">
                    Showing {promotions.length} items
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">
                  Adults need around 2000 kcal a day
                </p>
              </div>

              {leadPromotion?.imageUrl && (
                <Link
                  href={leadPromotion.ctaUrl || "/offers"}
                  className="block overflow-hidden border border-black/5 bg-white shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={leadPromotion.imageUrl}
                    alt={leadPromotion.title}
                    className="h-[120px] w-full object-cover md:h-[180px]"
                  />
                </Link>
              )}

              {promotions.length === 0 ? (
                <Card className="rounded-none shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
                  <CardContent className="pt-6 text-lg text-muted-foreground">
                    No active offers right now. Please check back soon.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {(gridPromotions.length ? gridPromotions : promotions).map((promotion) => (
                    <Card
                      key={promotion.id}
                      className="flex h-full flex-col overflow-hidden rounded-none border border-black/10 bg-white shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
                    >
                      {promotion.imageUrl && (
                        <div className="aspect-[16/9] w-full bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={promotion.imageUrl}
                            alt={promotion.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="space-y-3 pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={promotion.type === "OFFER" ? "default" : "secondary"}>
                            {promotion.type}
                          </Badge>
                          <Badge variant="outline">{promotion.placement}</Badge>
                        </div>
                        <CardTitle className="text-[22px] font-black leading-tight">
                          {promotion.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-2 text-base text-muted-foreground">
                        {promotion.subtitle && <p className="font-medium">{promotion.subtitle}</p>}
                        {promotion.description && <p>{promotion.description}</p>}
                      </CardContent>
                      <CardFooter>
                        <Button
                          asChild
                          className="h-12 w-full rounded-none bg-[#ed1c24] text-base font-bold hover:bg-[#d3161d]"
                        >
                          <Link href={promotion.ctaUrl || "/search"}>
                            {promotion.ctaLabel || "Grab this offer"}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <OffersBasket cart={cart} displayPostcode={displayPostcode} />
      </div>
    </div>
  );
};

export default OffersPage;
