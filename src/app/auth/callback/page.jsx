"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { NAVIGATION_ROUTES } from "@/app/constant";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        // Handle errors
        if (error) {
          console.error("❌ OAuth error:", error);
          toast.error("Authentication failed. Please try again.");
          setTimeout(() => {
            router.push(NAVIGATION_ROUTES.LOGIN);
          }, 1500);
          return;
        }

        // Validate token
        if (!token) {
          console.error("❌ No token received from OAuth");
          toast.error("Authentication failed. No token received.");
          setTimeout(() => {
            router.push(NAVIGATION_ROUTES.LOGIN);
          }, 1500);
          return;
        }

        console.log("✅ Token received, fetching user data...");

        // Fetch user data from backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        console.log("✅ User data received:", userData);

        // Store authentication data
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(userData.user || userData));
        localStorage.setItem("userLoggedIn", "true");

        // Success toast
        toast.success(
          `Welcome, ${userData.user?.firstName || userData.firstName || "User"}!`
        );

        // Redirect based on userType
        const userType = userData.user?.userType || userData.userType;

        if (userType === "user") {
          console.log("✅ User type: USER - Redirecting to /uipage2");
          setTimeout(() => {
            router.push("/uipage2");
          }, 1000);
        } else if (userType === "host") {
          console.log("✅ User type: HOST - Redirecting to /uipage");
          setTimeout(() => {
            router.push(NAVIGATION_ROUTES.UIPAGE);
          }, 1000);
        } else {
          // No userType - redirect to user-type selection
          console.log("⚠️ No userType - Redirecting to user-type selection");
          setTimeout(() => {
            router.push(NAVIGATION_ROUTES.USER_TYPE);
          }, 1000);
        }
      } catch (error) {
        console.error("❌ Callback error:", error);
        toast.error("Authentication failed. Please try again.");
        setTimeout(() => {
          router.push(NAVIGATION_ROUTES.LOGIN);
        }, 1500);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-gray-800">
          Completing authentication...
        </p>
        <p className="text-sm text-gray-600 mt-2">Please wait</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-800">Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}