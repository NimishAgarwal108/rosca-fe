"use client";

import { LOGIN, NAVIGATION_ROUTES } from "@/app/constant";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Authentication_Fields } from "@/Store/Authentication-Input";
import { Form, Formik } from "formik";
import Link from "next/link";
import { toast } from "sonner";
import * as Yup from "yup";
import { forgotPassword } from "@/lib/API/userApi";

export default function ForgetPasswordPage() {
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await forgotPassword({ email: values.email.trim() });

      if (response.success) {
        toast.success("OTP sent to your email!");

        // Store email in sessionStorage for next page
        sessionStorage.setItem('resetEmail', values.email.trim());

        setTimeout(() => {
          window.location.href = NAVIGATION_ROUTES.NEW_PASSWORD;
        }, 1200);

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
      <div className="w-full max-w-md p-10 bg-white/60 backdrop-blur-md border border-black/40 rounded-2xl shadow-2xl mx-4">
        <Typography variant="h4" className="ml-20">
          Forgot Password
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer font-semibold"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </Form>
          )}
        </Formik>
        <Typography variant="paraSecondary" className="ml-30 mt-4">
          {"< "}Go to{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700">
            {LOGIN}
          </Link>
        </Typography>
      </div>
    </div>
  );
}