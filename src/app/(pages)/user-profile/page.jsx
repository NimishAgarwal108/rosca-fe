"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { useAuthStore, useRoomStore } from "@/Store/Profile-data";
import BackArrow from "@/components/custom/back_arrow";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NAVIGATION_ROUTES } from "../../constant";
import { getCurrentUserInfo, uploadProfilePicture, getUserRooms } from "@/lib/API/userApi";

export default function ProfilePage() {
  const { rooms, setRooms, deleteRoom, updateRoom } = useRoomStore();
  const { user, setUser } = useAuthStore();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // Profile picture upload states
  const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profilePicture || null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Filter rooms by current user
  const userRooms = rooms.filter((room) => room.userId === user?.id);

  // Load user data and rooms on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        
        // Load current user info
        const userResponse = await getCurrentUserInfo();
        if (userResponse.user) {
          setUser(userResponse.user);
          setProfilePicturePreview(userResponse.user.profilePicture);
        }

        // Load user's rooms
        const roomsResponse = await getUserRooms();
        if (roomsResponse.data && Array.isArray(roomsResponse.data)) {
          setRooms(roomsResponse.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [setUser, setRooms]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadProfilePicture(selectedFile);
      
      if (data.success && data.user) {
        setUser(data.user);
        setSelectedFile(null);
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(error.message || "Error uploading profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    deleteRoom(id);
    toast.success("Room deleted successfully!");
  };

  const handleView = (room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const handleEdit = (room) => {
    setEditForm(room);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateRoom(editForm);
    toast.success("Room updated successfully!");
    setIsEditModalOpen(false);
  };

  if (isLoadingData) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen">
        <Typography variant="h2">Loading profile...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <main className="flex flex-col items-center justify-center bg-gray-50">
        {/* Hero Section */}
        <section
          id="profile-hero"
          className="relative w-full h-[50vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        >
          <BackArrow />
          <div className="absolute inset-0">
            <Image
              src="/images/profile-bg.jpg"
              alt="Profile Background"
              fill
              className="object-cover opacity-60"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-3 py-6">
            {/* Profile Picture Upload Section */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-300 flex items-center justify-center">
                {profilePicturePreview ? (
                  <Image
                    src={profilePicturePreview}
                    alt="User Profile"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              {/* Upload Button Overlay */}
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg transition">
                📷
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Button */}
            {selectedFile && (
              <Button
                onClick={handleUploadProfilePicture}
                disabled={isUploading}
                className="mt-2 bg-green-500 text-white font-medium px-4 py-1 rounded-full hover:bg-green-600 text-sm"
              >
                {isUploading ? "Uploading..." : "Save Picture"}
              </Button>
            )}

            {/* User Name */}
            <Typography
              variant="h2"
              className="font-semibold tracking-wide mt-3"
            >
              {user?.firstName} {user?.lastName || ""}
            </Typography>

            {/* Role */}
            <Typography
              variant="paraSecondary"
              className="opacity-80 text-sm -mt-1 capitalize"
            >
              {user?.userType ? `${user.userType} Account` : "No Role Assigned"}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="paraSecondary"
              className="text-white opacity-80 text-base"
            >
              Manage and personalize your listed rooms
            </Typography>

            {/* Add Room Button */}
            <Link href={NAVIGATION_ROUTES.ADD_ROOM}>
              <Button className="mt-2 bg-blue-200 text-black font-medium px-6 py-2 rounded-full shadow-sm hover:bg-blue-300 transition-all">
                + Add New Property
              </Button>
            </Link>
          </div>
        </section>

        {/* Rooms Listing Section */}
        <section id="rooms" className="w-full max-w-6xl py-16 px-6 text-center">
          <Typography variant="h1" className="m-10 block">
            My Rooms
          </Typography>

          {userRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {userRooms.map((item) => (
                <div
                  key={item._id || item.id}
                  className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  {/* Room Image */}
                  <div className="relative">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.roomTitle}
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

                  {/* Room Details */}
                  <div className="m-5">
                    <Typography variant="h4" className="mb-2 block">
                      {item.roomTitle}
                    </Typography>
                    <Typography variant="paraSecondary" className="mb-2 block">
                      {item.location}
                    </Typography>
                    <Typography variant="paraPrimary" className="mb-3 block">
                      ₹{item.price}/month • {item.type}
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
                        onClick={() => handleDelete(item._id || item.id)}
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
              You haven't added any rooms yet.
            </Typography>
          )}
        </section>

        {/* VIEW MODAL */}
        {isViewModalOpen && selectedRoom && (
          <div className="fixed rounded-3xl flex items-center justify-center inset-0 bg-black/40 backdrop-blur-sm z-50">
            <main className="relative bg-gray-200 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6">
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
                    {selectedRoom.images && selectedRoom.images.length > 0 ? (
                      <Image
                        src={selectedRoom.images[0]}
                        alt={selectedRoom.roomTitle}
                        width={1400}
                        height={700}
                        className="object-cover w-full h-full rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-300 rounded-2xl flex items-center justify-center">
                        No Image
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
                        {selectedRoom.roomTitle}
                      </Typography>

                      <div className="flex items-center text-gray-600 mt-2 text-lg">
                        <span className="mr-2">📍</span>
                        <span>{selectedRoom.location}</span>
                      </div>

                      <Typography
                        variant="paraSecondary"
                        className="mt-1 text-blue-600"
                      >
                        {selectedRoom.type}
                      </Typography>
                    </div>

                    <Typography variant="paraPrimary">
                      {selectedRoom.description ||
                        "A clean, comfortable and affordable stay with essential amenities."}
                    </Typography>

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
                          🛁 {selectedRoom.bathrooms} Bath
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
                        Owner Requirements
                      </Typography>
                      <Typography variant="paraPrimary" className="mt-1">
                        {selectedRoom.ownerRequirements ||
                          "No specific requirements provided."}
                      </Typography>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 border">
                      <Typography
                        variant="h3"
                        className="text-xl font-semibold"
                      >
                        Contact Information
                      </Typography>
                      <Typography variant="paraHighLight">
                        Contact: {selectedRoom.contactNumber}
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
              className="w-full max-w-lg bg-white/60 backdrop-blur-md border border-black/30 rounded-2xl shadow-2xl p-8 mx-4 relative"
            >
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
                  className="text-center text-gray-800 mb-6 font-semibold"
                >
                  Edit Room Details
                </Typography>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <Typography variant="h3">Title</Typography>
                  <input
                    name="roomTitle"
                    value={editForm.roomTitle || ""}
                    onChange={handleEditChange}
                    placeholder="Room title"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <Typography variant="h3">Location</Typography>
                  <input
                    name="location"
                    value={editForm.location || ""}
                    onChange={handleEditChange}
                    placeholder="Room location"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <Typography variant="h3">Price</Typography>
                  <input
                    name="price"
                    type="number"
                    value={editForm.price || ""}
                    onChange={handleEditChange}
                    placeholder="Price per month"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <Typography variant="h3">Description</Typography>
                  <textarea
                    name="description"
                    value={editForm.description || ""}
                    onChange={handleEditChange}
                    placeholder="Room description"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
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