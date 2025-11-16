"use client";

import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu.jsx";

import Image from "next/image";
import Link from "next/link";
import IMAGES from "../../app/assets/images.constant";
import { NAVIGATION_ROUTES, RENTAL } from "../../app/constant.jsx";
import { Typography } from "./typography";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

        {/* 🔹 CASE 2: User logged in → Show full menu */}
        {isLoggedIn && (
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <NavigationMenu>
              <NavigationMenuList>
                {[
                  { name: "Home", href: NAVIGATION_ROUTES.HOME },
                  { name: "Add your Property", href: "/add-room" },
                  { name: "Rooms", href: "#rooms" },
                  { name: "About", href: "#about" },
                  { name: "Contact", href: "#contact" },
                  { name: "Profile", href: "/user-profile" },
                ].map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link href={item.href}>
                        <Typography variant="body">{item.name}</Typography>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Logout */}
            <button onClick={handleLogout}>
              <Typography variant="buttonPrimary">Log out</Typography>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
