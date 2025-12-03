"use client";

import { NAVIGATION_ROUTES } from "@/app/constant";
import Footer from "@/components/custom/footer";
import { Typography } from "@/components/custom/typography";
import { default as UserHeader } from "@/components/custom/user_header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/lib/API/wishListApi";
import { Bath, Bed, Heart, MapPin, Square, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WishlistPage() {
  const [wishlistRooms, setWishlistRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }
      fetchWishlist();
    }
  }, [router]);

  // Refetch wishlist when window gains focus (optional for better UX)
  useEffect(() => {
    const handleFocus = () => fetchWishlist();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Fetch wishlist using API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();

      if (data.success) {
        setWishlistRooms(data.wishlist || []);
      } else {
        toast.error(data.message || "Failed to load wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);

      if (error.message === "Authentication required") {
        toast.error("Please login to view your wishlist");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userLoggedIn");
        router.push("/login");
      } else {
        toast.error("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove single room from wishlist using API
  const handleRemoveFromWishlist = async (roomId) => {
    try {
      await removeFromWishlist(roomId);

      // Refetch wishlist to update UI
      await fetchWishlist();
      toast.success("Room removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error(error.message || "Failed to remove room from wishlist");
    }
  };

  // Clear entire wishlist using API
  const handleClearAllWishlist = async () => {
    if (window.confirm("Are you sure you want to clear all saved rooms?")) {
      try {
        const data = await clearWishlist();

        if (data.success) {
          setWishlistRooms([]);
          toast.success("Wishlist cleared successfully");
        } else {
          toast.error(data.message || "Failed to clear wishlist");
        }
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        toast.error(error.message || "Failed to clear wishlist");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <main className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <Typography variant="body" className="text-gray-600">
              Loading your wishlist...
            </Typography>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Typography variant="h1" className="text-3xl font-bold mb-2 block">
              My Wishlist ❤️
            </Typography>
            <Typography variant="body" className="text-gray-600">
              <strong>
                {wishlistRooms.length}{" "}
                {wishlistRooms.length === 1 ? "room" : "rooms"} saved for later
              </strong>
            </Typography>
          </div>

          {wishlistRooms.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAllWishlist}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlistRooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <Heart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <Typography
              variant="h2"
              className="text-2xl font-semibold mb-3 block"
            >
              Your wishlist is empty
            </Typography>
            <Typography
              variant="body"
              className="text-gray-600 mb-6 max-w-md mx-auto block"
            >
              Start exploring amazing rooms and save your favorites here! Click
              the heart icon on any room to add it to your wishlist.
            </Typography>
            <Link href={NAVIGATION_ROUTES.UIPAGE}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Explore Rooms
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistRooms.map((room) => (
                <Card
                  key={room._id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader className="p-0 relative">
                    <img
                      src={room.images?.[0] || "/placeholder-room.jpg"}
                      alt={room.roomTitle || "Room"}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-room.jpg";
                      }}
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(room._id)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform hover:bg-red-50"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>

                    {/* Badge for room type */}
                    {room.type && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {room.type}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="p-5">
                    <CardTitle className="text-xl mb-3 line-clamp-1">
                      {room.roomTitle || "Untitled Room"}
                    </CardTitle>

                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <Typography
                        variant="body"
                        className="text-sm line-clamp-1"
                      >
                        {room.location || "Location not specified"}
                      </Typography>
                    </div>

                    {/* Room Features */}
                    <div className="flex gap-4 mb-4 text-gray-600">
                      {room.beds && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <Typography variant="body" className="text-sm">
                            {room.beds}
                          </Typography>
                        </div>
                      )}
                      {room.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <Typography variant="body" className="text-sm">
                            {room.bathrooms}
                          </Typography>
                        </div>
                      )}
                      {room.area && (
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <Typography variant="body" className="text-sm">
                            {room.area} sqft
                          </Typography>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1 font-medium">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div>
                        <Typography
                          variant="body"
                          className="text-2xl font-bold text-blue-600"
                        >
                          ₹{room.price?.toLocaleString() || "N/A"}
                        </Typography>
                        <Typography
                          variant="body"
                          className="text-xs text-gray-500"
                        >
                          per month
                        </Typography>
                      </div>
                      <Link href={`/item-details/${room._id}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                <Typography variant="h3" className="text-lg font-semibold mb-2">
                  💡 Pro Tip
                </Typography>
                <Typography variant="body" className="text-gray-700">
                  Keep your wishlist updated! Rooms can be rented quickly, so
                  check back often and reach out to landlords for the best
                  deals.
                </Typography>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                <Typography variant="h3" className="text-lg font-semibold mb-2">
                  🔔 Stay Notified
                </Typography>
                <Typography variant="body" className="text-gray-700">
                  Save rooms you love and get instant updates when prices drop
                  or availability changes.
                </Typography>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-blue-600"
                >
                  {wishlistRooms.length}
                </Typography>
                <Typography variant="body" className="text-sm text-gray-600">
                  Saved Rooms
                </Typography>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-green-600"
                >
                  {wishlistRooms.filter((r) => r.price).length}
                </Typography>
                <Typography variant="body" className="text-sm text-gray-600">
                  With Pricing
                </Typography>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-purple-600"
                >
                  {new Set(wishlistRooms.map((r) => r.location)).size}
                </Typography>
                <Typography variant="body" className="text-sm text-gray-600">
                  Locations
                </Typography>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-orange-600"
                >
                  {wishlistRooms.length > 0 &&
                  wishlistRooms.some((r) => r.price)
                    ? `₹${Math.min(
                        ...wishlistRooms
                          .filter((r) => r.price)
                          .map((r) => r.price)
                      ).toLocaleString()}`
                    : "N/A"}
                </Typography>
                <Typography variant="body" className="text-sm text-gray-600">
                  Lowest Price
                </Typography>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
