import { Egg, EggFried } from "lucide-react";
import ProductCarousel from "@/components/shared/product/product-carousel";

const heroSlides = [
  {
    src: "/images/banner1.png",
    heading: "AN EASTER TREAT\nWORTH SHARING.",
    footnote: "T&C'S APPLY.",
  },
  {
    src: "/images/banner2.png",
    heading: "HOT DEALS\nALL WEEKEND.",
    footnote: "LIMITED TIME.",
  },
] as { src: string; heading: string; footnote?: string }[];

const HomePromoBanner = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 overflow-hidden rounded-none md:grid-cols-[440px_minmax(0,1fr)] lg:grid-cols-[520px_minmax(0,1fr)]">
        <div className="bg-[#e31837] text-white px-8 py-10 md:px-12 md:py-14 relative">
          <div className="flex items-start gap-6">
            <div className="mt-1 hidden sm:block">
              <Egg className="h-16 w-16" />
            </div>
            <div>
              <div className="font-extrabold uppercase tracking-tight text-4xl leading-[0.95]">
                <div>Easter</div>
                <div>Weekend</div>
              </div>
              <div className="mt-6 flex items-end gap-3">
                <div className="text-[92px] leading-[0.85] font-black tracking-tight">
                  50
                </div>
                <div className="pb-2">
                  <div className="text-4xl leading-none font-black">% </div>
                  <div className="text-4xl leading-none font-black">OFF</div>
                </div>
              </div>
              <div className="mt-3 text-6xl leading-[0.9] font-black uppercase tracking-tight">
                Pizzas
              </div>
              <div className="mt-2 text-2xl font-extrabold uppercase tracking-wide">
                Thu - Mon
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="rounded-full bg-white/10 p-4">
              <EggFried className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <ProductCarousel
          variant="hero"
          slides={heroSlides}
          fullBleed={false}
          className="h-full"
          autoplayDelay={3500}
        />
      </div>
    </section>
  );
};

export default HomePromoBanner;
