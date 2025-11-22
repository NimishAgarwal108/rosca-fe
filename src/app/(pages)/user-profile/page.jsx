"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { useAuthStore, useRoomStore } from "@/Store/Profile-data";

import Footer from "@/components/custom/footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { EDIT_FIELDS } from "../../../Store/AddRooms_Fields";
import { NAVIGATION_ROUTES } from "../../constant";

export default function ProfilePage() {
  const { rooms, deleteRoom, updateRoom } = useRoomStore();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { user } = useAuthStore();

  const handleDelete = (id) => {
    deleteRoom(id);
    toast.success("selectedRoom deleted successfully!");
  };

  const handleView = (selectedRoom) => {
    setSelectedRoom(selectedRoom);
    setIsViewModalOpen(true);
  };

  const handleEdit = (selectedRoom) => {
    setEditForm(selectedRoom);
    setIsEditModalOpen(true);
    console.log("user");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateRoom(editForm);
    toast.success("selectedRoom updated successfully!");
    setIsEditModalOpen(false);
  };

  return (
    <div className="mt-20">
      <main className="flex flex-col items-center justify-center bg-gray-50">
        {/* Hero Section */}
        <section
          id="profile-hero"
          className="relative w-full h-[50vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        >
          <div className="absolute top-4 left-6 z-20">
            <Link href={NAVIGATION_ROUTES.UIPAGE}>
              <Typography variant="linkPrimary" className="text-white">
                ← Back
              </Typography>
            </Link>
          </div>
          <div className="absolute inset-0">
            <Image
              src="/images/profile-bg.jpg"
              alt="Profile Background"
              fill
              className="object-cover opacity-60"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-3 py-6">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src="/images/default-avatar.png"
                alt="User Profile"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>

            <Typography
              variant="h2"
              className="font-semibold tracking-wide mt-3"
            >
              {user?.name || "Guest User"}
            </Typography>

            {/* Role */}
            <Typography
              variant="paraSecondary"
              className="opacity-80 text-sm -mt-1"
            >
              {user?.role || "No Role Assigned"}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="paraSecondary"
              className="text-white opacity-80 text-base"
            >
              Manage and personalize your listed rooms
            </Typography>

            {/* Button */}
            <Link href={NAVIGATION_ROUTES.ADD_ROOM}>
              <Button className="mt-2 bg-blue-200 text-black font-medium px-6 py-2 rounded-full shadow-sm hover:bg-blue-300 transition-all">
                + Add New Property
              </Button>
            </Link>
          </div>
        </section>

        {/* selectedRoom Listing Section */}
        <section id="rooms" className="w-full max-w-6xl py-16 px-6 text-center">
          <Typography variant="h1" className="m-10 block">
            My Rooms
          </Typography>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {rooms.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  {/* selectedRoom Image */}
                  <div className="relative">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={URL.createObjectURL(item.images[0])}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* selectedRoom Details */}
                  <div className="m-5">
                    <Typography variant="h4" className="mb-2 block">
                      {item.title}
                    </Typography>
                    <Typography variant="paraSecondary" className="mb-2 block">
                      {item.location}
                    </Typography>
                    <Typography variant="paraPrimary" className="mb-3 block">
                      ₹{item.price}/month • {item.roomType}
                    </Typography>

                    {/* CRUD Buttons */}
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        onClick={() => handleView(item)}
                        className="bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                      >
                        View
                      </Button>

                      <Button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white text-sm hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Typography
              variant="paraHighLight"
              className="text-center text-gray-600 mt-6"
            >
              You haven’t added any rooms yet.
            </Typography>
          )}
        </section>

        {/* VIEW MODAL */}
        {isViewModalOpen && selectedRoom && (
          <div className="fixed rounded-3xl flex items-center justify-center  inset-0 bg-black/40 backdrop-blur-sm z-50  ">
            <main className="relative bg-gray-200 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-red-500 transition cursor-pointer"
                aria-label="Close"
              >
                ❌
              </button>

              <section className="px-4 py-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Room Image */}
                  <div className="overflow-hidden rounded-2xl shadow-lg h-full">
                    <Image
                      src={selectedRoom.image || "/images/default-room.jpg"}
                      alt={selectedRoom.title}
                      width={1400}
                      height={700}
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  </div>

                  {/* Room Details */}
                  <div className="flex flex-col justify-between gap-6">
                    <div>
                      <Typography
                        variant="h1"
                        className="text-3xl md:text-4xl font-semibold"
                      >
                        {selectedRoom.title}
                      </Typography>

                      <div className="flex items-center text-gray-600 mt-2 text-lg">
                        <span className="material-icons mr-2">📍</span>
                        <span>{selectedRoom.location}</span>
                      </div>

                      <Typography
                        variant="paraSecondary"
                        className="mt-1 text-blue-600"
                      >
                        {selectedRoom.roomType}
                      </Typography>
                    </div>

                    <Typography variant="paraPrimary">
                      {selectedRoom.description ||
                        "A clean, comfortable and affordable stay with essential amenities."}
                    </Typography>

                    {/* Host Info */}
                    {selectedRoom.host && (
                      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
                        <Image
                          src={
                            selectedRoom.host?.avatar ||
                            "/images/default-avatar.png"
                          }
                          alt={selectedRoom.host?.name || "Host"}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                        <Typography variant="paraPrimary">
                          Hosted by{" "}
                          <span className="font-semibold">
                            {selectedRoom.host?.name}
                          </span>
                        </Typography>
                      </div>
                    )}

                    {/* Amenities */}
                    <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                      <Typography
                        variant="h2"
                        className="text-xl font-semibold mb-3"
                      >
                        Amenities
                      </Typography>

                      <div className="flex flex-wrap gap-4 text-gray-700 text-lg">
                        <span className="flex items-center gap-2">
                          🛏️ {selectedRoom.beds} Bed
                        </span>
                        <span className="flex items-center gap-2">
                          🛁 {selectedRoom.baths} Bath
                        </span>

                        {selectedRoom.amenities?.map((item, i) => (
                          <span key={i} className="flex items-center gap-2">
                            ✅ {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <Typography
                      variant="paraHighLight"
                      className="text-2xl font-bold inline-block"
                    >
                      ₹{selectedRoom.price} / month
                    </Typography>

                    {/* Owner Rules */}
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
                      <Typography variant="h4" className="font-semibold block">
                        Owner Rules & Requirements
                      </Typography>
                      <Typography variant="paraPrimary" className="mt-1">
                        {selectedRoom.ownerDemands ||
                          "No specific rules provided by the owner."}
                      </Typography>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 border">
                      <Typography
                        variant="h3"
                        className="text-xl font-semibold"
                      >
                        Interested in this Room?
                      </Typography>
                      <Typography variant="paraHighLight">
                        Call Owner : +91 {selectedRoom.contact}
                      </Typography>

                      <Typography variant="paraSecondary">
                        Contact the owner directly to schedule a visit.
                      </Typography>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="w-full max-w-lg bg-white/60 backdrop-blur-md border border-black/30 rounded-2xl shadow-2xl p-8 mx-4 relative "
            >
              {/* Close (Cancel) Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-2xl cursor-pointer"
              >
                ❌
              </button>
              <div className="flex justify-center">
                <Typography
                  variant="h4"
                  className="text-center text-gray-800 mb-2 font-semibold"
                >
                  Edit Room details
                </Typography>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                {EDIT_FIELDS.map((field) => (
                  <div key={field.name}>
                    <Typography variant="h3">{field.label}</Typography>
                    <input
                      name={field.name}
                      value={editForm[field.name] || ""}
                      onChange={handleEditChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded-lg p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
