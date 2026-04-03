import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import {
  EllipsisVertical,
  ShoppingCart,
  UserIcon,
  Flame,
  PhoneCall,
  House,
  Pizza,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex items-center">
      <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
        <ModeToggle />
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/">
            <House className="h-4 w-4" /> Home
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/search">
            <Pizza className="h-4 w-4" /> Menu
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="hidden 2xl:inline-flex h-9 px-2 lg:px-3">
          <Link href="/about-us">
            <Flame className="h-4 w-4" /> About
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="hidden 2xl:inline-flex h-9 px-2 lg:px-3">
          <Link href="/contact-us">
            <PhoneCall className="h-4 w-4" /> Contact
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/">
                <House className="h-4 w-4" /> Home
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/search">
                <Pizza className="h-4 w-4" /> Menu
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/about-us">
                <Flame className="h-4 w-4" /> About Us
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact-us">
                <PhoneCall className="h-4 w-4" /> Contact Us
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
            <Button asChild>
              <Link href="/sign-in">
                <UserIcon /> Sign In
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
