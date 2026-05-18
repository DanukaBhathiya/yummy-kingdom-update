"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },

  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Categories",
    href: "/admin/categories",
  },
  {
    title: "Promotions",
    href: "/admin/promotions",
  },
  {
    title: "Delivery Zones",
    href: "/admin/delivery-zones",
  },

  {
    title: "Orders",
    href: "/admin/orders",
  },

  {
    title: "Employees",
    href: "/admin/users",
  },
];

const MainNav = ({
  pendingOrdersCount = 0,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { pendingOrdersCount?: number }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex w-full items-center gap-1 overflow-x-auto rounded-xl border bg-muted/40 p-1",
        className
      )}
      {...props}
    >
      {links.map((item) => (
        // Keep tabs compact and horizontally scrollable for smaller screens.
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname.includes(item.href)
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
          )}
        >
          <span className="inline-flex items-center gap-2">
            {item.title}
            {item.href === "/admin/orders" && pendingOrdersCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-[10px]">
                {pendingOrdersCount}
              </Badge>
            )}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
