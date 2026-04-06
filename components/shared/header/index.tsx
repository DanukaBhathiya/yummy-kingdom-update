import Image from "next/image";
import Link from "next/link";
import { Pizza } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import CategoryDrawer from "./category-drawer";
import Menu from "./menu";
// import Search from "./search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="wrapper flex items-center gap-3">
        <div className="flex shrink-0 items-center">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4 gap-4">
          <Image
            src="/images/yklogo.png"
            alt={`${APP_NAME} logo`}
            height={42}
            width={82}
            priority
            className="animate-float-slow rounded-lg"
          />
           
          </Link>
        </div>

        <div className="hidden flex-1 min-w-0 items-center justify-end gap-2 md:flex xl:gap-3">
          <div className="hidden xl:block">
            {/* <Search /> */}
          </div>
          <Menu />
        </div>

        <div className="ml-auto md:hidden">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
