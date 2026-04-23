import { headers } from "next/headers";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isOffersRoute = pathname === "/offers";

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isOffersRoute && (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl animate-float-slow" />
          <div className="absolute top-20 right-10 h-56 w-56 rounded-full bg-red-300/20 blur-3xl animate-float-slow" />
          <div className="absolute bottom-8 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl animate-float-slow" />
        </div>
      )}

      {!isOffersRoute && <Header />}

      <main className={isOffersRoute ? "flex-1 animate-rise" : "flex-1 wrapper animate-rise"}>
        {children}
      </main>

      {!isOffersRoute && <Footer />}
    </div>
  );
}
