import {
  APP_NAME,
  SHOP_CONTACT,
  SHOP_EMAIL,
  SHOP_FACEBOOK,
  SHOP_WHATSAPP,
} from "@/lib/constants";
import Link from "next/link";
import { Facebook, MessageCircle, PhoneCall } from "lucide-react";

const footerSections = [
  {
    title: "Order Now",
    links: [
      { label: "Order Now", href: "/search?mode=deliver" },
      { label: "Home", href: "/" },
      { label: "Menu", href: "/search" },
      { label: "Offers", href: "/offers" },
      { label: "Reviews", href: "/reviews" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "My Orders", href: "/user/orders" },
    ],
  },
  {
    title: "My Account",
    links: [{ label: "Sign In / Register", href: "/sign-in" }],
  },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappLink = `https://wa.me/94${SHOP_WHATSAPP.replace(/\s+/g, "").slice(1)}`;

  return (
    <footer className="mt-10 border-t border-white/10 bg-black text-white">
      <div className="wrapper py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-2xl font-semibold">{section.title}</h3>
              <div className="mt-3 space-y-2 text-sm">
                {section.links.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/80 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>{SHOP_CONTACT}</span>
            <span className="text-white/30">|</span>
            <span>{SHOP_EMAIL}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={whatsappLink}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Link>
            <Link
              href={SHOP_FACEBOOK}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </Link>
          </div>
        </div>

        <div className="mt-5 text-center text-sm text-white/60">
          {currentYear} {APP_NAME}. All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
