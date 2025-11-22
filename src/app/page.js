import About from "@/components/custom/about";
import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import { Typography } from "@/components/custom/typography";
import IMAGES from "./assets/images.constant";
import { EXPLORE, NAVIGATION_ROUTES } from "./constant.jsx";

import Image from "next/image";
import Link from "next/link";
import Main from "../components/custom/Main";

export default function Home() {
  // const featuredProperties = properties.filter((item) => item.list === "true");

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center mt-10 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section
          id="home"
          className="relative w-full h-[60vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        >
          <div className="absolute inset-0">
            <Image
              src={IMAGES.loginBg2}
              alt="Rental Room"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>

          <div className="relative z-10 text-center px-6 flex flex-col items-center gap-3">
            <Typography variant="h1">Find Your Perfect Rental Room</Typography>
            <Typography variant="paraSecondary" className="mb-5 text-white">
              Discover verified rooms, PGs, and flats that fit your budget and
              comfort.
            </Typography>
            <Link href={NAVIGATION_ROUTES.LOGIN}>
              <Typography variant="buttonPrimary">{EXPLORE}</Typography>
            </Link>
          </div>
        </section>

        {/*========================================================== Featured Rooms Section==================================================================================== 
        <section id="rooms" className="w-full max-w-6xl py-16 px-6">
          <Typography variant="h1" className="ml-20">
            Featured Rooms
          </Typography>
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {featuredProperties.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-md shadow price-badge">
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <Typography variant="h3">{item.location}</Typography>
                    <Typography variant="paraPrimary" className="mb-5 block">
                      ₹{item.price}/month • {item.amenities.join(" • ")}
                    </Typography>
                    <Link href={NAVIGATION_ROUTES.LOGIN}>
                      <Typography variant="buttonPrimary">
                        View Details
                      </Typography>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="paraSecondary" className="text-center mt-8">
              No featured properties available at the moment.
            </Typography>
          )}
        </section>
        */}
        <Main />
        <About />
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
