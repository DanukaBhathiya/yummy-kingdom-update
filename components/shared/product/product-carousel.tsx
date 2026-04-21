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
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

type HeroSlide = {
  src: string;
  heading: string;
  footnote?: string;
  href?: string;
};

type ProductCarouselProps =
  | {
      variant?: "product";
      data: Product[];
      className?: string;
      fullBleed?: boolean;
      autoplayDelay?: number;
      showControls?: boolean;
    }
  | {
      variant: "hero";
      slides: HeroSlide[];
      className?: string;
      fullBleed?: boolean;
      autoplayDelay?: number;
      showControls?: boolean;
      hideHeroText?: boolean;
      heroHeightClass?: string;
    };

const ProductCarousel = (props: ProductCarouselProps) => {
  const isHero = props.variant === "hero";
  const autoplayDelay = props.autoplayDelay ?? (isHero ? 3500 : 2000);
  const fullBleed = props.fullBleed ?? !isHero;
  const showControls = props.showControls ?? true;
  const heroHeightClass =
    isHero && props.heroHeightClass
      ? props.heroHeightClass
      : "min-h-[calc(100vh-72px)]";
  const hideHeroText = isHero ? props.hideHeroText ?? false : false;

  return (
    <Carousel
      className={cn(
        !isHero
          ? fullBleed
            ? "mb-12 w-screen max-w-none ml-[calc(50%-50vw)]"
            : "mb-12 w-full overflow-hidden rounded-2xl"
          : "h-full w-full",
        props.className
      )}
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-0">
        {props.variant === "hero"
          ? props.slides.map((slide, index) => (
              <CarouselItem key={slide.src} className="pl-0">
                {slide.href ? (
                  <Link href={slide.href}>
                    <motion.div
                      className={cn("relative", heroHeightClass)}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                      <Image
                        src={slide.src}
                        alt="Hero banner"
                        fill
                        priority={index === 0}
                        className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 70vw"
                      />
                      {!hideHeroText && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                          <motion.div
                            className="absolute bottom-8 left-8 right-8"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                          >
                            <div className="max-w-xl whitespace-pre-line text-white uppercase font-black tracking-tight leading-[0.95] text-4xl md:text-5xl">
                              {slide.heading}
                            </div>
                            {slide.footnote && (
                              <div className="mt-3 text-white/80 text-xs font-semibold uppercase tracking-widest">
                                {slide.footnote}
                              </div>
                            )}
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    className={cn("relative", heroHeightClass)}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <Image
                      src={slide.src}
                      alt="Hero banner"
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 70vw"
                    />
                    {!hideHeroText && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        <motion.div
                          className="absolute bottom-8 left-8 right-8"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                        >
                          <div className="max-w-xl whitespace-pre-line text-white uppercase font-black tracking-tight leading-[0.95] text-4xl md:text-5xl">
                            {slide.heading}
                          </div>
                          {slide.footnote && (
                            <div className="mt-3 text-white/80 text-xs font-semibold uppercase tracking-widest">
                              {slide.footnote}
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </CarouselItem>
            ))
          : props.data.map((product) => (
              <CarouselItem key={product.id} className="pl-0">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative mx-auto overflow-hidden">
                    <Image
                      src={product.banner!}
                      alt={product.name}
                      height={0}
                      width={0}
                      sizes="100vw"
                      className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                      <h2 className="inline-flex items-center gap-2 rounded-full bg-black/55 px-5 py-2 text-lg font-bold text-white backdrop-blur-md md:text-2xl">
                        <Flame className="h-5 w-5 text-orange-400" />
                        {product.name}
                      </h2>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
      </CarouselContent>
      {showControls && (
        <>
          <CarouselPrevious className="left-4 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
          <CarouselNext className="right-4 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
        </>
      )}
    </Carousel>
  );
};

export default ProductCarousel;
