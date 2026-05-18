import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#fdfaf7]">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-6">
          <OffersHeader displayPostcode={displayPostcode} dealTabs={dealTabs} />

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-black/10 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="h-10 border-[#ed1c24] px-4 text-sm font-bold text-[#ed1c24] hover:bg-red-50 hover:text-[#ed1c24]"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <div className="text-base font-semibold text-[#1a1717]">
                Showing {promotions.length} item{promotions.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Adults need around 2000 kcal a day</p>
          </div>

          {leadPromotion?.imageUrl && (
            <Link
              href={leadPromotion.ctaUrl || "/offers"}
              className="group block overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={leadPromotion.imageUrl}
                alt={leadPromotion.title}
                className="h-[170px] w-full object-cover transition duration-300 group-hover:scale-[1.02] md:h-[220px]"
              />
            </Link>
          )}

          {promotions.length === 0 ? (
            <Card className="rounded-xl border-black/10 shadow-sm">
              <CardContent className="space-y-3 py-8 text-center">
                <p className="text-lg font-semibold text-[#1a1717]">No active offers right now</p>
                <p className="text-sm text-muted-foreground">Please check back soon.</p>
                <Button asChild className="bg-[#ed1c24] hover:bg-[#d3161d]">
                  <Link href="/search">Explore Menu</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {(gridPromotions.length ? gridPromotions : promotions).map((promotion) => (
                <Card
                  key={promotion.id}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
                    <CardTitle className="text-xl font-black leading-tight text-[#1a1717]">
                      {promotion.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
                    {promotion.subtitle && <p className="font-medium">{promotion.subtitle}</p>}
                    {promotion.description && <p>{promotion.description}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="h-10 w-full bg-[#ed1c24] text-sm font-bold hover:bg-[#d3161d]"
                    >
                      <Link
                        href={promotion.ctaUrl || "/search"}
                        className="flex items-center justify-center gap-2"
                      >
                        {promotion.ctaLabel || "Grab this offer"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        <OffersBasket cart={cart} displayPostcode={displayPostcode} className="xl:pt-1" />
      </div>
    </div>
  );
};

export default OffersPage;
