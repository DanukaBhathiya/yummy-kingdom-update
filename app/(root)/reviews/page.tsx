import { Metadata } from "next";
import { auth } from "@/auth";
import ShopReviewSection from "@/components/shared/shop-review/shop-review-section";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Customer Reviews",
};

const ReviewsPage = async () => {
  const session = await auth();

  return (
    <section className="py-10 md:py-14 space-y-8">
      <div className="rounded-3xl border bg-gradient-to-br from-orange-50/80 via-background to-background p-6 md:p-10">
        <Badge variant="secondary" className="px-3 py-1">
          {APP_NAME} Reviews
        </Badge>
        <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
          Rate your full experience with us
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Share feedback about food quality, delivery speed, and overall service.
          Your review helps us improve and helps other customers decide.
        </p>
      </div>

      <ShopReviewSection userId={session?.user?.id} />
    </section>
  );
};

export default ReviewsPage;
