"use client";

import IMAGES from "@/app/assets/images.constant";
import BackArrow from "@/components/custom/back_arrow";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { getGoogleAuthUrl } from "@/lib/API/googleAuthapi";
import { loginUser } from "@/lib/API/userApi";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { LOGIN, NAVIGATION_ROUTES, RENTAL } from "../../constant";

// Separate component that uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "no_code":
          toast.error("Authorization code not received from Google");
          break;
        case "email_not_verified":
          toast.error("Please use a verified Google account");
          break;
        case "oauth_failed":
          toast.error("Google authentication failed. Please try again.");
          break;
        default:
          toast.error("Authentication failed. Please try again.");
      }
    }
  }, [searchParams]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await loginUser({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (response.success) {
        toast.success(`Welcome back, ${response.user.firstName}!`);

        // Store user data in localStorage
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userLoggedIn", "true");

        // IMPORTANT: Check userType and redirect accordingly
        if (response.user.userType === "user") {
          // Regular user - redirect to uipage2 with Header2
          console.log("✅ User type: USER - Redirecting to /uipage2");
          setTimeout(() => {
            window.location.href = "/uipage2";
          }, 800);
        } else if (response.user.userType === "host") {
          // Host - redirect to uipage with original Header
          console.log("✅ User type: HOST - Redirecting to UIPAGE");
          setTimeout(() => {
            window.location.href = NAVIGATION_ROUTES.UIPAGE;
          }, 800);
        } else {
          // No userType set - redirect to user-type selection page
          console.log("⚠️ No userType - Redirecting to user-type selection");
          setTimeout(() => {
            window.location.href = NAVIGATION_ROUTES.USER_TYPE;
          }, 800);
        }

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { url } = await getGoogleAuthUrl();
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      toast.error("Failed to connect with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex w-full bg-blue rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
      <BackArrow />
      <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-900 relative">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.loginBg2}
            alt="RentalRooms Login"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
        <div className="absolute z-10 text-center text-white px-6">
          <Typography variant="h4" className="block">
            {RENTAL}
          </Typography>
          <Typography variant="paraPrimary" className="text-white">
            "Find your perfect stay — Comfort & Convenience at your fingertips."
          </Typography>
        </div>
      </div>

      <div className="relative w-full md:w-1/2 flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
        <div className="relative w-full max-w-md p-10 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl">
          <Typography variant="h2" className="ml-35">
            {LOGIN}
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormInput
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
                <FormInput
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer"
                >
                  {isSubmitting ? "Logging in..." : LOGIN}
                </Button>
              </Form>
            )}
          </Formik>

          <Typography variant="paraSecondary" className="ml-30">
            <Link
              href={NAVIGATION_ROUTES.FORGET_PASSWORD}
              className="text-blue-500 hover:text-red-600"
            >
              Forgot Password?
            </Link>
          </Typography>

          <Typography
            variant="paraSecondary"
            className="mt-4 ml-20 text-black-600"
          >
            Don't have an account?{" "}
            <Link
              href={NAVIGATION_ROUTES.SIGNUP}
              className="text-blue-500 hover:text-blue-800"
            >
              sign up
            </Link>
          </Typography>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-400"></div>
            <span className="text-gray-700 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-400"></div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function LoginPage() {
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
      <LoginContent />
    </Suspense>
  );
}