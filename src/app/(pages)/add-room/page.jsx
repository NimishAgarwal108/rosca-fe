"use client";

import { AMENITYOPTIONS, NAVIGATION_ROUTES, ROOMTYPE } from "@/app/constant";
import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { addRoom } from "@/lib/API/roomApi";
import { AddRoom_Fields } from "@/Store/AddRooms_Fields";
import { ErrorMessage, Form, Formik } from "formik";
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
  images: [], // Added here for Formik to track image files
};

export default function AddRoom() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600 py-6">
      <div>
        <Typography variant="h2" className="text-center">
          Listing Property
        </Typography>
      </div>

      <div className="w-full max-w-2xl p-8 bg-white/60 backdrop-blur-md border border-black/40 rounded-2xl shadow-2xl mx-4 my-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
              // Build FormData object for multipart/form-data submission
              const formData = new FormData();
              formData.append("roomTitle", values.roomTitle.trim());
              formData.append("location", values.location.trim());
              formData.append("price", Number(values.price));
              formData.append("type", values.type);
              formData.append("beds", Number(values.beds) || 1);
              formData.append("bathrooms", Number(values.bathrooms) || 1);
              formData.append("description", values.description?.trim() || "");
              formData.append(
                "ownerRequirements",
                values.ownerRequirements?.trim() || ""
              );
              formData.append("contactNumber", values.contactNumber);
              formData.append("ownerName", values.ownerName.trim());
              values.amenities.forEach((amenity) =>
                formData.append("amenities", amenity)
              );

              // Append images to formData if any
              if (values.images && values.images.length > 0) {
                Array.from(values.images).forEach((file) =>
                  formData.append("images", file)
                );
              }

              console.log("Sending payload with images:", values);

              // call API with FormData
              const response = await addRoom(formData);

              if (response && response.success) {
                toast.success("Room added successfully!");
                resetForm();
                // redirect after short delay
                setTimeout(() => {
                  window.location.href =
                    NAVIGATION_ROUTES?.USER_PROFILE || "/user-profile";
                }, 1000);
              } else {
                toast.error(
                  response?.message || "Failed to add room. Please try again."
                );
              }
            } catch (err) {
              console.error("Add room error:", err);
              toast.error(
                err?.message || "Failed to add room. Please try again."
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => {
            return (
              <Form className="space-y-4">
                {/* Map fields (excluding type, amenities, and file fields) */}
                {AddRoom_Fields.map((field) => {
                  if (field.name === "amenities") return null;

                  if (field.type === "file") {
                    return (
                      <div key={field.id}>
                        <label className="font-medium">{field.label}</label>
                        <input
                          type="file"
                          name={field.name}
                          multiple
                          accept="image/*"
                          onChange={(event) =>
                            setFieldValue(field.name, event.currentTarget.files)
                          }
                          className="w-full p-2 border rounded-md"
                        />
                        <ErrorMessage
                          name={field.name}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    );
                  }

                  if (field.type === "textarea") {
                    return (
                      <div key={field.id}>
                        <label className="font-medium">{field.label}</label>
                        <textarea
                          name={field.name}
                          placeholder={field.placeholder}
                          onChange={handleChange}
                          value={values[field.name]}
                          className="w-full p-2 border rounded-md"
                          rows={3}
                        />
                        <ErrorMessage
                          name={field.name}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    );
                  }

                  return (
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
                  );
                })}

                {/* Room Type - shadcn Select */}
                <div>
                  <label className="font-medium">Room Type</label>
                  <Select
                    value={values.type}
                    onValueChange={(val) => setFieldValue("type", val)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select Room Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOMTYPE.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Amenities - popover + command (multi-select) */}
                <div>
                  <label className="font-medium">Amenities</label>
                  <Popover>
                    <PopoverTrigger className="w-full border p-2 rounded-md text-left">
                      {values.amenities.length > 0
                        ? values.amenities.join(", ")
                        : "Select amenities"}
                    </PopoverTrigger>

                    <PopoverContent className="w-60 p-0">
                      <Command>
                        <CommandInput placeholder="Search amenities..." />
                        <CommandEmpty>No amenities found.</CommandEmpty>

                        <CommandGroup>
                          {AMENITYOPTIONS.map((item) => (
                            <CommandItem
                              key={item}
                              onSelect={() => {
                                if (values.amenities.includes(item)) {
                                  setFieldValue(
                                    "amenities",
                                    values.amenities.filter((a) => a !== item)
                                  );
                                } else {
                                  setFieldValue("amenities", [
                                    ...values.amenities,
                                    item,
                                  ]);
                                }
                              }}
                            >
                              {item}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <ErrorMessage
                    name="amenities"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {isSubmitting ? "Adding Property..." : "ADD PROPERTY"}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
