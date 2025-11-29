"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { NAVIGATION_ROUTES } from "@/app/constant";

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

      console.log('🔍 Frontend Debug - Starting request:', {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
        hasUser: !!userStr,
        selectedType,
        apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
      });

      if (!token) {
        console.error('❌ No auth token found');
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
      console.log('🔍 Making PATCH request to:', url);
      console.log('🔍 Request body:', { userType: selectedType });

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userType: selectedType }),
      });

      console.log('🔍 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Check if response has content
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log('🔍 Response data:', data);
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 100)}`);
      }

      // Handle errors
      if (!response.ok) {
        console.error('❌ Request failed:', {
          status: response.status,
          data
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
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      console.log('✅ User type updated successfully');

      // Update user data in localStorage
      const updatedUser = { ...user, userType: selectedType };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Show success toast and redirect to the same page for both types
      if (selectedType === "user") {
        toast.success("Role Selected! USER", {
          description: "Redirecting to browse rooms...",
        });
      } else if (selectedType === "host") {
        toast.success("Role Selected! HOST", {
          description: "Redirecting to browse rooms...",
        });
      }

      // Redirect both user types to the same page
      setTimeout(() => {
        router.push(NAVIGATION_ROUTES.UIPAGE);
      }, 1000);

    } catch (error) {
      console.error("❌ Error updating user type:", error);
      toast.error(error.message || "Failed to update user type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600 p-10">
      <div className="max-w-4xl w-full bg-white/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-black/40">
        <Typography variant="h2" className="text-center mb-12 text-gray-800">
          What Are You Looking For?
        </Typography>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User/Tenant Option */}
          <button
            onClick={() => handleTypeChange("user")}
            disabled={isSubmitting}
            className={`
              relative h-auto min-h-[220px] cursor-pointer text-left
              flex flex-col items-start gap-4 rounded-lg border-2 p-6
              transition-all duration-200 hover:shadow-lg overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                selectedType === "user"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-blue-600 bg-blue-400 hover:border-blue-700"
              }
            `}
          >
            {selectedType === "user" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="bg-blue-600/20 rounded-full p-4 animate-in zoom-in duration-300">
                  <Check className="w-24 h-24 text-black stroke-[4]" />
                </div>
              </div>
            )}

            <div className="relative grid gap-2 w-full z-10">
              <Typography
                variant="h4"
                className="text-lg font-semibold text-gray-800"
              >
                I am looking for rental rooms
              </Typography>
              <Typography variant="paraPrimary" className="text-sm text-gray-600">
                You can search and browse properties available for rent.
              </Typography>
            </div>
          </button>

          {/* Host/Landlord Option */}
          <button
            onClick={() => handleTypeChange("host")}
            disabled={isSubmitting}
            className={`
              relative h-auto min-h-[220px] cursor-pointer text-left
              flex flex-col items-start gap-4 rounded-lg border-2 p-6
              transition-all duration-200 hover:shadow-lg overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                selectedType === "host"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-red-600 bg-red-400 hover:border-red-700"
              }
            `}
          >
            {selectedType === "host" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="bg-red-600/20 rounded-full p-4 animate-in zoom-in duration-300">
                  <Check className="w-24 h-24 text-black stroke-[4]" />
                </div>
              </div>
            )}

            <div className="relative grid gap-2 w-full z-10">
              <Typography
                variant="h4"
                className="text-lg font-semibold text-gray-800"
              >
                I want to add/host rooms
              </Typography>
              <Typography variant="paraPrimary" className="text-sm text-gray-600">
                You can list and manage properties you want to rent out.
              </Typography>
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || isSubmitting}
            className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}