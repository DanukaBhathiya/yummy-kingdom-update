import Image from "next/image";
import Link from "next/link";
import { APP_LOGO, APP_NAME } from "@/lib/constants";
import Menu from "./menu";
// import Search from "./search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="wrapper flex items-center justify-between gap-2 py-2 md:py-2">
        <Link href="/" className="flex-start gap-4" aria-label={APP_NAME}>
          <Image
            src={APP_LOGO}
            alt={`${APP_NAME} logo`}
            height={56}
            width={140}
            priority
            className="h-20 w-auto animate-float-slow rounded-lg"
          />
        </Link>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
