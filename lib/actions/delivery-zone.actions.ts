"use server";

import { prisma } from "@/db/prisma";
import {
  DEFAULT_DELIVERY_FEE,
  DELIVERY_ZONES,
  FREE_DELIVERY_ORDER_THRESHOLD,
} from "@/lib/constants";
import {
  DeliveryZoneRule,
  getDefaultDeliveryZoneRules,
  getDeliveryZoneDetails,
} from "@/lib/delivery";
import { converToPlainObject, formatError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import z from "zod";

const FALLBACK_ETA_MIN = 75;
const FALLBACK_ETA_MAX = 90;

const deliveryZoneBaseSchema = z.object({
  name: z.string().min(2, "Zone name must be at least 2 characters"),
  cityKeywords: z
    .array(z.string().min(1))
    .min(1, "At least one city keyword is required"),
  deliveryFee: z.coerce.number().min(0, "Delivery fee cannot be negative"),
  minEtaMinutes: z.coerce
    .number()
    .int()
    .min(1, "Minimum ETA must be at least 1 minute"),
  maxEtaMinutes: z.coerce
    .number()
    .int()
    .min(1, "Maximum ETA must be at least 1 minute"),
  isActive: z.boolean().default(true),
});

const deliveryZoneSchema = deliveryZoneBaseSchema.refine(
  (data) => data.maxEtaMinutes >= data.minEtaMinutes,
  {
    message: "Maximum ETA must be greater than or equal to minimum ETA",
    path: ["maxEtaMinutes"],
  }
);

const updateDeliveryZoneSchema = deliveryZoneBaseSchema
  .extend({
    id: z.string().uuid("Invalid delivery zone id"),
  })
  .refine((data) => data.maxEtaMinutes >= data.minEtaMinutes, {
    message: "Maximum ETA must be greater than or equal to minimum ETA",
    path: ["maxEtaMinutes"],
  });

type DeliveryZoneRow = {
  id: string;
  name: string;
  cityKeywords: string[];
  deliveryFee: Prisma.Decimal;
  minEtaMinutes: number;
  maxEtaMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const normalizeKeyword = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const normalizeZoneInput = (data: z.infer<typeof deliveryZoneSchema>) => ({
  ...data,
  name: data.name.trim(),
  cityKeywords: Array.from(
    new Set(data.cityKeywords.map((keyword) => normalizeKeyword(keyword)).filter(Boolean))
  ),
});

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

async function ensureDeliveryZoneTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DeliveryZone" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL UNIQUE,
      "cityKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "deliveryFee" DECIMAL(12,2) NOT NULL,
      "minEtaMinutes" INTEGER NOT NULL,
      "maxEtaMinutes" INTEGER NOT NULL,
      "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "DeliveryZone"
    ALTER COLUMN "createdAt" SET DEFAULT NOW(),
    ALTER COLUMN "updatedAt" SET DEFAULT NOW()
  `);
}

async function seedDefaultDeliveryZonesIfEmpty() {
  const countRows = await prisma.$queryRaw<Array<{ total: number }>>`
    SELECT COUNT(*)::int AS total
    FROM "DeliveryZone"
  `;
  const existingCount = countRows[0]?.total ?? 0;
  if (existingCount > 0) return;

  const defaultRows = DELIVERY_ZONES.map((zone) => {
    const eta = parseEtaRange(zone.eta);
    return {
      name: zone.name,
      cityKeywords: zone.cities.map((city) => normalizeKeyword(city)),
      deliveryFee: zone.fee,
      minEtaMinutes: eta.minEtaMinutes,
      maxEtaMinutes: eta.maxEtaMinutes,
      isActive: true,
    };
  });

  if (defaultRows.length > 0) {
    for (const row of defaultRows) {
      await prisma.$executeRaw`
        INSERT INTO "DeliveryZone" (
          "name",
          "cityKeywords",
          "deliveryFee",
          "minEtaMinutes",
          "maxEtaMinutes",
          "isActive",
          "updatedAt"
        )
        VALUES (
          ${row.name},
          ${row.cityKeywords},
          ${row.deliveryFee},
          ${row.minEtaMinutes},
          ${row.maxEtaMinutes},
          ${row.isActive},
          NOW()
        )
      `;
    }
  }
}

const toRule = (zone: {
  name: string;
  cityKeywords: string[];
  deliveryFee: { toString(): string } | number;
  minEtaMinutes: number;
  maxEtaMinutes: number;
}): DeliveryZoneRule => ({
  name: zone.name,
  cities: zone.cityKeywords,
  fee: Number(zone.deliveryFee),
  minEtaMinutes: zone.minEtaMinutes,
  maxEtaMinutes: zone.maxEtaMinutes,
});

export async function getAllDeliveryZonesForAdmin() {
  await ensureDeliveryZoneTable();
  await seedDefaultDeliveryZonesIfEmpty();

  const zones = await prisma.$queryRaw<DeliveryZoneRow[]>`
    SELECT
      "id",
      "name",
      "cityKeywords",
      "deliveryFee",
      "minEtaMinutes",
      "maxEtaMinutes",
      "isActive",
      "createdAt",
      "updatedAt"
    FROM "DeliveryZone"
    ORDER BY "isActive" DESC, "deliveryFee" ASC, "name" ASC
  `;

  return converToPlainObject(
    zones.map((zone) => ({
      ...zone,
      deliveryFee: Number(zone.deliveryFee),
    }))
  );
}

export async function getActiveDeliveryZoneRules() {
  await ensureDeliveryZoneTable();
  await seedDefaultDeliveryZonesIfEmpty();

  const zones = await prisma.$queryRaw<DeliveryZoneRow[]>`
    SELECT
      "id",
      "name",
      "cityKeywords",
      "deliveryFee",
      "minEtaMinutes",
      "maxEtaMinutes",
      "isActive",
      "createdAt",
      "updatedAt"
    FROM "DeliveryZone"
    WHERE "isActive" = TRUE
    ORDER BY "deliveryFee" ASC, "name" ASC
  `;

  if (!zones.length) {
    return getDefaultDeliveryZoneRules();
  }

  return zones.map((zone) => toRule(zone));
}

export async function getDeliveryGuideForCheckout() {
  const zones = await getActiveDeliveryZoneRules();

  return {
    zones: zones.map((zone) => ({
      ...zone,
      eta: `${zone.minEtaMinutes}-${zone.maxEtaMinutes} mins`,
    })),
    defaultFee: DEFAULT_DELIVERY_FEE,
    freeDeliveryThreshold: FREE_DELIVERY_ORDER_THRESHOLD,
  };
}

export async function getDeliveryZoneDetailsByCity(city?: string) {
  const zones = await getActiveDeliveryZoneRules();
  return getDeliveryZoneDetails(city, zones);
}

export async function createDeliveryZone(
  data: z.infer<typeof deliveryZoneSchema>
) {
  try {
    await ensureDeliveryZoneTable();
    await seedDefaultDeliveryZonesIfEmpty();

    const parsed = deliveryZoneSchema.parse(normalizeZoneInput(data));

    await prisma.$executeRaw`
      INSERT INTO "DeliveryZone" (
        "name",
        "cityKeywords",
        "deliveryFee",
        "minEtaMinutes",
        "maxEtaMinutes",
        "isActive",
        "updatedAt"
      )
      VALUES (
        ${parsed.name},
        ${parsed.cityKeywords},
        ${parsed.deliveryFee},
        ${parsed.minEtaMinutes},
        ${parsed.maxEtaMinutes},
        ${parsed.isActive},
        NOW()
      )
    `;

    revalidatePath("/shipping-address");
    revalidatePath("/place-order");
    revalidatePath("/admin/delivery-zones");

    return {
      success: true,
      message: "Delivery zone created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateDeliveryZone(
  data: z.infer<typeof updateDeliveryZoneSchema>
) {
  try {
    await ensureDeliveryZoneTable();
    await seedDefaultDeliveryZonesIfEmpty();

    const parsed = updateDeliveryZoneSchema.parse({
      ...normalizeZoneInput(data),
      id: data.id,
    });

    await prisma.$executeRaw`
      UPDATE "DeliveryZone"
      SET
        "name" = ${parsed.name},
        "cityKeywords" = ${parsed.cityKeywords},
        "deliveryFee" = ${parsed.deliveryFee},
        "minEtaMinutes" = ${parsed.minEtaMinutes},
        "maxEtaMinutes" = ${parsed.maxEtaMinutes},
        "isActive" = ${parsed.isActive},
        "updatedAt" = NOW()
      WHERE "id" = ${parsed.id}::uuid
    `;

    revalidatePath("/shipping-address");
    revalidatePath("/place-order");
    revalidatePath("/admin/delivery-zones");

    return {
      success: true,
      message: "Delivery zone updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteDeliveryZone(id: string) {
  try {
    await ensureDeliveryZoneTable();
    await seedDefaultDeliveryZonesIfEmpty();

    const parsedId = z.string().uuid("Invalid delivery zone id").parse(id);

    await prisma.$executeRaw`
      DELETE FROM "DeliveryZone"
      WHERE "id" = ${parsedId}::uuid
    `;

    revalidatePath("/shipping-address");
    revalidatePath("/place-order");
    revalidatePath("/admin/delivery-zones");

    return {
      success: true,
      message: "Delivery zone deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
