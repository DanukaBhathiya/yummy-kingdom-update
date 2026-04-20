"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LocateFixed,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  ArrowRight,
  Tag,
  Pizza,
  Sandwich,
  GlassWater,
  CakeSlice,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  APP_NAME,
  SHOP_CITY,
  SHOP_GOOGLE_MAPS_URL,
  SHOP_MAP_EMBED_URL,
} from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    label: "Delivery address or postcode",
    helper: "Find your nearest Hut and local delivery deals",
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

const quickLinks = [
  { label: "Deals", href: "/offers", icon: Tag },
  { label: "Pizza", href: "/search?q=pizza", icon: Pizza },
  { label: "Sides", href: "/search?category=Sides", icon: Sandwich },
  { label: "Drinks", href: "/search?category=Beverages", icon: GlassWater },
  { label: "Desserts", href: "/search?category=Desserts", icon: CakeSlice },
] as const;

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
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapEmbedUrl, setMapEmbedUrl] = useState(SHOP_MAP_EMBED_URL);
  const [mapExternalUrl, setMapExternalUrl] = useState(SHOP_GOOGLE_MAPS_URL);

  const selectedMode = useMemo(() => modeUi[mode], [mode]);
  const ModeIcon = selectedMode.icon;
  const modeOptions =
    variant === "overlay"
      ? (["deliver", "collect"] as OrderMode[])
      : (["deliver", "collect", "dinein"] as OrderMode[]);
  const tabColumnsClass = modeOptions.length === 2 ? "grid-cols-2" : "grid-cols-3";

  const onStartOrder = () => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (location.trim()) {
      params.set("loc", location.trim());
    }
    router.push(`/search?${params.toString()}`);
  };

  const getMapUrl = (latitude?: number, longitude?: number) =>
    typeof latitude === "number" && typeof longitude === "number"
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : SHOP_GOOGLE_MAPS_URL;

  const getMapEmbedUrl = (latitude?: number, longitude?: number) =>
    typeof latitude === "number" && typeof longitude === "number"
      ? `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`
      : SHOP_MAP_EMBED_URL;

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
    setIsMapDialogOpen(true);
    setMapEmbedUrl(getMapEmbedUrl());
    setMapExternalUrl(getMapUrl());

    if (!("geolocation" in navigator)) {
      toast({
        title: "Location unavailable",
        description: "Your browser does not support geolocation. Use the map dialog to choose manually.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapEmbedUrl(getMapEmbedUrl(latitude, longitude));
        setMapExternalUrl(getMapUrl(latitude, longitude));

        try {
          const resolvedAddress = await resolveAddress(latitude, longitude);
          if (resolvedAddress) {
            setLocation(resolvedAddress);
            toast({
              title: "Location detected",
              description: "We filled your current address and centered the map.",
            });
          } else {
            const fallbackLocation = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            setLocation(fallbackLocation);
            toast({
              title: "Coordinates detected",
              description: "Address unavailable, so we used your coordinates. You can still adjust on map.",
            });
          }
        } catch {
          const fallbackLocation = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setLocation(fallbackLocation);
          toast({
            title: "Coordinates detected",
            description: "Address unavailable, so we used your coordinates. You can still adjust on map.",
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
          description: `${errorMessage} You can choose location manually in the map dialog.`,
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
        "w-full overflow-hidden rounded-xl border bg-white",
        variant === "overlay"
          ? "max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          : "max-w-5xl shadow-sm"
      )}
    >
      <div className={cn("grid border-b bg-muted/30", tabColumnsClass)}>
        {modeOptions.map((value) => {
          const Icon = modeUi[value].icon;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold capitalize border-r last:border-r-0",
                mode === value
                  ? "bg-white text-[#e31837]"
                  : "text-muted-foreground hover:bg-white/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {modeUi[value].tabLabel}
            </button>
          );
        })}
      </div>

      <div className="p-4 md:p-6">
        <div
          className={cn(
            "gap-4",
            variant === "overlay"
              ? "space-y-3"
              : "grid md:grid-cols-[1fr_180px] md:items-start"
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
              className="h-12"
            />
          </div>
          <Button
            className="h-12 bg-[#e31837] hover:bg-[#c7122f]"
            onClick={onStartOrder}
          >
            Order Now <ArrowRight className="h-4 w-4" />
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

  const mapDialog = (
    <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Pan and zoom map, then copy your address into the field if needed.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-3">
          <iframe
            title="Location map"
            src={mapEmbedUrl}
            className="h-[60vh] w-full rounded-md border"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="flex justify-end">
            <Button asChild variant="outline">
              <a href={mapExternalUrl} target="_blank" rel="noreferrer">
                Open Full Google Maps
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (variant === "overlay") {
    return (
      <div className="mx-auto w-full">
        {orderCard}
        {mapDialog}
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-[#f5f5f5] to-[#f0ece8]">
      <div className="py-8 md:py-10">
        <h2 className="text-center text-[#e31837] font-black tracking-tight text-3xl md:text-5xl">
          START YOUR ORDER
        </h2>

        <div className="mx-auto mt-6 w-full max-w-5xl">{orderCard}</div>
        {mapDialog}

        <div className="mx-auto mt-4 w-full max-w-5xl rounded-xl border bg-white p-3 md:p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Order Now
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <Button key={item.label} asChild variant="ghost" className="rounded-full">
                <Link href={item.href} className="inline-flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartOrder;
