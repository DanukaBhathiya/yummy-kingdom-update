"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

const links = [
  {
    title: "Profile",
    href: "/user/profile",
  },

  {
    title: "Orders",
    href: "/user/orders",
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center gap-2 md:gap-3", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            pathname.includes(item.href)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
