"use client";

import { useEffect, useState } from "react";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import IMAGES from "../../app/assets/images.constant";
import { NAVIGATION_ROUTES, RENTAL } from "../../app/constant.jsx";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet.jsx";
import { Typography } from "./typography";

export default function HostHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("userLoggedIn");
      setIsLoggedIn(status === "true");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    setIsLoggedIn(false);
    window.location.href = NAVIGATION_ROUTES.LOGIN;
  };

  const menuItem = [
    { name: "Home", href: NAVIGATION_ROUTES.HOME },
    { name: "Add your Property", href: NAVIGATION_ROUTES.ADD_ROOM },
    { name: "Rooms", href: "#rooms" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Profile", href: NAVIGATION_ROUTES.HOST_PROFILE },
  ];

  return (
    <header className="w-full bg-gray-100 shadow-md border-b border-gray-200 fixed top-0 z-100">
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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger onClick={() => setOpen(true)}>
              <Menu className="w-8 h-8 text-gray-700 cursor-pointer" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="p-5 h-full flex flex-col justify-between"
            >
              <div>
                <SheetTitle className="text-2xl font-bold">{RENTAL}</SheetTitle>

                <nav className="flex flex-col gap-4 mt-6 cursor-pointer">
                  {menuItem.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <Typography variant="body">{item.name}</Typography>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto pt-4 mb-10">
                <button onClick={handleLogout} className="w-full">
                  <Typography
                    variant="buttonPrimary"
                    className="text-black bg-red-400 hover:bg-red-700 w-full text-center py-2 rounded-lg"
                  >
                    Log out
                  </Typography>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
