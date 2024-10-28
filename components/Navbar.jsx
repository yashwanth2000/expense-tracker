"use client";
import React, { useState } from "react";
import Logo, { LogoMobile } from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import ThemeSwitcherBtn from "./ThemeSwitcherBtn";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

const items = [
  { label: "Dashboard", link: "/dashboard" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-b bg-background md:hidden">
      <nav className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] sm:w-[340px] pt-6" side="left">
              <SheetHeader className="mb-6">
                <SheetTitle asChild>
                  <div className="flex justify-start">
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                {items.map((item) => (
                  <NavbarItem
                    key={item.label}
                    label={item.label}
                    link={item.link}
                    clickCallback={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <LogoMobile />
        </div>

        {/* Right side - Theme Switch and User Button */}
        <div className="flex items-center gap-3">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden border-b bg-background md:block">
      <nav className="container flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="flex items-center gap-1">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcherBtn />
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({ label, link, clickCallback }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full justify-start text-base font-medium text-muted-foreground hover:text-foreground",
          "px-2 py-1.5 md:py-2", // Adjusted padding
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
      )}
    </div>
  );
}

export default Navbar;
