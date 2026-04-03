import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProduct,
} from "@/lib/actions/product.actions";
import {
  SHOP_ADDRESS,
  SHOP_CONTACT,
  SHOP_TAGLINE,
  SHOP_WHATSAPP,
} from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bike, Clock3, Flame, Pizza, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Homepage = async () => {
  const latestProducts = await getLatestProduct();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <section className="py-8 md:py-10">
        <div className="rounded-3xl border p-5 md:p-10 bg-grid-warm bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 fancy-glass">
          <Badge variant="secondary" className="animate-glow-pulse">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Yummy Kingdom - Ja-Ela
          </Badge>
          <h1 className="h1-bold mt-4 leading-tight">
            <span className="text-gradient-pizza">Hot Pizza, Bold Flavor</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl text-base md:text-lg">
            {SHOP_TAGLINE}
          </p>
          <p className="mt-4 text-sm inline-flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" /> {SHOP_ADDRESS}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`tel:+94${SHOP_CONTACT.replace(/\s+/g, "").slice(1)}`}>
                <Clock3 className="mr-1 h-4 w-4" /> Call {SHOP_CONTACT}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href={`https://wa.me/94${SHOP_WHATSAPP.replace(/\s+/g, "").slice(1)}`}
                target="_blank"
              >
                <Bike className="mr-1 h-4 w-4" /> Order via WhatsApp
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/search">
                <Pizza className="mr-1 h-4 w-4" /> Explore Menu
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-orange-200 bg-white/80 animate-rise">
              <CardContent className="p-4">
                <p className="text-sm font-semibold inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-orange-600" /> Fast Kitchen
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Freshly baked and dispatched with speed.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-white/80 animate-rise">
              <CardContent className="p-4">
                <p className="text-sm font-semibold inline-flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500" /> Flavor Burst
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Signature sauces and rich cheese in every bite.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-white/80 animate-rise sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4">
                <p className="text-sm font-semibold inline-flex items-center gap-2">
                  <Bike className="h-4 w-4 text-amber-600" /> Quick Delivery
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Local Ja-Ela delivery with live-ready order flow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title="Popular Pizza Picks" />
      <ViewAllProductButton />
    </>
  );
};

export default Homepage;
