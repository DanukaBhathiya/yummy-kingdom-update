import Image from "next/image";
import Link from "next/link";
import { APP_LOGO, APP_NAME } from "@/lib/constants";

const Header = () => {
  return (
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
      </div>
    </header>
  );
};

export default Header;
