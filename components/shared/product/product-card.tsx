import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";
import { Flame, Leaf, Pizza, Sparkles } from "lucide-react";

const getCategoryEmoji = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes("veggie")) return "🥗";
  if (value.includes("chicken")) return "🍗";
  if (value.includes("pasta")) return "🍝";
  if (value.includes("dessert")) return "🍰";
  if (value.includes("beverage")) return "🥤";
  return "🍕";
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-orange-100 bg-white/90">
      <CardHeader className="p-0 ">
        <Link href={`/product/${product.slug}`} className="block group">
          <div className="relative h-56 w-full flex items-center justify-center overflow-hidden rounded-t-xl bg-white">
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-xs text-white backdrop-blur-sm">
              {getCategoryEmoji(product.category)} {product.category}
            </div>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          {product.brand}
        </div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium leading-snug min-h-[40px] line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="inline-flex items-center gap-2">
            <Rating value={Number(product.rating)} />
            {Number(product.rating) >= 4.5 && (
              <span className="inline-flex items-center text-xs text-orange-600">
                <Flame className="h-3.5 w-3.5 mr-0.5" /> Hot
              </span>
            )}
            {product.category.toLowerCase().includes("veggie") && (
              <span className="inline-flex items-center text-xs text-green-600">
                <Leaf className="h-3.5 w-3.5 mr-0.5" /> Veg
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1">
          <Pizza className="h-3.5 w-3.5 text-orange-500" /> Freshly baked on order
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
