import Image from "next/image";
import Link from "next/link";
import { APP_LOGO, APP_NAME } from "@/lib/constants";
import Menu from "./menu";
// import Search from "./search";

const Header = () => {
  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-2 md:px-10 md:py-2.5">
        <Link href="/" className="flex items-center justify-center" aria-label={APP_NAME}>
          <Image
            src={APP_LOGO}
            alt={`${APP_NAME} logo`}
            height={56}
            width={140}
            priority
            className="h-20 w-auto animate-float-slow md:h-22"
          />
        </Link>
=======
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

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex xl:gap-3">
          <div className="hidden xl:block">
            {/* <Search /> */}
          </div>
          <Menu />
        </div>
>>>>>>> 96856ca07b386462720a7f515c2347234613422c
      </div>
    </header>
  );
};

export default Header;
