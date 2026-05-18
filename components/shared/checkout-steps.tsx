import React from "react";
import { cn } from "@/lib/utils";

const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

const CheckoutSteps = ({ current = 0 }: { current?: number }) => {
  return (
    <div className="mb-8 rounded-2xl border border-white/60 bg-white/65 px-3 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm md:px-4">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const isActive = index === current;
          const isCompleted = index < current;
          return (
            <div
              key={step}
              className={cn(
                "rounded-xl border px-3 py-3 text-center transition",
                isActive
                  ? "border-[#ed1c24]/25 bg-red-50 text-[#231f20] shadow-sm"
                  : isCompleted
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-black/10 bg-white/80 text-muted-foreground"
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold md:text-base">{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
