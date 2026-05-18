import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-guard";
import DeliveryZoneManager from "@/components/admin/delivery-zone-manager";
import { DEFAULT_DELIVERY_FEE } from "@/lib/constants";
import { getAllDeliveryZonesForAdmin } from "@/lib/actions/delivery-zone.actions";

export const metadata: Metadata = {
  title: "Delivery Zones",
};

const AdminDeliveryZonesPage = async () => {
  await requireAdmin();
  const zones = await getAllDeliveryZonesForAdmin();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Delivery Zones</h1>
      <p className="text-muted-foreground">
        Configure city-based delivery charges and ETA ranges used at checkout.
      </p>
      <DeliveryZoneManager
        initialZones={zones}
        defaultDeliveryFee={DEFAULT_DELIVERY_FEE}
      />
    </div>
  );
};

export default AdminDeliveryZonesPage;
