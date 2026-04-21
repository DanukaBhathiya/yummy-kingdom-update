"use client";

import { motion, type Variants } from "framer-motion";
import ProductCarousel from "@/components/shared/product/product-carousel";

type HeroSlide = {
  src: string;
  heading: string;
  footnote?: string;
  href?: string;
};

const containerVariants: Variants = {
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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HomePromoBannerClient = ({
  slides,
}: {
  slides: HeroSlide[];
}) => {
  return (
    <motion.section
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="relative overflow-hidden border-b border-black/5 bg-[#f7f4ef]">
        <motion.div variants={itemVariants}>
          <ProductCarousel
            variant="hero"
            slides={slides}
            fullBleed={false}
            className="w-full"
            autoplayDelay={3500}
            showControls={false}
            hideHeroText
            heroHeightClass="h-[220px] sm:h-[280px] md:h-[360px] lg:h-[430px]"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HomePromoBannerClient;
