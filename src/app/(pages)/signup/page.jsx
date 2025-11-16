"use client";

import IMAGES from "@/app/assets/images.constant";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Authentication_Fields } from "@/Store/Authentication-Input";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import * as Yup from "yup";
import { LOGIN, NAVIGATION_ROUTES, RENTAL, SIGNUP } from "../../constant";
import { signupUser } from "@/lib/API/userApi";

export default function SignUpPage() {
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
        toast.success("Signup successful! Please login to continue.");

        setTimeout(() => {
          window.location.href = NAVIGATION_ROUTES.LOGIN;
        }, 1000);

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full bg-blue rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-900 relative">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.loginBg3}
            alt="RentalRooms Signup"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
        <div className="absolute z-10 text-center text-white px-6">
          <Typography variant="h2" className="text-color-white block">
            {RENTAL}
          </Typography>
          <Typography variant="paraSecondary" className="text-color-white">
            "Find your perfect stay — Comfort & Convenience at your fingertips."
          </Typography>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
        <div className="relative w-full max-w-md p-10 bg-white/60 backdrop-blur-md border border-black/40 rounded-2xl shadow-2xl">
          <div className="text-center">
            <Typography variant="h4">{SIGNUP}</Typography>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-4">
                {Authentication_Fields.filter((field) =>
                  [
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "confirmPassword",
                  ].includes(field.name)
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
                <div className="flex items-center gap-3">
                  <Field type="checkbox" name="terms" className="h-4 w-4" />
                  <label className="text-sm">
                    I agree to the{" "}
                    <span className="text-blue-600 underline cursor-pointer">
                      Terms & Conditions
                    </span>
                  </label>
                </div>

                <ErrorMessage
                  name="terms"
                  component="div"
                  className="text-red-500 text-sm -mt-2"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing up..." : SIGNUP}
                </Button>
              </Form>
            )}
          </Formik>

          <Typography variant="paraSecondary" className="mt-5 text-center">
            Already have an account?{" "}
            <Link
              href={NAVIGATION_ROUTES.LOGIN}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {LOGIN}
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}