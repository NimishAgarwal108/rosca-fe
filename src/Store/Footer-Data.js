import { NAVIGATION_ROUTES } from "@/app/constant";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const quickLinks = [
  { name: "Home", path: NAVIGATION_ROUTES.HOME },
  { name: "Available Rooms", path: NAVIGATION_ROUTES.UIPAGE },
  { name: "About Us", path: NAVIGATION_ROUTES.ABOUT },
  { name: "Contact", path: NAVIGATION_ROUTES.CONTACT },
];

export const services = [
  { name: "Room Booking", path: "/" },
  { name: "Property Listing", path: NAVIGATION_ROUTES.ADD_ROOM },
  { name: "Room Maintenance", path: NAVIGATION_ROUTES.ABOUT },
  { name: "Tenant Support", path: NAVIGATION_ROUTES.CONTACT },
];

export const socials = [
  { icon: <Facebook />, url: "#" },
  { icon: <Instagram />, url: "#" },
  { icon: <Twitter />, url: "#" },
];
