import { quickLinks, services, socials } from "@/store/Footer-Data";
import Image from "next/image";
import Link from "next/link";
import IMAGES from "../../app/assets/images.constant";
import {
  ADDRESS,
  COMPANY_MAIL,
  NAVIGATION_ROUTES,
  PHONE_NO,
  RENTAL,
} from "../../app/constant.jsx";
import { Typography } from "./typography";

export default function Footer() {
  return (
    <>
      <section
        id="contact"
        className="bg-gray-300 text-gray-700 py-12 px-6 mt-10 rounded-t-3xl shadow-inner scroll-mt-28"
      >
        {/* Grid Section */}
        <div className="max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2">
              <Image
                src={IMAGES.logo}
                alt="brand icon"
                width={40}
                height={40}
              />
              <Typography variant="brand">{RENTAL}</Typography>
            </div>

            <Typography variant="paraPrimary">
              Find the perfect room for your stay — affordable, verified, and
              comfortable living spaces for students, travelers, and
              professionals.
            </Typography>

            <Link href={NAVIGATION_ROUTES.UIPAGE}>
              <Typography as="div" variant="buttonSecondary">
                Explore Rooms
              </Typography>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h4">Quick Links</Typography>
            <ul>
              {quickLinks.map(({ name, path }) => (
                <li key={name}>
                  <Link href={path}>
                    <Typography variant="linkPrimary">{name}</Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <Typography variant="h4">Our Services</Typography>
            <ul>
              {services.map(({ name, path }) => (
                <li key={name}>
                  <Link href={path}>
                    <Typography variant="linkPrimary">{name}</Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Typography variant="h4">Contact Us</Typography>
            <ul>
              <li>{ADDRESS}</li>
              <li>{PHONE_NO}</li>
              <li>{COMPANY_MAIL}</li>
            </ul>

            <div className="flex space-x-4 mt-4 rounded-[25px]">
              {socials.map(({ icon, url }, index) => (
                <Link href={url} key={index}>
                  <Typography variant="linkPrimary" className="cursor-pointer">
                    {icon}
                  </Typography>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-10"></div>

        <div className="max-w-9xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ">
          <Typography variant="paraHighLight">
            © {new Date().getFullYear()} RentalRooms. All rights reserved.
          </Typography>

          <div className="flex space-x-6 text-sm text-gray-500">
            <Typography variant="linkSecondary"> Privacy Policy</Typography>
            <Typography variant="linkSecondary">Terms & Conditions</Typography>
            <Typography variant="linkSecondary">Help</Typography>
          </div>
        </div>
      </section>
    </>
  );
}
