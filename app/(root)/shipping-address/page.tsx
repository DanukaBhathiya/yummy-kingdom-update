import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/user.actions";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { getDeliveryGuideForCheckout } from "@/lib/actions/delivery-zone.actions";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);
  const deliveryGuide = await getDeliveryGuideForCheckout();

  return (
    <>
    <CheckoutSteps current={1}/>
      <ShippingAddressForm
        address={user.address as ShippingAddress}
        deliveryZones={deliveryGuide.zones}
        defaultDeliveryFee={deliveryGuide.defaultFee}
      />
    </>
  );
};

export default ShippingAddressPage;
