"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LocateFixed,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME, SHOP_CITY, SHOP_GOOGLE_MAPS_URL } from "@/lib/constants";

type OrderMode = "deliver" | "collect" | "dinein";
type StartOrderVariant = "section" | "overlay";
type ReverseGeocodeResponse = {
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
  };
};

const modeUi = {
  deliver: {
    tabLabel: "Deliver",
    modeLabel: "DELIVER",
    label: "Delivery postcode",
    helper: "Enter your postcode to see local delivery deals",
    icon: Truck,
  },
  collect: {
    tabLabel: "Takeaway",
    modeLabel: "TAKEAWAY",
    label: `Pickup from ${APP_NAME} (${SHOP_CITY})`,
    helper: `Takeaway is available from our ${SHOP_CITY} store.`,
    icon: ShoppingBag,
  },
  dinein: {
    tabLabel: "Dine-in",
    modeLabel: "DINE-IN",
    label: "Find a restaurant",
    helper: "Pick your nearest dine-in location",
    icon: UtensilsCrossed,
  },
} as const;

const StartOrder = ({
  variant = "section",
}: {
  variant?: StartOrderVariant;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<OrderMode>("deliver");
  const [location, setLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const selectedMode = useMemo(() => modeUi[mode], [mode]);
  const ModeIcon = selectedMode.icon;
  const modeOptions =
    variant === "overlay"
      ? (["deliver", "collect"] as OrderMode[])
      : (["deliver", "collect", "dinein"] as OrderMode[]);
  const tabColumnsClass = modeOptions.length === 2 ? "grid-cols-2" : "grid-cols-3";

  const onStartOrder = () => {
    const trimmedLocation = location.trim();
    const params = new URLSearchParams();
    params.set("mode", mode);

    if (!trimmedLocation) {
      toast({
        title: mode === "deliver" ? "Postcode required" : "Location required",
        description:
          mode === "deliver"
            ? "Enter your delivery postcode to view local deals."
            : "Enter your location to view local deals.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "deliver") {
      params.set("postcode", trimmedLocation);
    } else {
      params.set("loc", trimmedLocation);
    }

    router.push(`/offers?${params.toString()}`);
  };

  const getMapUrl = (latitude?: number, longitude?: number) =>
    typeof latitude === "number" && typeof longitude === "number"
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : SHOP_GOOGLE_MAPS_URL;

  const updateMapTab = (
    mapTab: Window | null,
    latitude?: number,
    longitude?: number
  ) => {
    const mapUrl = getMapUrl(latitude, longitude);

    if (mapTab && !mapTab.closed) {
      mapTab.location.href = mapUrl;
      return;
    }

    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  const resolveAddress = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Address lookup failed");
    }

    const data = (await response.json()) as ReverseGeocodeResponse;
    const address = data.address;

    const street = [address?.house_number, address?.road].filter(Boolean).join(" ");
    const locality =
      address?.city ||
      address?.town ||
      address?.village ||
      address?.suburb ||
      address?.neighbourhood;
    const region = address?.state || address?.county;
    const postcode = address?.postcode;

    const resolvedAddress = [street, locality, region, postcode]
      .filter(Boolean)
      .join(", ")
      .trim();

    return resolvedAddress || data.display_name || "";
  };

  const onUseCurrentLocation = () => {
    const mapTab = window.open("about:blank", "_blank", "noopener,noreferrer");
    updateMapTab(mapTab);

    if (!("geolocation" in navigator)) {
      toast({
        title: "Location unavailable",
        description: "Your browser does not support geolocation. Map opened for manual selection.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        updateMapTab(mapTab, latitude, longitude);

        try {
          const resolvedAddress = await resolveAddress(latitude, longitude);
          if (resolvedAddress) {
            setLocation(resolvedAddress);
            toast({
              title: "Location detected",
              description: "We filled your current address and opened map selection.",
            });
          } else {
            const fallbackLocation = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            setLocation(fallbackLocation);
            toast({
              title: "Coordinates detected",
              description: "Address unavailable, so we used your coordinates. Map is open for manual adjustment.",
            });
          }
        } catch {
          const fallbackLocation = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setLocation(fallbackLocation);
          toast({
            title: "Coordinates detected",
            description: "Address unavailable, so we used your coordinates. Map is open for manual adjustment.",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        const errorMessage =
          error.code === error.PERMISSION_DENIED
            ? "Please allow location access in your browser settings."
            : error.code === error.TIMEOUT
            ? "Location request timed out. Please try again."
            : "Unable to detect your location right now.";

        toast({
          title: "Location access failed",
          description: `${errorMessage} Map opened for manual selection.`,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60_000,
      }
    );
  };

  const orderCard = (
    <div
      className={cn(
        "w-full overflow-hidden border bg-white",
        variant === "overlay"
          ? "max-w-2xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          : "mx-auto max-w-3xl border-zinc-200 shadow-[0_10px_25px_rgba(0,0,0,0.04)]"
      )}
    >
      <div
        className={cn(
          "grid border-b",
          variant === "overlay" ? "bg-muted/30" : "bg-[#f3f1ee]",
          tabColumnsClass
        )}
      >
        {modeOptions.map((value) => {
          const Icon = modeUi[value].icon;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "flex items-center justify-center gap-2 border-r px-3 py-4 text-sm font-semibold capitalize last:border-r-0",
                mode === value
                  ? "bg-white text-[#e31837]"
                  : "text-muted-foreground hover:bg-white/70",
                variant === "section" && "text-base md:text-lg"
              )}
            >
              <Icon className="h-4 w-4" />
              {modeUi[value].tabLabel}
            </button>
          );
        })}
      </div>

      <div className={cn(variant === "overlay" ? "p-4 md:p-6" : "p-4 md:p-5")}>
        <div
          className={cn(
            "gap-4",
            variant === "overlay"
              ? "space-y-3"
              : "grid md:grid-cols-[1fr_210px] md:items-start"
          )}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              <ModeIcon className="h-3.5 w-3.5" />
              {selectedMode.modeLabel}
            </div>
            <p className="text-sm text-foreground/85">{selectedMode.helper}</p>
            <Input
              aria-label={selectedMode.label}
              placeholder={selectedMode.label}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoComplete="street-address"
              className="h-12 rounded-none border-zinc-200"
            />
          </div>
          <Button
            className="h-12 rounded-none bg-[#e31837] text-base font-bold hover:bg-[#c7122f]"
            onClick={onStartOrder}
          >
            View Deals <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <button
          type="button"
          className="mt-3 text-sm font-semibold text-[#2f6af0] hover:underline inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-65"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
        >
          {isLocating ? "Detecting location..." : "Find my current location"}{" "}
          <LocateFixed className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  if (variant === "overlay") {
    return <div className="mx-auto w-full">{orderCard}</div>;
  }

  return (
    <section className="w-full bg-[#f7f4ef]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-10 md:py-14">
        <h2 className="text-center text-[#e31837] font-black tracking-tight text-4xl leading-none md:text-6xl lg:text-7xl">
          START YOUR ORDER
        </h2>

        <div className="mt-6">{orderCard}</div>
      </div>
    </section>
  );
};

export default StartOrder;
