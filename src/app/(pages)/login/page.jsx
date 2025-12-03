"use client";

import IMAGES from "@/app/assets/images.constant";
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
import { NAVIGATION_ROUTES, RENTAL } from "../../constant";

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
          setTimeout(() => {
            window.location.href = "/host-uipage";
          }, 800);
        } else if (response.user.userType === "host") {
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
    <div className="flex min-h-screen w-full bg-gray-200">
      {/* Left Section - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90 z-10"></div>
        <Image
          src={IMAGES.loginBg2}
          alt="RentalRooms Login"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-12 text-center">
          <div className="mb-8 animate-fade-in">
            <Image
              src={IMAGES.logo}
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto drop-shadow-2xl"
            />
          </div>
          <Typography
            variant="h1"
            className="text-white text-4xl font-bold mb-4 drop-shadow-lg"
          >
            Welcome to {RENTAL}
          </Typography>
          <Typography
            variant="h3"
            className="text-white/90 text-lg max-w-md leading-relaxed"
          >
            Your perfect stay is just a login away. Find comfort and convenience
            at your fingertips.
          </Typography>
          <div className="mt-12 grid grid-cols-3 gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm mt-1">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm mt-1">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm mt-1">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-block lg:hidden mb-4">
                <Image
                  src={IMAGES.logo}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
              </div>
              <Typography
                variant="h2"
                className="text-3xl font-bold text-gray-800 mb-2 block"
              >
                Welcome
              </Typography>
              <Typography variant="body" className="text-gray-600">
                Sign in to continue to your account
              </Typography>
            </div>

            {/* Login Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormInput
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <FormInput
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                  />

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link
                      href={NAVIGATION_ROUTES.FORGET_PASSWORD}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
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
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isGoogleLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Connecting...
                </span>
              ) : (
                "Continue with Google"
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <Typography variant="body" className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href={NAVIGATION_ROUTES.SIGNUP}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign up for free
                </Link>
              </Typography>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-6 text-center text-black">
            <Typography variant="body" className=" text-sm">
              By continuing, you agree to our{" "}
              <Link
                href={NAVIGATION_ROUTES.TERMS_CONDITIONS}
                className="underline hover:text-blue transition-colors"
              >
                <strong> Terms of Service</strong>
              </Link>{" "}
              and{" "}
              <Link
                href={NAVIGATION_ROUTES.PRIVACY_POLICY}
                className="underline hover:text-blue transition-colors"
              >
                <strong> Privacy Policy</strong>
              </Link>
            </Typography>
          </div>
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-700">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/20"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-white mt-6">Loading...</p>
            <p className="text-sm text-white/80 mt-2">Please wait a moment</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
