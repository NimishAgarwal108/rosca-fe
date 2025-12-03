"use client";

import IMAGES from "@/app/assets/images.constant";
import BackArrow from "@/components/custom/back_arrow";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { getGoogleAuthUrl } from "@/lib/API/googleAuthapi";
import { signupUser } from "@/lib/API/userApi";
import { Authentication_Fields } from "@/Store/Authentication-Input";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { LOGIN, NAVIGATION_ROUTES, RENTAL, SIGNUP } from "../../constant";

// Separate component that uses useSearchParams
function SignUpContent() {
  const searchParams = useSearchParams();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),

    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),

    terms: Yup.boolean()
      .oneOf([true], "You must accept the Terms & Conditions")
      .required("Required"),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await signupUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (response.success) {
        toast.success(
          "Signup successful! Redirecting to user type selection..."
        );

        // Store user data and redirect to user-type page
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("userLoggedIn", "true");

        setTimeout(() => {
          window.location.href = NAVIGATION_ROUTES.USER_TYPE;
        }, 1000);

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const { url } = await getGoogleAuthUrl();
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (error) {
      console.error("Error initiating Google signup:", error);
      toast.error("Failed to connect with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-200 ">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>
      </div>

      <BackArrow />

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative p-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <Image
            src={IMAGES.loginBg3}
            alt="RentalRooms Signup"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div
          className={`relative z-10 text-center text-white px-8 max-w-lg transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-2xl">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>
          <Typography
            variant="h2"
            className="text-white block mb-4 font-bold text-4xl lg:text-5xl drop-shadow-2xl"
          >
            {RENTAL}
          </Typography>
          <Typography
            variant="paraSecondary"
            className="text-white/90 text-lg leading-relaxed drop-shadow-lg"
          >
            Find your perfect stay — Comfort & Convenience at your fingertips.
          </Typography>
          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-white/80 text-sm">Properties</div>
            </div>
            <div className="h-12 w-px bg-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-white/80 text-sm">Happy Guests</div>
            </div>
            <div className="h-12 w-px bg-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-white/80 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center min-h-screen p-6 md:p-12">
        <div
          className={`relative w-full max-w-md transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative p-8 md:p-10 bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-purple-600 rounded-tl-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-purple-600 rounded-br-3xl opacity-30"></div>

            <div className="text-center mb-8">
              <Typography
                variant="h4"
                className="text-gray-900 font-bold text-3xl mb-2"
              >
                Create Account
              </Typography>
              <p className="text-gray-600 text-sm">
                Join us and find your perfect stay
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {Authentication_Fields.filter((field) =>
                      ["firstName", "lastName"].includes(field.name)
                    ).map((field) => (
                      <FormInput
                        key={field.id}
                        id={field.id}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </div>

                  {Authentication_Fields.filter((field) =>
                    ["email", "password", "confirmPassword"].includes(
                      field.name
                    )
                  ).map((field) => (
                    <FormInput
                      key={field.id}
                      id={field.id}
                      name={field.name}
                      label={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                    />
                  ))}

                  {/* Terms & Conditions checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200">
                    <Field
                      type="checkbox"
                      name="terms"
                      className="h-5 w-5 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer transition-all"
                    />
                    <label className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link href={NAVIGATION_ROUTES.TERMS_CONDITIONS}>
                        <span className="text-purple-600 font-semibold underline hover:text-purple-700 transition-colors cursor-pointer">
                          Terms & Conditions
                        </span>
                      </Link>{" "}
                      and{" "}
                      <Link href={NAVIGATION_ROUTES.PRIVACY_POLICY}>
                        <span className="text-purple-600 font-semibold underline hover:text-purple-700 transition-colors cursor-pointer">
                          Privacy Policy
                        </span>
                      </Link>
                    </label>
                  </div>

                  <ErrorMessage
                    name="terms"
                    component="div"
                    className="text-red-600 text-sm font-medium -mt-2 ml-1"
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating your account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {SIGNUP}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-gray-500 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">
                OR
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Google Sign Up Button */}
            <Button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-300 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGoogleLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting to Google...
                </>
              ) : (
                <>
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
                  Continue with Google
                </>
              )}
            </Button>

            <div className="mt-6 text-center">
              <Typography variant="paraSecondary" className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href={NAVIGATION_ROUTES.LOGIN}
                  className="text-purple-600 hover:text-purple-800 underline font-semibold transition-colors"
                >
                  {LOGIN}
                </Link>
              </Typography>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Trusted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-700">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-white mx-auto mb-4 shadow-lg"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-white/30 mx-auto"></div>
            </div>
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              Loading your experience...
            </p>
            <p className="text-sm text-white/80 mt-2">Please wait a moment</p>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
