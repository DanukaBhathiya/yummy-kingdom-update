"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="mb-12 w-full overflow-hidden rounded-2xl"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-0">
        {data.map((product) => (
          <CarouselItem key={product.id} className="pl-0">
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto overflow-hidden">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  height={0}
                  width={0}
                  sizes="100vw"
                  className="w-full h-auto transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-end justify-center pb-12">
                <h2 className="inline-flex items-center gap-2 rounded-full bg-black/55 px-5 py-2 text-lg md:text-2xl font-bold text-white backdrop-blur-md">
                  <Flame className="h-5 w-5 text-orange-400" />
                  {product.name}
                </h2>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default ProductCarousel;
