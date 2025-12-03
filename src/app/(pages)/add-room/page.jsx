"use client";

import { AMENITYOPTIONS, NAVIGATION_ROUTES, ROOMTYPE } from "@/app/constant";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { addRoom } from "@/lib/API/roomApi";
import { AddRoom_Fields } from "@/Store/AddRooms_Fields";
import { ErrorMessage, Form, Formik } from "formik";
import Link from "next/link";
import { toast } from "sonner";
import * as Yup from "yup";

// shadcn imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  ownerName: Yup.string()
    .trim()
    .matches(/^[a-zA-Z\s]+$/, "Only letters allowed")
    .required("Owner Name is required"),
  roomTitle: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and numbers allowed")
    .required("Title is required"),
  location: Yup.string().trim().required("Location is required"),
  price: Yup.number()
    .typeError("Only numbers allowed")
    .min(0, "Price cannot be negative")
    .required("Room price is required"),
  type: Yup.string().required("Room Type is required"),
  amenities: Yup.array().of(Yup.string()).min(1, "Select at least one amenity"),
  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be 10 digits")
    .required("Phone number is required"),
  beds: Yup.number()
    .typeError("Must be a number")
    .min(1, "At least 1 bed required")
    .required("Number of beds is required"),
  bathrooms: Yup.number()
    .typeError("Must be a number")
    .min(1, "At least 1 bathroom required")
    .required("Number of bathrooms is required"),
  description: Yup.string(),
  ownerRequirements: Yup.string(),
});

const initialValues = {
  roomTitle: "",
  location: "",
  price: "",
  type: "",
  amenities: [],
  beds: "",
  bathrooms: "",
  description: "",
  ownerRequirements: "",
  contactNumber: "",
  ownerName: "",
  images: [],
};

