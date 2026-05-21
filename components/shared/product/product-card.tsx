import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";
import { Flame, Leaf, Pizza, Sparkles } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  const isVeggie = product.category.toLowerCase().includes("veggie");

  return (
    <Card className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative h-52 w-full overflow-hidden bg-[#f8f7f4]">
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {product.category}
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          {product.brand}
        </div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="min-h-[44px] text-base font-semibold leading-snug text-[#1a1717] line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2">
            <Rating value={Number(product.rating)} />
            {Number(product.rating) >= 4.5 && (
              <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                <Flame className="mr-0.5 h-3.5 w-3.5" /> Hot
              </span>
            )}
            {isVeggie && (
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                <Leaf className="mr-0.5 h-3.5 w-3.5" /> Veg
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-black/5 pt-3">
          <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Pizza className="h-3.5 w-3.5 text-orange-500" /> Freshly baked on order
          </p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="text-[2rem] leading-none" />
          ) : (
            <p className="text-sm font-semibold text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
