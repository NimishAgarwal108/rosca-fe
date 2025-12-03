"use client";

import { getAllRooms } from "@/lib/API/roomApi";
import {
  getWishlist,
  toggleWishlist as toggleWishlistApi,
} from "@/lib/API/wishListApi";

import { Bath, Bed, Heart, Home as HomeIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Typography } from "./typography";

// FINAL getImageUrl Function
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
    "https://rosca-be.vercel.app/";

  return `${baseUrl}/${image.startsWith("/") ? image.slice(1) : image}`;
};

export default function Main({ roomType, priceRange, location }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistRoomIds, setWishlistRoomIds] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState({});
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userLoggedIn = localStorage.getItem("userLoggedIn");

    setIsLoggedIn(!!authToken && userLoggedIn === "true");

    fetchRooms();
    if (authToken && userLoggedIn === "true") fetchWishlist();
  }, []);

  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getAllRooms();

      if (response.success) {
        setRooms(response.data || []);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Wishlist
  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      if (data.success) {
        setWishlistRoomIds(new Set(data.wishlist.map((room) => room._id)));
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (roomId) => {
    if (!isLoggedIn) {
      toast.error("Please login to add rooms to wishlist");
      return;
    }

    setWishlistLoading((prev) => ({ ...prev, [roomId]: true }));

    try {
      const result = await toggleWishlistApi(roomId);

      if (result?.success) {
        setWishlistRoomIds((prev) => {
          const updatedSet = new Set(prev);
          if (updatedSet.has(roomId)) {
            updatedSet.delete(roomId);
          } else {
            updatedSet.add(roomId);
          }
          return updatedSet;
        });

        toast.success(result.message);
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [roomId]: false }));
    }
  };

  // Navigate to room details page
  const handleViewDetails = (id) => {
    router.push(`/user/rooms/${id}`);
  };

  // ----------------------------
  // ✅ Filtering System
  // ----------------------------

  const filteredRooms = rooms.filter((room) => {
    let ok = true;

    // Filter by roomType
    if (roomType !== "All Types") {
      ok = ok && room.type === roomType;
    }

    // Filter by price range
    const price = room.price;
    if (priceRange !== "Any Budget") {
      if (priceRange === "Below ₹3000") ok = ok && price < 3000;
      if (priceRange === "₹3000 - ₹6000")
        ok = ok && price >= 3000 && price <= 6000;
      if (priceRange === "₹6000 - ₹10000")
        ok = ok && price >= 6000 && price <= 10000;
      if (priceRange === "Above ₹10000") ok = ok && price > 10000;
    }

    // Filter by location
    if (location !== "") {
      ok = ok && room.location?.toLowerCase().includes(location.toLowerCase());
    }

    return ok;
  });

  // ----------------------------

  // Show loading animation
  if (loading) {
    return (
      <div className="p-10 text-center">
        <Typography variant="h4">Loading rooms...</Typography>
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <Typography variant="h4">Error loading rooms</Typography>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto px-6 py-10">
      <Typography variant="h2" className="text-center mb-10 block">
        Available Rooms
      </Typography>

      {filteredRooms.length === 0 ? (
        <Typography variant="h4" className="text-center text-gray-500">
          No rooms found for selected filters
        </Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-2xl border border-gray-200"
            >
              {/* Room Image */}
              <div className="relative w-full h-60">
                <Image
                  src={
                    room.images?.length > 0
                      ? getImageUrl(room.images[0])
                      : "/placeholder.webp"
                  }
                  alt="Room Image"
                  fill
                  className="object-cover"
                />

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(room._id)}
                  disabled={wishlistLoading[room._id]}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      wishlistRoomIds.has(room._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }`}
                  />
                </button>
              </div>

              {/* Room Info */}
              <div className="p-6">
                <Typography variant="h4" className="mb-2">
                  {room.type}
                </Typography>

                <div className="flex items-center text-gray-600 gap-2 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span>{room.location || "No location provided"}</span>
                </div>

                <Typography variant="h3" className="text-blue-600 mb-4">
                  ₹{room.price}
                  <span className="text-gray-500 text-lg"> / month</span>
                </Typography>

                <div className="flex gap-6 text-gray-700 mb-5">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{room.beds || 1} Bed</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{room.bathrooms || 1} Bath</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-5 h-5" />
                    <span>{room.size || "—"}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <Button
                  onClick={() => handleViewDetails(room._id)}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-xl py-3 cursor-pointer"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