export default function AddRoom() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (event, setFieldValue) => {
    const files = event.currentTarget.files;
    setFieldValue("images", files);

    // Create preview URLs
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index, values, setFieldValue) => {
    const newFiles = Array.from(values.images).filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFieldValue("images", newFiles);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="min-h-screen w-full bg-gray-300">
      <div className="absolute top-4 right-6 z-20 flex items-center gap-4">
        {/* Back Button */}

        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700 flex justify-center items-center">
          <Link href={NAVIGATION_ROUTES.UIPAGE}>
            <Typography
              variant="linkPrimary"
              className="flex flex-col items-center"
            >
              {/* Filled Home Icon */}
              <svg
                className="w-8 h-8 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2L2 8h2v8h4V12h4v4h4V8h2L10 2z" />
              </svg>
              <strong>Home</strong>
            </Typography>
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start py-12 px-4">
        {/* Progress Steps */}
        <div className="w-full max-w-5xl mb-8 animate-in fade-in slide-in-from-top duration-700 delay-200">
          <div className="bg-blue-400 border rounded-3xl p-6 shadow-xl text-center">
            <Typography variant="h1" className="block text-black">
              List Your Property
            </Typography>
            <Typography variant="paraPrimary" className="text-gray-600 ">
              <strong> Fill in the details to get started</strong>
            </Typography>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <div className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-purple-600 rounded-tl-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-purple-600 rounded-br-3xl opacity-30"></div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);

                console.log("🚀 Form submission started");
                console.log("📝 Original form values:", values);

                try {
                  const formData = new FormData();

                  // Add text fields
                  formData.append("roomTitle", values.roomTitle.trim());
                  formData.append("location", values.location.trim());
                  formData.append("price", Number(values.price));

                  // ✅ CRITICAL FIX: Ensure type is lowercase to match backend enum
                  const roomType = values.type.toLowerCase().trim();
                  console.log("🏠 Room type being sent:", roomType);
                  formData.append("type", roomType);

                  formData.append("beds", Number(values.beds) || 1);
                  formData.append("bathrooms", Number(values.bathrooms) || 1);
                  formData.append(
                    "description",
                    values.description?.trim() || ""
                  );
                  formData.append(
                    "ownerRequirements",
                    values.ownerRequirements?.trim() || ""
                  );
                  formData.append("contactNumber", values.contactNumber);
                  formData.append("ownerName", values.ownerName.trim());

                  // ✅ CRITICAL FIX: Ensure amenities are lowercase
                  console.log("🎯 Amenities being sent:", values.amenities);
                  values.amenities.forEach((amenity) => {
                    const cleanAmenity = amenity.toLowerCase().trim();
                    formData.append("amenities", cleanAmenity);
                  });

                  // Add images
                  if (values.images && values.images.length > 0) {
                    console.log(`📸 Adding ${values.images.length} images...`);
                    Array.from(values.images).forEach((file) => {
                      formData.append("images", file);
                    });
                  }

                  // Debug: Log all FormData entries
                  console.log("📦 Final FormData being sent:");
                  for (let [key, value] of formData.entries()) {
                    if (value instanceof File) {
                      console.log(`  ${key}: File(${value.name})`);
                    } else {
                      console.log(`  ${key}: ${value}`);
                    }
                  }

                  const response = await addRoom(formData);

                  if (response && response.success) {
                    console.log("✅ Success response:", response);
                    toast.success("Property listed successfully!");
                    resetForm();
                    setImagePreviews([]);
                    setTimeout(() => {
                      window.location.href =
                        NAVIGATION_ROUTES?.HOST_PROFILE || "/host-profile";
                    }, 1000);
                  } else {
                    console.warn("⚠️ Response missing success flag:", response);
                    toast.error(
                      response?.message ||
                        "Failed to add property. Please try again."
                    );
                  }
                } catch (err) {
                  console.error("❌ Form submission error:", err);
                  console.error("❌ Error message:", err.message);
                  toast.error(
                    err?.message || "Failed to add property. Please try again."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                handleChange,
                setFieldValue,
                isSubmitting,
                errors,
                touched,
              }) => {
                return (
                  <Form className="space-y-6">
                    {/* Section: Basic Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Basic Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AddRoom_Fields.filter((f) =>
                          [
                            "ownerName",
                            "roomTitle",
                            "contactNumber",
                            "location",
                          ].includes(f.name)
                        ).map((field) => (
                          <FormInput
                            key={field.id}
                            id={field.name}
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                            value={values[field.name]}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Section: Property Details */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Property Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Room Type
                          </label>
                          <Select
                            value={values.type}
                            onValueChange={(val) => {
                              console.log("Selected room type:", val);
                              setFieldValue("type", val);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Room Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROOMTYPE.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {/* Capitalize for display */}
                                  {t
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name="type"
                            component="div"
                            className="text-red-600 text-sm mt-1 font-medium"
                          />
                        </div>

                        <FormInput
                          id="price"
                          name="price"
                          label="Monthly Rent (₹)"
                          type="number"
                          placeholder="Enter amount"
                          onChange={handleChange}
                          value={values.price}
                        />

                        <FormInput
                          id="beds"
                          name="beds"
                          label="Number of Beds"
                          type="number"
                          placeholder="1"
                          onChange={handleChange}
                          value={values.beds}
                        />

                        <FormInput
                          id="bathrooms"
                          name="bathrooms"
                          label="Number of Bathrooms"
                          type="number"
                          placeholder="1"
                          onChange={handleChange}
                          value={values.bathrooms}
                        />
                      </div>

                      {/* Amenities */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Amenities
                        </label>
                        <Popover>
                          <PopoverTrigger className="w-full border border-input rounded-lg p-3 text-left bg-background hover:bg-accent transition-colors flex items-center justify-between">
                            <span
                              className={
                                values.amenities.length > 0
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {values.amenities.length > 0
                                ? values.amenities
                                    .map((a) => {
                                      // Display with better formatting
                                      if (a === "wifi") return "WiFi";
                                      if (a === "AC") return "AC";
                                      if (a === "tv") return "TV";
                                      return (
                                        a.charAt(0).toUpperCase() + a.slice(1)
                                      );
                                    })
                                    .join(", ")
                                : "Select amenities"}
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0">
                            <Command>
                              <CommandInput placeholder="Search amenities..." />
                              <CommandEmpty>No amenities found.</CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-y-auto">
                                {AMENITYOPTIONS.map((item) => (
                                  <CommandItem
                                    key={item}
                                    onSelect={() => {
                                      console.log("Toggling amenity:", item);
                                      if (values.amenities.includes(item)) {
                                        setFieldValue(
                                          "amenities",
                                          values.amenities.filter(
                                            (a) => a !== item
                                          )
                                        );
                                      } else {
                                        setFieldValue("amenities", [
                                          ...values.amenities,
                                          item,
                                        ]);
                                      }
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <div
                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                          values.amenities.includes(item)
                                            ? "bg-purple-600 border-purple-600"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        {values.amenities.includes(item) && (
                                          <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      <span>
                                        {/* Display with better formatting */}
                                        {item === "wifi"
                                          ? "WiFi"
                                          : item === "AC"
                                          ? "Air Conditioning"
                                          : item === "tv"
                                          ? "TV"
                                          : item.charAt(0).toUpperCase() +
                                            item.slice(1)}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <ErrorMessage
                          name="amenities"
                          component="div"
                          className="text-red-600 text-sm mt-1 font-medium"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          placeholder="Describe your property..."
                          onChange={handleChange}
                          value={values.description}
                          className="w-full p-3 border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                          rows={4}
                        />
                      </div>

                      {/* Owner Requirements */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Owner Requirements (Optional)
                        </label>
                        <textarea
                          name="ownerRequirements"
                          placeholder="Any specific requirements for tenants..."
                          onChange={handleChange}
                          value={values.ownerRequirements}
                          className="w-full p-3 border border-input rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Section: Images */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Property Images
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Images
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={(event) =>
                              handleImageChange(event, setFieldValue)
                            }
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-10 h-10 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeImage(index, values, setFieldValue)
                                  }
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
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
                          Listing Property...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          LIST PROPERTY
                        </span>
                      )}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex items-center justify-center gap-8 text-black  text-sm animate-in fade-in duration-700 delay-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure Listing</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Verified Platform</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
