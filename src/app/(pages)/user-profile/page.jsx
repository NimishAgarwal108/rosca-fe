"use client";

import Footer from "@/components/custom/footer";
import { Typography } from "@/components/custom/typography";
import UserHeader from "@/components/custom/user_header";
import { Button } from "@/components/ui/button";
import { getCurrentUserInfo, uploadProfilePicture } from "@/lib/API/userApi";
import { useAuthStore } from "@/Store/Profile-data";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NAVIGATION_ROUTES } from "../../constant";

export default function UserProfilePage() {
  const { user, setUser } = useAuthStore();

  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilePicture || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem("userTheme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        if (!token) {
          toast.error("Please log in to view your profile");
          setIsLoadingData(false);
          return;
        }
        const userResponse = await getCurrentUserInfo();
        if (userResponse?.user) {
          setUser(userResponse.user);
          setProfilePicturePreview(userResponse.user.profilePicture);
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
  }, [setUser]);

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("userTheme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.success(
      `${newTheme === "dark" ? "🌙 Dark" : "☀️ Light"} mode activated!`
    );
  };

  if (isLoadingData) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">👤</div>
            </div>
          </div>
          <Typography
            variant="h2"
            className="text-gray-800 dark:text-gray-200 font-bold"
          >
            Loading your profile
          </Typography>
          <Typography
            variant="paraSecondary"
            className="text-gray-500 dark:text-gray-400 mt-2"
          >
            Getting your information...
          </Typography>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md">
          <div className="text-7xl mb-6 animate-bounce">🔐</div>
          <Typography
            variant="h2"
            className="mb-4 text-gray-800 dark:text-gray-200 font-bold"
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="paraPrimary"
            className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Sign in to access your profile and personalize your experience
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
    <div className="mt-15 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 min-h-screen transition-colors duration-300">
      <UserHeader />
      <main className="flex flex-col items-center justify-center">
        <section
          id="profile-hero"
          className="relative w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white overflow-hidden"
        >
          <div className="absolute top-4 left-6 z-20 cursor-pointer">
            <Link href={NAVIGATION_ROUTES.HOST_UIPAGE}>
              <Typography variant="link" className="text-black text-3xl">
                ←
              </Typography>
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-6 py-20 px-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {profilePicturePreview ? (
                  <Image
                    src={profilePicturePreview}
                    alt="User Profile"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    unoptimized={profilePicturePreview.startsWith("data:")}
                  />
                ) : (
                  <span className="text-7xl">👤</span>
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg transition-all transform hover:scale-110 active:scale-95">
                <span className="text-2xl">📷</span>
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
                className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    ✨ Save Picture
                  </span>
                )}
              </Button>
            )}

            <div className="mt-6 space-y-3">
              <Typography
                variant="h2"
                className="font-bold tracking-tight text-5xl bg-gradient-to-r from-white to-gray-100 bg-clip-text"
              >
                {user?.firstName} {user?.lastName || ""}
              </Typography>

              <Typography
                variant="paraSecondary"
                className="opacity-90 text-lg flex items-center justify-center gap-2"
              >
                <span>✉️</span> {user?.email}
              </Typography>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full">
                <span className="text-xl">👤</span>
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
              className="text-white/80 text-lg max-w-2xl leading-relaxed mt-4"
            >
              Manage your profile and personalize your experience
            </Typography>
          </div>
        </section>

        <section className="w-full max-w-7xl px-6 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-10 transition-colors duration-300">
            <div className="text-center mb-8">
              <Typography
                variant="h2"
                className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3 block"
              >
                Appearance Settings
              </Typography>
              <Typography
                variant="paraSecondary"
                className="text-gray-600 dark:text-gray-400"
              >
                Customize how the app looks for you
              </Typography>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl w-full max-w-md">
                <div className="flex-1 text-center">
                  <div className="text-5xl mb-3">
                    {theme === "light" ? "☀️" : "🌙"}
                  </div>
                  <Typography
                    variant="h3"
                    className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 block"
                  >
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </Typography>
                  <Typography
                    variant="paraSecondary"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Currently active
                  </Typography>
                </div>
              </div>

              <Button
                onClick={toggleTheme}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-6 h-6" />
                    Switch to Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-6 h-6" />
                    Switch to Light Mode
                  </>
                )}
              </Button>

              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800 w-full">
                <Typography
                  variant="h4"
                  className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2"
                >
                  💡 Did you know?
                </Typography>
                <Typography
                  variant="paraSecondary"
                  className="text-blue-700 dark:text-blue-300"
                >
                  Dark mode can help reduce eye strain in low-light environments
                  and may save battery life on devices with OLED screens.
                </Typography>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center transition-colors duration-300">
              <div className="text-4xl mb-3">🎨</div>
              <Typography
                variant="h3"
                className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1 block"
              >
                {theme === "light" ? "Light" : "Dark"}
              </Typography>
              <Typography
                variant="paraSecondary"
                className="text-gray-600 dark:text-gray-400"
              >
                Current Theme
              </Typography>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center transition-colors duration-300">
              <div className="text-4xl mb-3">✅</div>
              <Typography
                variant="h3"
                className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1 block"
              >
                Active
              </Typography>
              <Typography
                variant="paraSecondary"
                className="text-gray-600 dark:text-gray-400"
              >
                Account Status
              </Typography>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center transition-colors duration-300">
              <div className="text-4xl mb-3">📅</div>
              <Typography
                variant="h3"
                className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1 block"
              >
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
              <Typography
                variant="paraSecondary"
                className="text-gray-600 dark:text-gray-400"
              >
                Member Since
              </Typography>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
