"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { shippingAddressDefultValues } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock3, Loader2, MapPin, ShieldCheck, Truck } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { formatCurreny } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type DeliveryZoneGuideItem = {
  name: string;
  fee: number;
  eta: string;
};

const ShippingAddressForm = ({
  address,
  deliveryZones,
  defaultDeliveryFee,
}: {
  address: ShippingAddress;
  deliveryZones: DeliveryZoneGuideItem[];
  defaultDeliveryFee: number;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }

      router.push("/payment-method");
    });
  };

  const totalZones = deliveryZones.length;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-sm md:p-7">
        <h1 className="text-3xl font-black tracking-tight text-[#231f20] md:text-4xl">
          Shipping Address
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Enter your delivery details. We calculate delivery fees dynamically based on your city
          area.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-24">
          <Card className="rounded-2xl border-white/70 bg-white/85 shadow-[0_20px_45px_rgba(0,0,0,0.06)]">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#ed1c24]" />
                <p className="text-sm font-semibold uppercase tracking-wide text-[#231f20]">
                  Delivery Zones
                </p>
              </div>

              <div className="space-y-3">
                {deliveryZones.map((zone) => (
                  <div key={zone.name} className="rounded-lg border border-black/10 bg-white p-3">
                    <p className="text-sm font-semibold text-[#231f20]">{zone.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurreny(zone.fee)}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {zone.eta}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-[#4c4341]">
                  Outside listed zones: {formatCurreny(defaultDeliveryFee)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/70 bg-white/85 shadow-[0_20px_45px_rgba(0,0,0,0.06)]">
            <CardContent className="space-y-2 p-5">
              <p className="text-sm font-semibold text-[#231f20]">Quick Summary</p>
              <p className="text-sm text-muted-foreground">Active delivery zones: {totalZones}</p>
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[#ed1c24]" />
                Address details are stored securely.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-white/70 bg-white/85 shadow-[0_20px_45px_rgba(0,0,0,0.06)]">
          <CardContent className="p-5 md:p-7">
            <Form {...form}>
              <form
                method="post"
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        z.infer<typeof shippingAddressSchema>,
                        "fullName"
                      >;
                    }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            {...field}
                            className="h-11 rounded-xl border-black/15 bg-white/80"
                          />
                        </FormControl>
                        <FormDescription>Use the name used by the receiver.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        z.infer<typeof shippingAddressSchema>,
                        "city"
                      >;
                    }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-semibold">City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city"
                            {...field}
                            className="h-11 rounded-xl border-black/15 bg-white/80"
                          />
                        </FormControl>
                        <FormDescription>Used to match your delivery zone.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof shippingAddressSchema>,
                      "streetAddress"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm font-semibold">Street Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="House number, street, area"
                          {...field}
                          className="h-11 rounded-xl border-black/15 bg-white/80"
                        />
                      </FormControl>
                      <FormDescription>
                        Include landmark details to help faster delivery.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        z.infer<typeof shippingAddressSchema>,
                        "postalCode"
                      >;
                    }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-semibold">Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter postal code"
                            {...field}
                            className="h-11 rounded-xl border-black/15 bg-white/80"
                          />
                        </FormControl>
                        <FormDescription>Used for delivery confirmation.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        z.infer<typeof shippingAddressSchema>,
                        "country"
                      >;
                    }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm font-semibold">Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter country"
                            {...field}
                            className="h-11 rounded-xl border-black/15 bg-white/80"
                          />
                        </FormControl>
                        <FormDescription>Country for final delivery details.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 text-[#ed1c24]" />
                    We use this address for delivery and order updates.
                  </p>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 rounded-full bg-[#ed1c24] px-6 font-semibold hover:bg-[#d3161d]"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ShippingAddressForm;
