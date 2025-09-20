"use client";

import { Menu } from "@/lib/shopify/types";
import { Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchModal } from "./search-modal";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden border-none"
          aria-label="Open mobile menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Fleura Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Fleura</h2>
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-2">
            <SearchModal />
            <span className="text-sm text-muted-foreground">Search flowers</span>
          </div>
          
          <Separator />
          
          <nav className="flex flex-col gap-1">
            {menu.map((item: Menu) => (
              <Link
                key={item.title}
                href={item.path}
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-3 px-2 rounded-md hover:bg-accent"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <Separator />
          
          <div className="text-xs text-muted-foreground">
            <p>Premium fresh flowers</p>
            <p>Same-day delivery available</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
