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

  const featured = promotions.find((item) => item.type === "OFFER") ?? promotions[0];
  const promoSlides = promotions
    .filter((item) => item.imageUrl)
    .map((item) => ({
      src: item.imageUrl as string,
      heading: item.title.toUpperCase(),
      footnote: item.subtitle || undefined,
      href: item.ctaUrl || "/offers",
    }));

  const slides = promoSlides.length > 0 ? promoSlides : fallbackSlides;
  const ctaHref = featured?.ctaUrl || "/offers";
  const ctaLabel = featured?.ctaLabel || "View All Offers";
  const featuredTitle = featured?.title || "Fresh Deals Every Week";
  const featuredDescription = featured?.description || undefined;

  return (
    <HomePromoBannerClient
      featuredTitle={featuredTitle}
      featuredSubtitle={featured?.subtitle || undefined}
      featuredDescription={featuredDescription}
      ctaHref={ctaHref}
      ctaLabel={ctaLabel}
      slides={slides}
    />
  );
};

export default HomePromoBanner;
