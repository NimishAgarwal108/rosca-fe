"use client";

import Footer from "@/components/custom/footer";
import Header from "@/components/custom/header";
import { Typography } from "@/components/custom/typography";
import { Bath, Bed, MapPin } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getRoomById } from "@/lib/API/roomApi";
import { toast } from "sonner";

export default function RoomDetails({ params }) {
  const { id } = use(params);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="flex items-center justify-center min-h-screen pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <Typography variant="paraPrimary" className="mt-4">
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
        <div className="mt-20 pt-32 text-center">
          <Typography variant="h2">Room not found</Typography>
          <Typography variant="paraPrimary" className="mt-2">
            {error || "The room you're looking for doesn't exist"}
          </Typography>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pt-32">
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Room Image */}
            <div className="overflow-hidden rounded-2xl shadow-lg h-full">
              {room.image ? (
                <Image
                  src={room.image}
                  alt={room.title}
                  width={1400}
                  height={700}
                  className="object-cover w-full h-full rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-2xl">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="flex flex-col justify-between gap-6">
              <div>
                <Typography
                  variant="h1"
                  className="text-3xl md:text-4xl font-semibold"
                >
                  {room.title}
                </Typography>

                <div className="flex items-center text-gray-600 mt-2 text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{room.location}</span>
                </div>

                <Typography
                  variant="paraSecondary"
                  className="mt-1 text-blue-600"
                >
                  {room.roomType}
                </Typography>
              </div>

              <Typography variant="paraPrimary">
                {room.description ||
                  "A clean, comfortable and affordable stay with essential amenities."}
              </Typography>

              {/* Owner Info */}
              {room.owner && (
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {room.owner.charAt(0).toUpperCase()}
                  </div>
                  <Typography variant="paraPrimary">
                    Hosted by{" "}
                    <span className="font-semibold">{room.owner}</span>
                  </Typography>
                </div>
              )}

              {/* Facilities */}
              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <Typography variant="h2" className="text-xl font-semibold mb-3">
                  Facilities
                </Typography>

                <div className="flex flex-wrap gap-4 text-gray-700 text-lg">
                  <span className="flex items-center gap-2">
                    <Bed /> {room.beds || 1} Bed
                  </span>
                  <span className="flex items-center gap-2">
                    <Bath /> {room.baths || 1} Bath
                  </span>

                  {room.amenities?.map((item, i) => (
                    <span key={i} className="flex items-center gap-2">
                      ✅ {item}
                    </span>
                  ))}
                </div>
              </div>

              <Typography
                variant="paraHighLight"
                className="text-2xl font-bold inline-block"
              >
                ₹{room.price} / month
              </Typography>

              {/* Owner Rules */}
              {room.ownerDemands && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
                  <Typography variant="h4" className="font-semibold block">
                    Owner Rules & Requirements
                  </Typography>
                  <Typography variant="paraPrimary" className="mt-1">
                    {room.ownerDemands}
                  </Typography>
                </div>
              )}

              {/* Contact Section */}
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 border">
                <Typography variant="h3" className="text-xl font-semibold">
                  Interested in this room?
                </Typography>

                <Typography variant="paraSecondary">
                  Contact the room owner and schedule a visit.
                </Typography>

                <div className="flex gap-4 flex-wrap">
                  <a
                    href={`tel:${room.contact}`}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    Call Owner
                  </a>

                  <a
                    href={`https://wa.me/91${room.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
                  >
                    WhatsApp Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}