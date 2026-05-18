import {
  DEFAULT_DELIVERY_FEE,
  DELIVERY_ZONES,
  FREE_DELIVERY_ORDER_THRESHOLD,
  TAX_RATE,
} from "./constants";

export type DeliveryZoneRule = {
  name: string;
  cities: string[];
  fee: number;
  minEtaMinutes: number;
  maxEtaMinutes: number;
};

const FALLBACK_ETA_MIN = 75;
const FALLBACK_ETA_MAX = 90;

const parseEtaRange = (eta?: string) => {
  const matched = eta?.match(/(\d+)\s*-\s*(\d+)/);
  if (!matched) {
    return {
      minEtaMinutes: FALLBACK_ETA_MIN,
      maxEtaMinutes: FALLBACK_ETA_MAX,
    };
  }

  return {
    minEtaMinutes: Number(matched[1]),
    maxEtaMinutes: Number(matched[2]),
  };
};

export const getDefaultDeliveryZoneRules = (): DeliveryZoneRule[] =>
  DELIVERY_ZONES.map((zone) => {
    const etaRange = parseEtaRange(zone.eta);

    return {
      name: zone.name,
      cities: [...zone.cities],
      fee: zone.fee,
      minEtaMinutes: etaRange.minEtaMinutes,
      maxEtaMinutes: etaRange.maxEtaMinutes,
    };
  });

export const normalizeCity = (city?: string) =>
  city?.trim().toLowerCase().replace(/\s+/g, " ");

const getEtaLabel = (minEtaMinutes: number, maxEtaMinutes: number) =>
  `${minEtaMinutes}-${maxEtaMinutes} mins`;

export function getDeliveryFeeByCity(
  city?: string,
  zones: DeliveryZoneRule[] = getDefaultDeliveryZoneRules()
) {
  const normalized = normalizeCity(city);
  if (!normalized) return DEFAULT_DELIVERY_FEE;

  const matchedZone = zones.find((zone) =>
    zone.cities.some((cityKey) => normalized.includes(cityKey))
  );

  return matchedZone?.fee ?? DEFAULT_DELIVERY_FEE;
}

export function getDeliveryZoneDetails(
  city?: string,
  zones: DeliveryZoneRule[] = getDefaultDeliveryZoneRules()
) {
  const normalized = normalizeCity(city);
  if (!normalized) {
    return {
      zone: "Outside Standard Zones",
      fee: DEFAULT_DELIVERY_FEE,
      eta: getEtaLabel(FALLBACK_ETA_MIN, FALLBACK_ETA_MAX),
    };
  }

  const matchedZone = zones.find((zone) =>
    zone.cities.some((cityKey) => normalized.includes(cityKey))
  );

  if (!matchedZone) {
    return {
      zone: "Outside Standard Zones",
      fee: DEFAULT_DELIVERY_FEE,
      eta: getEtaLabel(FALLBACK_ETA_MIN, FALLBACK_ETA_MAX),
    };
  }

  return {
    zone: matchedZone.name,
    fee: matchedZone.fee,
    eta: getEtaLabel(matchedZone.minEtaMinutes, matchedZone.maxEtaMinutes),
  };
}

export function getCartPricing(
  itemsPrice: number,
  city?: string,
  zones: DeliveryZoneRule[] = getDefaultDeliveryZoneRules()
) {
  const normalizedItemsPrice = Math.max(itemsPrice, 0);
  const calculatedDelivery = getDeliveryFeeByCity(city, zones);
  const shippingPrice =
    normalizedItemsPrice >= FREE_DELIVERY_ORDER_THRESHOLD
      ? 0
      : calculatedDelivery;
  const taxPrice = Number((normalizedItemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = Number(
    (normalizedItemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return {
    itemsPrice: normalizedItemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
