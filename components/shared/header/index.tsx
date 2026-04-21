import Image from "next/image";
import Link from "next/link";
import { APP_LOGO, APP_NAME } from "@/lib/constants";
import Menu from "./menu";
// import Search from "./search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="wrapper flex items-center gap-2 py-2 md:py-2">
        <div className="flex shrink-0 items-center">
          <Link href="/" className="flex-start gap-4">
            <Image
              src={APP_LOGO}
              alt={`${APP_NAME} logo`}
              height={34}
              width={66}
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
      </div>
    </header>
  );
};

export default Header;
