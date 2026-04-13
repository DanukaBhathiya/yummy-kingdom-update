"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, MessageCircleHeart, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Rating from "@/components/shared/product/rating";
import { formatDateTime } from "@/lib/utils";
import {
  getShopRatingSummary,
  getShopReviews,
} from "@/lib/actions/shop-review.actions";
import type { ShopReviewWithUser } from "@/lib/actions/shop-review.actions";
import ShopReviewForm from "./shop-review-form";

const ShopReviewSection = ({ userId }: { userId?: string | null }) => {
  const pathname = usePathname();
  const [reviews, setReviews] = useState<ShopReviewWithUser[]>([]);
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const callbackUrl = pathname ? encodeURIComponent(pathname) : encodeURIComponent("/");

  const loadReviews = async () => {
    const [reviewRes, summaryRes] = await Promise.all([
      getShopReviews({ limit: 12 }),
      getShopRatingSummary(),
    ]);
    setReviews(reviewRes.data);
    setSummary(summaryRes);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <section className="space-y-5 rounded-2xl border p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircleHeart className="h-4 w-4" />
            Shop Reviews
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            What Customers Say About Us
          </h2>
        </div>
        <Badge variant="secondary" className="w-fit">
          {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Rating value={summary.averageRating} />
        <span className="text-sm text-muted-foreground">
          Average rating: {summary.averageRating.toFixed(2)} / 5
        </span>
      </div>

      {userId ? (
        <ShopReviewForm onReviewSubmitted={loadReviews} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Please
          <Link
            href={`/sign-in?callbackUrl=${callbackUrl}`}
            className="px-2 text-blue-700 hover:underline"
          >
            sign in
          </Link>
          to rate and review the shop.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {reviews.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-muted-foreground">
              No shop reviews yet. Be the first to review us.
            </CardContent>
          </Card>
        )}

        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle>{review.title}</CardTitle>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="inline-flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {review.userName || "User"}
                </div>
                <div className="inline-flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ShopReviewSection;
