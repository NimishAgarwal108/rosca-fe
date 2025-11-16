"use client";

import { NAVIGATION_ROUTES } from "@/app/constant";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import FormInput from "../../../components/custom/input-field";
import { Typography } from "../../../components/custom/typography";
import { verifyOtp, resetPassword } from "@/lib/API/userApi";
import { useState, useEffect } from "react";

export default function NewPassword() {
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      toast.error("Please request OTP first");
      window.location.href = NAVIGATION_ROUTES.FORGET_PASSWORD;
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const passwordValidationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      const response = await verifyOtp({
        email: email,
        otp: values.otp,
      });

      if (response.success) {
        setOtp(values.otp);
        setOtpVerified(true);
        toast.success("OTP verified! Now enter your new password.");
      }
    } catch (error) {
      toast.error(error.message || "Invalid or expired OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await resetPassword({
        email: email,
        otp: otp,
        newPassword: values.password,
      });

      if (response.success) {
        toast.success("Password reset successfully!");

        // Clear sessionStorage
        sessionStorage.removeItem('resetEmail');

        setTimeout(() => {
          window.location.href = NAVIGATION_ROUTES.LOGIN;
        }, 1200);

        resetForm();
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600">
      <div className="w-full max-w-md p-10 bg-white/60 backdrop-blur-md border border-black/40 rounded-2xl shadow-2xl mx-4">
        <Typography variant="h4" className="ml-25 text-center">
          {otpVerified ? "New Password" : "Verify OTP"}
        </Typography>

        {!otpVerified ? (
          // OTP Verification Form
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpValidationSchema}
            onSubmit={handleVerifyOtp}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 mt-6">
                <FormInput
                  name="otp"
                  label="Enter OTP"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />

                <Typography variant="paraSecondary" className="text-sm">
                  OTP sent to: {email}
                </Typography>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer font-semibold"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          // Password Reset Form
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={passwordValidationSchema}
            onSubmit={handleResetPassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 mt-6">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                  ✓ OTP Verified
                </div>

                <FormInput
                  name="password"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                />

                <FormInput
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer font-semibold"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}