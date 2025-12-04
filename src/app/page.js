"use client";

import About from "@/components/custom/about";
import Footer from "@/components/custom/footer";
import { Typography } from "@/components/custom/typography";
import { useEffect, useState } from "react";
import IMAGES from "./assets/images.constant";
import { EXPLORE, NAVIGATION_ROUTES } from "./constant.jsx";

import NavBar from "@/components/custom/home_navbar";
import HostHeader from "@/components/custom/host_header";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Main from "../components/custom/Main";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in using authToken
    const authToken = localStorage.getItem("authToken");
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    const loggedIn = !!authToken && userLoggedIn === "true";

    setIsLoggedIn(loggedIn);
    setIsLoading(false);

    // ✅ FIXED: Check userType FIRST, then redirect
    if (loggedIn) {
      const userStr = localStorage.getItem("user"); // Get user data

      if (userStr && userStr !== "undefined") {
        try {
          const user = JSON.parse(userStr); // Parse user object

          // Check userType and redirect accordingly
          if (user.userType === "host") {
            console.log("✅ Redirecting HOST to /host-uipage");
            router.push("/host-uipage"); // Hosts go here
          } else if (user.userType === "user") {
            console.log("✅ Redirecting USER to /user-uipage");
            router.push("/user-uipage"); // Users go here
          } else {
            console.log("⚠️ No userType found, redirecting to /usertype");
            router.push("/usertype"); // No type? Select one
          }
        } catch (e) {
          console.error("❌ Error parsing user data:", e);
          router.push("/usertype"); // Error? Select type again
        }
      } else {
        console.log("⚠️ No user data found, redirecting to /usertype");
        router.push("/usertype"); // No user data? Select type
      }
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <Typography variant="h3" className="text-white">
            Loading...
          </Typography>
        </div>
      </div>
    );
  }

  // If logged in, show nothing (user will be redirected)
  if (isLoggedIn) {
    return null; // ✅ FIXED: Return null instead of trying to redirect again
  }

  // Show landing page for non-logged-in users
  return (
    <>
      <HostHeader />
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section
          id="home"
          className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
          </div>

          {/* Background Image Overlay */}
          <div className="absolute inset-0">
            <Image
              src={IMAGES.loginBg2}
              alt="Rental Room"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-white rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-white rounded-full animate-pulse animation-delay-2000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="mb-6 animate-slide-up">
              <Typography
                variant="h1"
                className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4 drop-shadow-2xl"
              >
                Find Your Perfect
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Rental Room
                </span>
              </Typography>
            </div>

            {/* Subtitle */}
            <Typography
              variant="paraSecondary"
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg animate-slide-up animation-delay-200"
            >
              Discover verified rooms, PGs, and flats that fit your budget and
              comfort. Your dream home is just a click away.
            </Typography>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up animation-delay-400">
              <Link href={NAVIGATION_ROUTES.LOGIN}>
                <button className="group relative px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer">
                  <span className="relative z-10 flex items-center gap-2">
                    {EXPLORE}
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-300"></span>
                </button>
              </Link>

              <Link href="#rooms">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
                  View Featured Rooms
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-up animation-delay-600">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/80 text-sm">Properties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80 text-sm">Happy Tenants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">4.9★</div>
                <div className="text-white/80 text-sm">User Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </section>

        <NavBar />

        {/* Features Section */}
        <section className="w-full max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <Typography
              variant="h2"
              className="text-4xl font-bold text-gray-900 mb-4 block"
            >
              Why Choose Us?
            </Typography>

            <Typography variant="paraPrimary" className="text-gray-600 text-lg">
              Everything you need for a hassle-free rental experience
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <Typography
                variant="h3"
                className="text-xl font-bold text-gray-900 mb-3 block"
              >
                100% Verified
              </Typography>

              <Typography variant="paraSecondary" className="text-gray-600">
                All properties are personally verified by our team for
                authenticity and quality.
              </Typography>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <Typography
                variant="h3"
                className="text-xl font-bold text-gray-900 mb-3 block"
              >
                Best Prices
              </Typography>

              <Typography variant="paraSecondary" className="text-gray-600">
                Find properties that match your budget without hidden charges or
                fees.
              </Typography>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>

              <Typography
                variant="h3"
                className="text-xl font-bold text-gray-900 mb-3 block"
              >
                24/7 Support
              </Typography>

              <Typography variant="paraSecondary" className="text-gray-600">
                Our dedicated team is always here to help you with any questions
                or concerns.
              </Typography>
            </div>
          </div>
        </section>

        {/* Featured Rooms */}
        <section id="rooms" className="w-full max-w-6xl px-6 py-20">
          <div className="text-center">
            <Typography
              variant="h2"
              className="text-4xl font-bold text-gray-900 block"
            >
              Featured Rooms
            </Typography>

            <Typography variant="paraPrimary" className="text-gray-600 text-lg">
              Handpicked properties verified by our team
            </Typography>
          </div>
        </section>

        <Main />
        <About />
        <div>
          {/*this Div added only for make a commit on Nimish Agarwal Repo.*/}
        </div>
        <Footer />
      </main>
    </>
  );
}
