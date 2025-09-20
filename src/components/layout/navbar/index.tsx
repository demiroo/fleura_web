import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import { SearchModal } from "./search-modal";
import LogoIcon from "@/components/icons/logo";
import CartModal from "@/components/cart/modal";
import { CustomerMenu } from "@/components/customer/customer-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar() {
  // Static menu items for our flower shop (we'll make this dynamic later if needed)
  const displayMenu = [
    { title: "Startseite", path: "/" },
    { title: "Alle Produkte", path: "/search" },
    { title: "Blumensträuße", path: "/search/bouquets" },
    { title: "Hochzeitsblumen", path: "/search/wedding" },
    { title: "Pflanzen", path: "/search/plants" },
    { title: "Geschenke", path: "/search/gifts" }
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 ml-2">
            <LogoIcon className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {displayMenu.map((item: Menu) => (
              <Link
                key={item.title}
                href={item.path}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Logo - Left */}
        <div className="flex md:hidden ml-2">
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon className="h-8 w-auto" />
          </Link>
        </div>

        {/* Desktop Right side actions */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2 mr-2">
          <nav className="flex items-center space-x-1">
            <SearchModal />
            <CustomerMenu />
            <ThemeToggle />
            <CartModal />
          </nav>
        </div>

        {/* Mobile Right side actions */}
        <div className="flex md:hidden flex-1 items-center justify-end space-x-2 mr-2">
          <nav className="flex items-center space-x-1">
            <SearchModal />
            <CustomerMenu />
            <ThemeToggle />
            <CartModal />
            <MobileMenu menu={displayMenu} />
          </nav>
        </div>
      </div>
    </header>
  );
}
