"use client";

import { useEffect, useState } from "react";
import { getAllRooms } from "@/lib/API/roomApi";
import { Typography } from "./typography";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath } from "lucide-react";
import { toast } from "sonner";

export default function Main() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <Typography variant="paraPrimary" className="mt-4">
            Loading rooms...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Typography variant="h2" className="text-red-600">
            Error loading rooms
          </Typography>
          <Typography variant="paraPrimary" className="mt-2">
            {error}
          </Typography>
          <Button onClick={fetchRooms} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="py-16 px-6 bg-gray-50">
      <section className="max-w-7xl mx-auto">
        <Typography variant="h1" className="text-center mb-10">
          Available Rooms
        </Typography>

        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="h3" className="text-gray-600">
              No rooms available at the moment
            </Typography>
            <Typography variant="paraPrimary" className="mt-2">
              Check back later for new listings
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Room Image */}
                <div className="relative h-56 bg-gray-200">
                  {room.image ? (
                    <Image
                      src={room.image}
                      alt={room.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="p-5">
                  <Typography variant="h3" className="mb-2 line-clamp-1">
                    {room.title}
                  </Typography>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <Typography variant="paraSecondary" className="line-clamp-1">
                      {room.location}
                    </Typography>
                  </div>

                  <Typography variant="paraPrimary" className="text-blue-600 mb-3">
                    {room.roomType}
                  </Typography>

                  {/* Facilities */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {room.beds || 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {room.baths || 1}
                    </span>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <Typography variant="h4" className="text-xl font-bold text-gray-800 mb-4">
                    ₹{room.price}/month
                  </Typography>

                  <Link href={`/item-details/${room._id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}