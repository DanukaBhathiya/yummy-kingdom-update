"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircleHeart, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "yk_home_review_prompt_dismissed_at";
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000;

const ReviewRedirectPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const lastDismissed = localStorage.getItem(STORAGE_KEY);
      if (lastDismissed) {
        const elapsed = Date.now() - Number(lastDismissed);
        if (!Number.isNaN(elapsed) && elapsed < DISMISS_TTL_MS) {
          return;
        }
      }
    } catch {
      // Ignore storage errors and still show popup.
    }

    const timer = setTimeout(() => setOpen(true), 1300);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore storage errors and simply close popup.
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-20 right-4 z-[80] w-[min(92vw,360px)] rounded-2xl border border-orange-200/70 bg-gradient-to-br from-white via-orange-50 to-amber-50 p-4 shadow-xl backdrop-blur"
        >
          <button
            type="button"
            aria-label="Dismiss review popup"
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 text-orange-700">
            <MessageCircleHeart className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              We value your feedback
            </span>
          </div>

          <h3 className="mt-2 text-lg font-bold leading-tight">
            Enjoying Yummy Kingdom?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Leave a quick review and help others discover us.
          </p>

          <div className="mt-3 flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href="/reviews">Rate Us</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ReviewRedirectPopup;
