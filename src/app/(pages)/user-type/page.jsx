"use client";

import { NAVIGATION_ROUTES } from "@/app/constant";
import { Typography } from "@/components/custom/typography";
import { ArrowRight, Check, Home, Key, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export default function UserTypePage() {
  const [selectedType, setSelectedType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleTypeChange = (type) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error("No Role Selected", {
        description: "Please select a role to continue.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");

      console.log("🔍 Frontend Debug - Starting request:", {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + "..." : "none",
        hasUser: !!userStr,
        selectedType,
        apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      });

      if (!token) {
        console.error("❌ No auth token found");
        toast.error("Authentication required. Please login again.");
        router.push(NAVIGATION_ROUTES.LOGIN);
        return;
      }

      let user = {};
      if (userStr && userStr !== "undefined") {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update-user-type`;
      console.log("🔍 Making PATCH request to:", url);
      console.log("🔍 Request body:", { userType: selectedType });

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userType: selectedType }),
      });

      console.log("🔍 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("🔍 Response data:", data);
      } else {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error(
          `Server returned non-JSON response (${
            response.status
          }): ${text.substring(0, 100)}`
        );
      }

      if (!response.ok) {
        console.error("❌ Request failed:", {
          status: response.status,
          data,
        });

        if (
          data.tokenError ||
          response.status === 401 ||
          response.status === 403
        ) {
          toast.error("Your session has expired. Please login again.");
          localStorage.clear();
          router.push(NAVIGATION_ROUTES.LOGIN);
          return;
        }
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      console.log("✅ User type updated successfully");

      const updatedUser = { ...user, userType: selectedType };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (selectedType === "user") {
        toast.success("Role Selected! USER", {
          description: "Redirecting to browse rooms...",
        });
        setTimeout(() => {
          router.push("/user-uipage");
        }, 1000);
      } else if (selectedType === "host") {
        toast.success("Role Selected! HOST", {
          description: "Redirecting to manage properties...",
        });
        setTimeout(() => {
          router.push("/host-uipage");
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Error updating user type:", error);
      toast.error(error.message || "Failed to update user type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Animated background elements */}

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">
              Welcome to RoomFinder
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Choose Your Path
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Select the option that best describes what you're looking for today
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 cursor-pointer">
          {/* User/Tenant Card */}
          <button
            onClick={() => handleTypeChange("user")}
            disabled={isSubmitting}
            className={`
              group relative overflow-hidden rounded-2xl transition-all duration-300
              ${
                selectedType === "user"
                  ? "scale-105 shadow-2xl"
                  : "hover:scale-102 shadow-xl hover:shadow-2xl"
              }
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            `}
          >
            <div
              className={`
              relative bg-gradient-to-br p-8 h-full min-h-[280px]
              flex flex-col justify-between
              ${
                selectedType === "user"
                  ? "from-blue-500 to-cyan-400"
                  : "from-blue-600 to-cyan-500"
              }
            `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative z-10 cursor-pointer">
                <div
                  className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                  transition-all duration-300
                  ${
                    selectedType === "user"
                      ? "bg-white shadow-lg scale-110"
                      : "bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
                  }
                `}
                >
                  <Home
                    className={`w-8 h-8 ${
                      selectedType === "user" ? "text-blue-600" : "text-white"
                    }`}
                  />
                </div>

                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-white mb-3 block"
                >
                  Find a Room
                </Typography>
                <p className="text-white/90 text-base leading-relaxed">
                  Browse and discover the perfect rental space that fits your
                  needs and budget.
                </p>
              </div>

              {/* Selected Indicator */}
              {selectedType === "user" && (
                <div className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg">
                  <Check className="w-6 h-6 text-blue-600 stroke-[3]" />
                </div>
              )}

              {/* Hover Arrow */}
              <div
                className={`
                relative z-10 mt-6 flex text-center gap-2 text-white font-semibold
                transition-all duration-300
                ${
                  selectedType === "user"
                    ? "translate-x-2"
                    : "group-hover:translate-x-2"
                }
              `}
              >
                <span>I'm looking for a room</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Host/Landlord Card */}
          <button
            onClick={() => handleTypeChange("host")}
            disabled={isSubmitting}
            className={`
              group relative overflow-hidden rounded-2xl transition-all duration-300
              ${
                selectedType === "host"
                  ? "scale-105 shadow-2xl"
                  : "hover:scale-102 shadow-xl hover:shadow-2xl"
              }
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            `}
          >
            <div
              className={`
              relative bg-gradient-to-br p-8 h-full min-h-[280px]
              flex flex-col justify-between 
              ${
                selectedType === "host"
                  ? "from-rose-500 to-orange-400"
                  : "from-rose-600 to-orange-500"
              }
            `}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 ">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative z-10 block ">
                <div
                  className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                  transition-all duration-300
                  ${
                    selectedType === "host"
                      ? "bg-white shadow-lg scale-110"
                      : "bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
                  }
                `}
                >
                  <Key
                    className={`w-8 h-8  ${
                      selectedType === "host" ? "text-rose-600" : "text-white"
                    }`}
                  />
                </div>
                <div className=" w-full"></div>
                <Typography
                  variant="h3"
                  className="text-2xl font-bold text-white mb-3"
                >
                  List Your Property
                </Typography>
                <p className="text-white/90 text-base leading-relaxed">
                  Become a host and start earning by renting out your available
                  spaces.
                </p>
              </div>

              {/* Selected Indicator */}
              {selectedType === "host" && (
                <div className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg">
                  <Check className="w-6 h-6 text-rose-600 stroke-[3]" />
                </div>
              )}

              {/* Hover Arrow */}
              <div
                className={`
                relative z-10 mt-6 flex items-center gap-2 text-white font-semibold
                transition-all duration-300
                ${
                  selectedType === "host"
                    ? "translate-x-2"
                    : "group-hover:translate-x-2"
                }
              `}
              >
                <span>I want to host rooms</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedType || isSubmitting}
            className={`
              px-12 py-4 rounded-full text-lg font-semibold
              transition-all duration-300 transform
              ${
                selectedType
                  ? "bg-white text-purple-600 hover:bg-opacity-90 hover:scale-105 shadow-xl hover:shadow-2xl"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }
              disabled:hover:scale-100 disabled:hover:shadow-xl
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-white/70 text-sm mt-8">
          You can always change your selection later in settings
        </p>
      </div>
    </div>
  );
}
