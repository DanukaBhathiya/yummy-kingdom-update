import { APP_LOGO, APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="wrapper flex flex-wrap items-center gap-3 py-2 md:gap-4">
          <Link href="/" className="flex-start shrink-0 gap-4" aria-label={APP_NAME}>
            <Image
              src={APP_LOGO}
              height={56}
              width={140}
              alt={APP_NAME}
              className="h-20 w-auto animate-float-slow rounded-lg"
              priority
            />
          </Link>

          <MainNav className="order-3 w-full md:order-none md:w-auto" />

          <div className="ml-auto">
            <Menu />
          </div>
        </div>
      </header>

      <main className="wrapper flex-1 animate-rise">
        <div className="py-4 md:py-6">{children}</div>
      </main>
    </div>
  );
}
