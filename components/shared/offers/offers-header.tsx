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
    <section className={cn("bg-[#ed1c24] text-white", className)}>
      <div className="px-3 py-5 md:px-10 lg:px-12 xl:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-sm bg-white/10 p-1">
              <Image
                src={APP_LOGO}
                alt={`${APP_NAME} logo`}
                width={44}
                height={44}
                className="h-auto w-auto object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2 rounded-sm bg-[#d3161d] px-5 py-3 text-xl font-black">
              <Truck className="h-5 w-5" />
              <span className="flex items-center gap-2">
                <span>{deliveryLabel}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{displayPostcode}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-sm bg-[#d3161d] px-5 py-3 text-xl font-black">
              <Clock3 className="h-5 w-5" />
              <span>{deliveryEta}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xl font-bold">
            <div className="flex items-center gap-2">
              <span>{rewardsLabel}</span>
              <Gift className="h-6 w-6" />
            </div>
            <CircleUserRound className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="inline-flex min-w-full bg-white text-[#1a1717] shadow-[0_20px_35px_rgba(0,0,0,0.12)]">
            {dealTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={cn(
                  "whitespace-nowrap border-l border-[#e7e0db] bg-white px-6 py-5 text-[22px] font-semibold text-[#1a1717] first:border-l-0",
                  tab === selectedTab && "bg-[#ed1c24] text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersHeader;
