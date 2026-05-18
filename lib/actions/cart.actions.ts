"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { converToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getCartPricing } from "../delivery";
import { getActiveDeliveryZoneRules } from "./delivery-zone.actions";

//Calculate cart price
const calcPrice = async (items: CartItem[], deliveryCity?: string) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const deliveryZones = await getActiveDeliveryZoneRules();
  const priceDetails = getCartPricing(itemsPrice, deliveryCity, deliveryZones);
  const shippingPrice = round2(priceDetails.shippingPrice);
  const taxPrice = round2(priceDetails.taxPrice);
  const totalPrice = round2(priceDetails.totalPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

const getDeliveryCityByUserId = async (userId?: string) => {
  if (!userId) return undefined;

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { address: true },
  });

  const address =
    user?.address && typeof user.address === "object"
      ? (user.address as { city?: string })
      : null;

  return address?.city;
};

export async function addItemToCart(data: CartItem) {
  try {
    //Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get cart
    const cart = await getMyCart();
    const deliveryCity = await getDeliveryCityByUserId(userId);

    //Parse and validate item
    const item = cartItemSchema.parse(data);

    //Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      //Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...(await calcPrice([item], deliveryCity)),
      });

      //Add to database
      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: "Item added to cart",
      };
    } else {
      //check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        //Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough stock");
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        //If item does not exist in cart
        //Check stock
        if (product.stock < 1) throw new Error("Not enough stock");

        //Add item to the cart.items
        cart.items.push(item);
      }

      //Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...(await calcPrice(cart.items as CartItem[], deliveryCity)),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  //Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;
  const items = cart.items as CartItem[];
  const deliveryCity = await getDeliveryCityByUserId(userId);
  const latestPrices = await calcPrice(items, deliveryCity);

  const hasPriceChanged =
    cart.itemsPrice.toString() !== latestPrices.itemsPrice ||
    cart.shippingPrice.toString() !== latestPrices.shippingPrice ||
    cart.taxPrice.toString() !== latestPrices.taxPrice ||
    cart.totalPrice.toString() !== latestPrices.totalPrice;

  if (hasPriceChanged) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        itemsPrice: latestPrices.itemsPrice,
        shippingPrice: latestPrices.shippingPrice,
        taxPrice: latestPrices.taxPrice,
        totalPrice: latestPrices.totalPrice,
      },
    });
  }

  // Convert decimals and return
  return converToPlainObject({
    ...cart,
    items,
    itemsPrice: latestPrices.itemsPrice,
    totalPrice: latestPrices.totalPrice,
    shippingPrice: latestPrices.shippingPrice,
    taxPrice: latestPrices.taxPrice,
  });
}

//Remove Item from cart
export async function removeItemFromCart(productId: string) {
  try {
    //Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    //Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    //Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");
    const deliveryCity = await getDeliveryCityByUserId(
      cart.userId ? String(cart.userId) : undefined
    );

    //Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    //Check if only one in qty
    if (exist.qty === 1) {
      //Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      //Decrease the qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    //Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...(await calcPrice(cart.items as CartItem[], deliveryCity)),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function recalculateCartForUser(userId: string, city?: string) {
  const cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) return;

  const items = cart.items as unknown as CartItem[];

  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      ...(await calcPrice(items, city)),
    },
  });
}
