"use client";

import { ErrorMessage, Field } from "formik";
import { Input } from "../ui/input";

export default function FormInput({ label, name, type, placeholder }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Field
        as={Input}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full"
      />

      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-600"
      />
    </div>
  );
}
