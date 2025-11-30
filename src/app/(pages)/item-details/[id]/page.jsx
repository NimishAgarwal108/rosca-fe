"use client";

import BackArrow from "@/components/custom/back_arrow";
import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import { Typography } from "@/components/custom/typography";
import { getRoomById } from "@/lib/API/roomApi";
import { Bath, Bed, MapPin, Phone, MessageCircle, CheckCircle, Home, User } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

// FIXED: Now matches main.jsx - handles Cloudinary URLs correctly
const getImageUrl = (image) => {
  if (!image) return "";

  // If it's already a full URL (Cloudinary), return as-is
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Otherwise construct URL with backend base
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
    "https://rosca-be.vercel.app/";

  const cleanPath = image.startsWith("/") ? image.slice(1) : image;

  return `${baseUrl}/${cleanPath}`;
};

export default function RoomDetails({ params }) {
  const { id } = use(params);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await getRoomById(id);

      if (response.success) {
        setRoom(response.data);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-32 bg-gradient-to-br from-blue-50 to-indigo-50">
          <BackArrow />
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <Typography variant="paraPrimary" className="mt-6 text-gray-700 font-medium">
              Loading room details...
            </Typography>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !room) {
    return (
      <>
        <Header />
        <div className="mt-20 pt-32 text-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-10 w-10 text-red-600" />
            </div>
            <Typography variant="h2" className="text-2xl font-bold text-gray-800">Room not found</Typography>
            <Typography variant="paraPrimary" className="mt-3 text-gray-600">
              {error || "The room you're looking for doesn't exist"}
            </Typography>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <BackArrow />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image with Enhanced Styling */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl h-[450px] group">
                {room.images && room.images.length > 0 ? (
                  <>
                    <Image
                      src={getImageUrl(room.images[currentImageIndex])}
                      alt={room.roomTitle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Image Counter Badge */}
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {currentImageIndex + 1} / {room.images.length}
                    </div>

                    {/* Navigation Arrows */}
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-3xl">
                    <div className="text-center">
                      <Home className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-500 font-medium">No Image Available</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {room.images && room.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {room.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-blue-600 scale-105 shadow-lg ring-2 ring-blue-300"
                          : "border-gray-200 hover:border-blue-400 hover:scale-102 shadow-md"
                      }`}
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={`${room.roomTitle} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={process.env.NODE_ENV === "development"}
                      />
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Description Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <Typography variant="h2" className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  About This Room
                </Typography>
                <Typography variant="paraPrimary" className="text-gray-700 leading-relaxed">
                  {room.description || "A clean, comfortable and affordable stay with essential amenities."}
                </Typography>
              </div>

              {/* Facilities Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <Typography variant="h2" className="text-xl font-bold text-gray-800 mb-4">
                  Facilities & Amenities
                </Typography>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <Bed className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">{room.beds || 1}</p>
                      <p className="text-sm text-gray-600">{room.beds === 1 ? "Bed" : "Beds"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <Bath className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">{room.bathrooms || 1}</p>
                      <p className="text-sm text-gray-600">{room.bathrooms === 1 ? "Bath" : "Baths"}</p>
                    </div>
                  </div>

                  {room.amenities && room.amenities.length > 0 && room.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Rules */}
              {room.ownerRequirements && (
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6 shadow-md">
                  <Typography variant="h4" className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    House Rules & Requirements
                  </Typography>
                  <Typography variant="paraPrimary" className="text-amber-900 leading-relaxed">
                    {room.ownerRequirements}
                  </Typography>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Main Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <Typography variant="h1" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {room.roomTitle}
                  </Typography>

                  <div className="flex items-start gap-2 text-gray-600 mb-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base">{room.location}</span>
                  </div>

                  <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    {room.type}
                  </div>

                  {/* Price Badge */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                    <p className="text-sm font-medium opacity-90 mb-1">Monthly Rent</p>
                    <div className="flex items-baseline gap-2">
                      <Typography variant="h1" className="text-4xl font-bold">
                        ₹{room.price}
                      </Typography>
                      <span className="text-lg opacity-90">/ month</span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  {room.ownerName && (
                    <div className="flex items-center gap-4 bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {room.ownerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Hosted by</p>
                        <p className="text-lg font-bold text-gray-800">{room.ownerName}</p>
                      </div>
                    </div>
                  )}

                  {/* Contact Buttons */}
                  {room.contactNumber && (
                    <div className="space-y-3">
                      <a
                        href={`tel:${room.contactNumber}`}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold w-full group"
                      >
                        <Phone className="h-5 w-5 group-hover:animate-pulse" />
                        Call Owner
                      </a>

                      <a
                        href={`https://wa.me/91${room.contactNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold w-full group"
                      >
                        <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                        WhatsApp Now
                      </a>
                    </div>
                  )}
                </div>

                {/* Quick Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <Typography variant="h3" className="text-lg font-bold text-gray-800 mb-3">
                    Why Choose This Room?
                  </Typography>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Verified listing with genuine photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Direct contact with property owner</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Schedule a visit anytime</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}