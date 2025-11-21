"use client";

import { cn } from "../../lib/utils";

// Define all variants
export const typographyVariants = {
  h1: "font-primary text-4xl md:text-5xl font-bold text-slate-800 leading-tight tracking-tight animate-fadeSlide",
  h2: "font-primary text-3xl font-semibold text-indigo-800 mt-6 mb-3 tracking-tight",
  h3: "font-primary text-xl font-semibold text-gray-600 mb-3",
  h4: "font-primary text-2xl md:text-2xl font-bold text-slate-800 leading-tight tracking-tight animate-fadeSlide",
  brand:
    "font-primary text-2xl font-bold text-indigo-600 tracking-wide animate-fadeSlide hover:text-indigo-700 transition-all",
  nav: "font-secondary text-base font-medium text-gray-700 transition-all hover:text-indigo-600 hover:scale-105",
  navActive:
    "font-secondary text-base font-semibold text-indigo-600 border-b-2 border-indigo-600",

  body: "font-primary text-base text-gray-700 leading-relaxed",
  bodyMuted: "font-primary text-sm text-gray-500",
  highlight:
    "font-primary text-lg font-medium text-indigo-700 bg-indigo-50 border-l-4 border-indigo-600 rounded-md py-3 px-4 text-center",

  link: "cursor-pointer",
  linkPrimary:
    "font-primary text-indigo-600 font-semibold transition-all hover:text-indigo-700",
  linkSecondary:
    "font-primary text-gray-800 font-medium hover:text-indigo-600 underline",

  buttonPrimary:
    "font-primary font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg py-3 px-6 transition-all shadow-md cursor-pointer",
  buttonSecondary:
    "font-primary font-medium text-gray-900 bg-amber-400 hover:bg-amber-500 rounded-lg py-3 px-6 transition-all shadow-md mt-4",
  buttonHighLight:
    "block w-full text-center bg-blue-600 text-white py-3 rounded mb-4 hover:bg-blue-700 transition cursor-pointer",
  btnGoogle:
    "w-full flex items-center justify-center border border-red-500 text-red-600 font-semibold py-2 rounded transition-all duration-100 hover:bg-red-500 hover:text-white cursor-pointer select-none",
  btnFacebook:
    "w-full flex items-center justify-center border border-blue-600 text-blue-600 font-semibold py-2 rounded transition-all duration-100 hover:bg-blue-700 hover:text-black cursor-pointer select-none",
  btn: "block w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition cursor-pointer text-center",

  paraPrimary:
    "font-primary text-base md:text-lg text-gray-700 leading-relaxed text-justify max-w-3xl mx-auto animate-fadeInUp",
  paraSecondary:
    "font-primary text-m text-gray-700 leading-relaxed text-left opacity-90 animate-fadeIn",
  paraHighLight:
    "font-primary text-lg font-medium text-indigo-700 text-center bg-indigo-50 border-l-4 border-indigo-600 rounded-md py-3 px-4 animate-popIn",
};

//Typography component with `as` prop
export function Typography({
  as: Component = "span",
  variant = "body",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(typographyVariants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
