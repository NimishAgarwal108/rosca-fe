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
import { deleteRoom as deleteRoomApi } from "@/lib/API/roomApi";
import ViewRoomModal from "@/components/custom/view-room-modal";
import EditRoomModal from "@/components/custom/edit-room-modal";

export default function ProfilePage() {
  const { rooms, setRooms, updateRoom: updateRoomStore } = useRoomStore();
  const { user, setUser } = useAuthStore();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profilePicture || null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const userRooms = rooms.filter((room) => room.userId === user?.id);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (!token) {
          toast.error("Please log in to view your profile");
          setIsLoadingData(false);
          return;
        }
        const userResponse = await getCurrentUserInfo();
        if (userResponse?.user) {
          setUser(userResponse.user);
          setProfilePicturePreview(userResponse.user.profilePicture);

          const roomsResponse = await getUserRooms();
          if (roomsResponse?.success && Array.isArray(roomsResponse.rooms)) {
            setRooms(roomsResponse.rooms);
          } else {
            setRooms([]);
          }
        } else {
          toast.error("Could not load user information");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load profile data");
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, [setRooms, setUser]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfilePicturePreview(reader.result);
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
        setProfilePicturePreview(data.user.profilePicture);
        setSelectedFile(null);
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      toast.error(error.message || "Error uploading profile picture");
      setProfilePicturePreview(user?.profilePicture || null);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid room ID");
      return;
    }
    if (!confirm("Are you sure you want to delete this room?")) return;
    setIsDeleting(true);
    try {
      await deleteRoomApi(id);
      setRooms((prev) => prev.filter((room) => (room._id || room.id) !== id));
      toast.success("Room deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { updateRoom } = await import("@/lib/API/roomApi");
      await updateRoom(editForm._id || editForm.id, editForm);
      updateRoomStore(editForm);
      toast.success("Room updated successfully!");
      setIsEditModalOpen(false);
      const roomsResponse = await getUserRooms();
      if (roomsResponse.success && roomsResponse.rooms) {
        setRooms(roomsResponse.rooms);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update room");
    }
  };

  if (isLoadingData) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">🏠</div>
            </div>
          </div>
          <Typography variant="h2" className="text-gray-800 font-bold">Loading your profile</Typography>
          <Typography variant="paraSecondary" className="text-gray-500 mt-2">Fetching your rooms and data...</Typography>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-md">
          <div className="text-7xl mb-6 animate-bounce">🔐</div>
          <Typography variant="h2" className="mb-4 text-gray-800 font-bold">Welcome Back!</Typography>
          <Typography variant="paraPrimary" className="mb-8 text-gray-600 leading-relaxed">
            Sign in to access your profile, manage your properties, and connect with potential tenants
          </Typography>
          <Link href={NAVIGATION_ROUTES.LOGIN}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen">
      <main className="flex flex-col items-center justify-center">
        <section
          id="profile-hero"
          className="relative w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden"
        >
          <BackArrow />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-4 py-16 px-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {profilePicturePreview ? (
                  <Image
                    src={profilePicturePreview}
                    alt="User Profile"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    unoptimized={profilePicturePreview.startsWith('data:')}
                  />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
              <label className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg transition-all transform hover:scale-110 active:scale-95">
                <span className="text-xl">📷</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {selectedFile && (
              <Button
                onClick={handleUploadProfilePicture}
                disabled={isUploading}
                className="bg-white text-indigo-600 font-semibold px-6 py-2.5 rounded-full hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">✨ Save Picture</span>
                )}
              </Button>
            )}

            <div className="mt-4 space-y-2">
              <Typography
                variant="h2"
                className="font-bold tracking-tight text-4xl bg-gradient-to-r from-white to-gray-100 bg-clip-text"
              >
                {user?.firstName} {user?.lastName || ""}
              </Typography>

              <Typography
                variant="paraSecondary"
                className="opacity-90 text-base flex items-center justify-center gap-2"
              >
                <span>✉️</span> {user?.email}
              </Typography>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-lg">{user?.userType === 'host' ? '🏠' : '👤'}</span>
                <Typography
                  variant="paraSecondary"
                  className="text-white font-medium capitalize"
                >
                  {user?.userType ? `${user.userType} Account` : "User Account"}
                </Typography>
              </div>
            </div>

            <Typography
              variant="paraSecondary"
              className="text-white/80 text-lg max-w-2xl leading-relaxed"
            >
              Manage your properties and connect with tenants
            </Typography>

            <Link href={NAVIGATION_ROUTES.ADD_ROOM}>
              <Button className="mt-4 bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2 text-base">
                <span className="text-xl">+</span> Add New Property
              </Button>
            </Link>
          </div>
        </section>

        <section className="w-full max-w-6xl px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-4xl mb-2">🏠</div>
                <Typography variant="h3" className="text-3xl font-bold text-indigo-600 mb-1">
                  {userRooms.length}
                </Typography>
                <Typography variant="paraSecondary" className="text-gray-600">Total Properties</Typography>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-4xl mb-2">✅</div>
                <Typography variant="h3" className="text-3xl font-bold text-green-600 mb-1">
                  {userRooms.length}
                </Typography>
                <Typography variant="paraSecondary" className="text-gray-600">Active Listings</Typography>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="text-4xl mb-2">👁️</div>
                <Typography variant="h3" className="text-3xl font-bold text-orange-600 mb-1">
                  {userRooms.reduce((acc, room) => acc + (room.views || 0), 0)}
                </Typography>
                <Typography variant="paraSecondary" className="text-gray-600">Total Views</Typography>
              </div>
            </div>
          </div>
        </section>

        <section id="rooms" className="w-full max-w-6xl py-16 px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Typography variant="h1" className="text-4xl font-bold text-gray-800 mb-2">My Properties</Typography>
              <Typography variant="paraSecondary" className="text-gray-600">
                Manage and edit your room listings
              </Typography>
            </div>

            {userRooms.length > 0 && (
              <Link href={NAVIGATION_ROUTES.ADD_ROOM}>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <span className="text-lg mr-2">+</span> Add Property
                </Button>
              </Link>
            )}
          </div>

          {userRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userRooms.map((item) => (
                <div
                  key={item._id || item.id}
                  className="group relative bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <>
                        <Image
                          src={item.images[0]}
                          alt={item.roomTitle}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-5xl">🏠</span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <Typography variant="paraSecondary" className="text-xs font-semibold text-indigo-600 capitalize">
                        {item.type}
                      </Typography>
                    </div>
                  </div>

                  <div className="p-6">
                    <Typography variant="h4" className="mb-3 block font-bold text-gray-800 line-clamp-1">
                      {item.roomTitle}
                    </Typography>

                    <div className="space-y-2 mb-4">
                      <Typography variant="paraSecondary" className="flex items-center gap-2 text-gray-600">
                        <span>📍</span> {item.location}
                      </Typography>
                      <Typography variant="paraPrimary" className="flex items-center gap-2 text-lg font-semibold text-indigo-600">
                        <span>💰</span> ₹{item.price.toLocaleString()}/month
                      </Typography>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">🛏️ {item.beds} Beds</span>
                        <span className="flex items-center gap-1">🚿 {item.bathrooms} Baths</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleView(item)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm hover:from-indigo-600 hover:to-purple-600 flex-1 rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        👁️ View
                      </Button>

                      <Button
                        onClick={() => handleEdit(item)}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm hover:from-yellow-500 hover:to-orange-500 flex-1 rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        ✏️ Edit
                      </Button>

                      <Button
                        onClick={() => handleDelete(item._id || item.id)}
                        disabled={isDeleting}
                        className="bg-gradient-to-r from-red-400 to-pink-400 text-white text-sm hover:from-red-500 hover:to-pink-500 flex-1 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? "..." : "🗑️"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-12 bg-white p-16 rounded-3xl shadow-xl border border-gray-100">
              <div className="text-8xl mb-6 animate-bounce">🏠</div>
              <Typography variant="h2" className="text-gray-800 mb-4 text-3xl font-bold">
                No Properties Yet
              </Typography>
              <Typography variant="paraPrimary" className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Start your journey as a host by adding your first property. It only takes a few minutes!
              </Typography>
              <Link href={NAVIGATION_ROUTES.ADD_ROOM}>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <span className="text-xl mr-2">+</span> Add Your First Property
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Modal Components */}
      <ViewRoomModal
        room={selectedRoom}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <EditRoomModal
        room={editForm}
        formData={editForm}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
      />

      <Footer />
    </div>
  );
}
