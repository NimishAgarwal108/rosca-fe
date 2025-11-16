"use client";

import FormInput from "@/components/custom/input-field";
import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { AddRoom_Fields } from "@/Store/AddRooms_Fields";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ErrorMessage, Form, Formik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { AMENITYOPTIONS, ROOMTYPE, NAVIGATION_ROUTES } from "../../constant";
import { addRoom } from "@/lib/API/roomApi";

export default function AddRoom() {
  const validationSchema = Yup.object({
    title: Yup.string()
      .trim()
      .required("Title is required")
      .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and numbers allowed"),

    location: Yup.string()
      .trim()
      .required("Location is required")
      .matches(/^[a-zA-Z0-9\s,]+$/, "Letters, numbers and commas only"),

    price: Yup.number()
      .typeError("Only numbers allowed")
      .min(0, "Price cannot be negative")
      .required("Room price is required"),

    roomType: Yup.string().required("Room Type is required"),

    amenities: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one amenity"),

    contact: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be 10 digits")
      .required("Phone number is required"),

    owner: Yup.string()
      .trim()
      .matches(/^[a-zA-Z\s]+$/, "Only letters allowed")
      .required("Owner Name is required"),
  });

  const initialValues = {
    title: "",
    location: "",
    price: "",
    roomType: "",
    amenities: [],
    beds: "",
    baths: "",
    description: "",
    ownerDemands: "",
    contact: "",
    owner: "",
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const roomData = {
        title: values.title,
        location: values.location,
        price: values.price,
        roomType: values.roomType,
        amenities: values.amenities,
        beds: values.beds || 1,
        baths: values.baths || 1,
        description: values.description,
        ownerDemands: values.ownerDemands,
        contact: values.contact,
        owner: values.owner,
      };

      const response = await addRoom(roomData);

      if (response.success) {
        toast.success("Room added successfully!");
        resetForm();

        setTimeout(() => {
          window.location.href = NAVIGATION_ROUTES.USER_PROFILE || "/user-profile";
        }, 1200);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add room. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-b from-orange-300 via-pink-400 to-purple-600 py-4">
      <div>
        <Typography variant="h2" className="text-center">
          Listing Property
        </Typography>
      </div>
      <div className="w-full max-w-2xl p-10 bg-white/60 backdrop-blur-md border border-black/40 rounded-2xl shadow-2xl mx-4 m-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-3">
              {AddRoom_Fields.filter(
                (field) =>
                  !["roomType", "amenities", "media"].includes(field.name)
              ).map((field) => {
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
                    min="0"
                  />
                );
              })}

              {/* DROPDOWN FOR ROOM TYPE */}
              <div>
                <label className="font-small text-gray-800">Room Type</label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-small"
                    >
                      {values.roomType || "Select Room Type"}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-full p-2 bg-white shadow-md border rounded-md cursor-pointer">
                    <DropdownMenuRadioGroup
                      value={values.roomType}
                      onValueChange={(value) =>
                        setFieldValue("roomType", value)
                      }
                    >
                      {ROOMTYPE.map((type) => (
                        <DropdownMenuRadioItem key={type} value={type}>
                          {type}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ErrorMessage
                  name="roomType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* MULTI SELECT FOR AMENITIES */}
              <div>
                <label className="font-small text-gray-800">Amenities</label>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-small"
                    >
                      {values.amenities.length
                        ? values.amenities.join(", ")
                        : "Select Amenities"}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-full p-2 bg-white shadow-md border rounded-md cursor-pointer">
                    {AMENITYOPTIONS.map((item) => (
                      <DropdownMenuCheckboxItem
                        key={item}
                        checked={values.amenities.includes(item)}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFieldValue("amenities", [
                              ...values.amenities,
                              item,
                            ]);
                          } else {
                            setFieldValue(
                              "amenities",
                              values.amenities.filter((am) => am !== item)
                            );
                          }
                        }}
                      >
                        {item}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <ErrorMessage
                  name="amenities"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                {isSubmitting ? "Adding Property..." : "ADD PROPERTY"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}