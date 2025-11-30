"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import IMAGES from "../../app/assets/images.constant";
import { NAVIGATION_ROUTES, RENTAL } from "../../app/constant.jsx";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet.jsx";
import { Typography } from "./typography";

export default function Header2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("userLoggedIn");
      setIsLoggedIn(status === "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    window.location.href = NAVIGATION_ROUTES.LOGIN;
  };

  const menuItem = [
   { name: "Home", href: "/uipage2" },
    { name: "Rooms", href: "#rooms" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Wishlist", href: "/user-profile2" },
  ];

  return (
    <header className="w-full bg-gray-100 shadow-md border-b border-gray-200 fixed top-0 z-10">
      <div className="max-w-9xl mx-auto flex flex-wrap items-center justify-between px-6 py-3 gap-3">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <Image
            src={IMAGES.logo}
            alt="Rental Rooms Logo"
            width={40}
            height={40}
          />

          <Link href={NAVIGATION_ROUTES.HOME}>
            <Typography variant="brand" className="cursor-pointer">
              {RENTAL}
            </Typography>
          </Link>
        </div>

        {/* 🔹 CASE 1: User NOT logged in → Only show Login */}
        {!isLoggedIn && (
          <Link href={NAVIGATION_ROUTES.LOGIN}>
            <Typography variant="buttonPrimary">Log in</Typography>
          </Link>
        )}

        {/* 🔹 CASE 2: User logged in  */}
        {isLoggedIn && (
          <Sheet>
            <SheetTrigger>
              <Menu className="w-8 h-8 text-gray-700" />
            </SheetTrigger>

            <SheetContent side="left" className="p-5 space-y-6">
              <SheetTitle className="text-2xl font-bold">{RENTAL}</SheetTitle>

              <nav className="flex flex-col gap-4 mt-4">
                {menuItem.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Typography variant="body" className="hover:text-blue-600 transition-colors">
                      {item.name}
                    </Typography>
                  </Link>
                ))}

                <button onClick={handleLogout} className="text-left">
                  <Typography variant="buttonPrimary">Log out</Typography>
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}