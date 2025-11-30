import { Typography } from "@/components/custom/typography";
import Image from "next/image";
import IMAGES from "../../app/assets/images.constant";

export default function About() {
  return (
    <section id="about" className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <Typography variant="h1" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              About Us
            </Typography>
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>
          <Typography variant="paraPrimary" className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            Making room hunting simple, transparent, and stress-free
          </Typography>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={IMAGES.roomFinding}
                alt="People searching rental rooms"
                width={600}
                height={600}
                className="rounded-2xl object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      1K+
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Happy Tenants</p>
                    <p className="text-xs text-gray-600">Verified Properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <Typography variant="paraPrimary" className="text-gray-700 leading-relaxed">
                    Welcome to <span className="font-bold text-blue-600">Rental Rooms</span> — your trusted platform for
                    finding affordable, verified, and comfortable rental spaces. Whether
                    you're a student, working professional, or traveler, we help you
                    find the perfect place without any hassle.
                  </Typography>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <Typography variant="paraPrimary" className="text-gray-700 leading-relaxed">
                    Our mission is to connect room owners and tenants through a smooth
                    and reliable platform. Instead of wasting hours browsing random
                    listings or negotiating with brokers, Rental Rooms gives you a
                    simple and secure experience with filtered results and updated
                    availability.
                  </Typography>
                </div>
              </div>
            </div>

            {/* Transparency Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <Typography variant="paraPrimary" className="text-gray-700 leading-relaxed">
                    We believe in transparency. Every listing includes images, budget
                    range, and amenities — so you know exactly what you're getting
                    before you visit.
                  </Typography>
                </div>
              </div>
            </div>

            {/* Highlight Banner */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <Typography variant="paraPrimary" className="text-white font-bold text-lg">
                    No Middlemen. No Hidden Extra Charges.
                  </Typography>
                  <p className="text-white/90 text-sm mt-1">Direct connection between owners and tenants</p>
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🏠</div>
                <div>
                  <Typography variant="paraPrimary" className="text-gray-800 font-semibold text-lg">
                    Find your perfect stay — comfort & convenience at your fingertips.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              1000+
            </div>
            <p className="text-gray-600 font-medium">Happy Tenants</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <p className="text-gray-600 font-medium">Verified Properties</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              50+
            </div>
            <p className="text-gray-600 font-medium">Cities Covered</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className="text-gray-600 font-medium">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}