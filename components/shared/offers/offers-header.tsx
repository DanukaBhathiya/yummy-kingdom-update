import Image from "next/image";
import { CircleUserRound, Clock3, Gift, Truck } from "lucide-react";
import { APP_LOGO, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type OffersHeaderProps = {
  displayPostcode: string;
  dealTabs: string[];
  activeTab?: string;
  deliveryLabel?: string;
  deliveryEta?: string;
  rewardsLabel?: string;
  className?: string;
};

const OffersHeader = ({
  displayPostcode,
  dealTabs,
  activeTab,
  deliveryLabel = "Deliver",
  deliveryEta = "12:30 - 12:45",
  rewardsLabel = "Rewards",
  className,
}: OffersHeaderProps) => {
  const selectedTab = activeTab ?? dealTabs[0] ?? "Deals";

  return (
    <section className={cn("space-y-4", className)}>
      <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-[#ed1c24] via-[#e81824] to-[#ca1118] px-4 py-5 text-white shadow-[0_16px_34px_rgba(237,28,36,0.28)] md:px-6 md:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-14 items-center justify-center rounded-md bg-white/15 p-1.5">
                <Image
                  src={APP_LOGO}
                  alt={`${APP_NAME} logo`}
                  width={42}
                  height={42}
                  className="h-auto w-auto object-contain"
                  priority
                />
              </div>
              <p className="text-sm font-medium text-white/90">You are ordering for</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <Truck className="h-4 w-4" />
                <span>{deliveryLabel}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                <Clock3 className="h-4 w-4" />
                <span>{deliveryEta}</span>
              </div>
            </div>

            <p className="max-w-3xl text-base font-semibold leading-snug md:text-lg">{displayPostcode}</p>
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 transition hover:bg-white/20"
            >
              <span>{rewardsLabel}</span>
              <Gift className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/20"
              aria-label="Open account"
            >
              <CircleUserRound className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white p-1 shadow-sm">
        <div className="inline-flex min-w-full items-center gap-1">
          {dealTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "min-w-[120px] rounded-lg px-4 py-2.5 text-sm font-semibold text-[#3b302f] transition",
                tab === selectedTab
                  ? "bg-[#ed1c24] text-white shadow-[0_8px_18px_rgba(237,28,36,0.3)]"
                  : "hover:bg-red-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersHeader;
