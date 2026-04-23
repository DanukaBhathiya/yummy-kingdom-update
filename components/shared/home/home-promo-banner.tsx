import { getActivePromotions } from "@/lib/actions/promotion.actions";
import HomePromoBannerClient from "./home-promo-banner-client";

const fallbackSlides = [
  {
    src: "/images/banner1.png",
    heading: "AN EASTER TREAT\nWORTH SHARING.",
    footnote: "T&C'S APPLY.",
    href: "/offers",
  },
  {
    src: "/images/banner2.png",
    heading: "HOT DEALS\nALL WEEKEND.",
    footnote: "LIMITED TIME.",
    href: "/offers",
  },
] as { src: string; heading: string; footnote?: string; href?: string }[];

const HomePromoBanner = async () => {
  const promotions = await getActivePromotions({ placement: "HOME", limit: 8 });

  const promoSlides = promotions
    .filter((item) => item.imageUrl)
    .map((item) => ({
      src: item.imageUrl as string,
      heading: item.title.toUpperCase(),
      footnote: item.subtitle || undefined,
      href: item.ctaUrl || "/offers",
    }));

  const slides = promoSlides.length > 0 ? promoSlides : fallbackSlides;

  return <HomePromoBannerClient slides={slides} />;
};

export default HomePromoBanner;
