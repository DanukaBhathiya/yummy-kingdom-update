"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ProductCarousel from "@/components/shared/product/product-carousel";
import StartOrder from "./start-order";

type HeroSlide = {
  src: string;
  heading: string;
  footnote?: string;
  href?: string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HomePromoBannerClient = ({
  featuredTitle,
  featuredSubtitle,
  featuredDescription,
  ctaHref,
  ctaLabel,
  slides,
}: {
  featuredTitle: string;
  featuredSubtitle?: string;
  featuredDescription?: string;
  ctaHref: string;
  ctaLabel: string;
  slides: HeroSlide[];
}) => {
  return (
    <motion.section
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <motion.div variants={itemVariants} className="absolute inset-0">
          <ProductCarousel
            variant="hero"
            slides={slides}
            fullBleed={false}
            className="h-full"
            autoplayDelay={3500}
            showControls={false}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-black/65" />

        <div className="absolute inset-x-0 top-0 z-20">
          <div className="wrapper pt-7">
            <div className="max-w-xl text-white">
              <h2 className="whitespace-pre-line text-3xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
                {featuredTitle}
              </h2>
              {featuredSubtitle && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 md:text-sm">
                  {featuredSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-4"
        >
          <div className="mx-auto w-full max-w-2xl">
            <StartOrder variant="overlay" />
          </div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-6 z-20 hidden md:block">
          <div className="wrapper flex items-end justify-between gap-4 text-white">
            {featuredDescription && (
              <p className="max-w-xl text-sm text-white/85">{featuredDescription}</p>
            )}
            <Link
              href={ctaHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              {ctaLabel}
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HomePromoBannerClient;
