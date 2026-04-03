import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import Search from "./search";
import { Pizza, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="wrapper flex items-center gap-3">
        <div className="flex items-center ml-3 shrink-0">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4 gap-2">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME}logo`}
              height={52}
              width={52}
              priority={true}
              className="animate-float-slow rounded-lg"
            />
            <div className="hidden lg:block">
              <span className="font-bold text-xl ml-1 inline-flex items-center gap-2 whitespace-nowrap">
                <Pizza className="h-5 w-5 text-orange-500" />
                <span className="text-gradient-pizza">{APP_NAME}</span>
              </span>
              {/* <p className="text-xs text-muted-foreground inline-flex items-center gap-1 whitespace-nowrap">
                Fresh slices daily <Sparkles className="h-3 w-3" />
              </p> */}
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 min-w-0 items-center justify-end gap-2 xl:justify-center xl:gap-3">
          <div className="hidden xl:block">
            <Search />
          </div>
          <Menu />
        </div>

        <div className="md:hidden ml-auto">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
