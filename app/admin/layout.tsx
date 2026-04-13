import { APP_LOGO, APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainNav from "./main-nav";
import AdminSearch from "@/components/admin/admin-search";
import { getPendingOrdersCount } from "@/lib/actions/order.actions";
import ModeToggle from "@/components/shared/header/mode-toggle";
import UserButton from "@/components/shared/header/user-button";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pendingOrdersCount = await getPendingOrdersCount();

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="wrapper">
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 items-center">
              <Link href="/admin/overview" className="flex-start ml-4 gap-4">
              <Image
                src={APP_LOGO}
                height={42}
                width={82}
                alt={APP_NAME}
                className="animate-float-slow rounded-lg"
              />
              <div className="hidden sm:block leading-tight">
                <p className="text-xs text-muted-foreground">Admin Console</p>
                <p className="text-sm font-semibold inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {APP_NAME}
                </p>
              </div>
              </Link>
            </div>

            <MainNav
              className="hidden xl:flex flex-1 min-w-0 mx-4"
              pendingOrdersCount={pendingOrdersCount}
            />

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden lg:block">
                <AdminSearch />
              </div>
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link href="/">View Storefront</Link>
              </Button>
              <ModeToggle />
              <UserButton />
            </div>
          </div>
          <div className="xl:hidden">
            <MainNav pendingOrdersCount={pendingOrdersCount} />
          </div>
        </div>
      </header>
      <div className="flex-1 container mx-auto px-4 py-6">{children}</div>
      <div className="h-8" />
    </div>
  );
}
