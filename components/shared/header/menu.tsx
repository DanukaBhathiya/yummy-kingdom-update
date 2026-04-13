import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import {
  EllipsisVertical,
  ShoppingCart,
  UserIcon,
  Flame,
  PhoneCall,
  House,
  Truck,
  Pizza,
  ClipboardList,
  Tag,
  MessageCircleHeart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex items-center">
      <nav className="hidden md:flex items-center justify-end gap-1 lg:gap-2 flex-nowrap whitespace-nowrap">
        <ModeToggle />
        <Button asChild size="sm" className="h-9 px-3 bg-[#e31837] hover:bg-[#c7122f]">
          <Link href="/search?mode=deliver" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Order Now</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/" className="flex items-center gap-2">
            <House className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/search" className="flex items-center gap-2">
            <Pizza className="h-4 w-4" />
            <span>Menu</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/offers" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Offers</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/reviews" className="flex items-center gap-2">
            <MessageCircleHeart className="h-4 w-4" />
            <span>Reviews</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-9 px-2 lg:px-3"
        >
          <Link href="/about-us" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            <span>About</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-9 px-2 lg:px-3"
        >
          <Link href="/contact-us" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Contact</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/user/orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Orders</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
          </Link>
        </Button>
        <UserButton />
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <UserButton />
        <Sheet>
          <SheetTrigger className="align-middle" aria-label="Open menu">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start gap-2">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild>
              <Link href="/search?mode=deliver" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Order Now</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/" className="flex items-center gap-2">
                <House className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/search" className="flex items-center gap-2">
                <Pizza className="h-4 w-4" />
                <span>Menu</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/offers" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>Offers</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/reviews" className="flex items-center gap-2">
                <MessageCircleHeart className="h-4 w-4" />
                <span>Reviews</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/cart" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/user/orders" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/about-us" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span>About Us</span>
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact-us" className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" />
                <span>Contact Us</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Menu;
