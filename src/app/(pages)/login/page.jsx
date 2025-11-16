"use client";

import IMAGES from "@/app/assets/images.constant";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import * as Yup from "yup";
import { Authentication_Fields } from "../../../Store/Authentication-Input";
import { LOGIN, NAVIGATION_ROUTES, RENTAL } from "../../constant";
import { loginUser } from "@/lib/API/userApi";

export default function LoginPage() {
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
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userLoggedIn', 'true');

        setTimeout(() => {
          window.location.href = NAVIGATION_ROUTES.UIPAGE;
        }, 800);

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full bg-blue rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
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

          <div className="mt-3 mb-5">
            <Typography
              variant="paraSecondary"
              className="ml-30 text-black-300"
            >
              Or continue with
            </Typography>
            <div className="flex space-x-3 mt-3">
              <Typography variant="btnGoogle">Google</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}