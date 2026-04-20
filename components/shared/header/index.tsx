import Image from "next/image";
import Link from "next/link";
import { APP_LOGO, APP_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="wrapper flex items-center justify-center py-3">
        <Link href="/" className="flex items-center justify-center" aria-label={APP_NAME}>
          <Image
            src={APP_LOGO}
            alt={`${APP_NAME} logo`}
            height={56}
            width={180}
            priority
            className="h-auto w-[150px] md:w-[180px]"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
