"use client";

import About from "@/components/custom/about";
import Footer from "@/components/custom/footer";
import HostHeader from "@/components/custom/host_header";
import NavBar from "@/components/custom/navbar";
import { useState } from "react";
import Main from "../../../components/custom/Main";

export default function Page() {
  const [roomType, setRoomType] = useState("All Types");
  const [priceRange, setPriceRange] = useState("Any Budget");
  const [location, setLocation] = useState("");

  return (
    <div className="mt-20">
      <HostHeader />

      <NavBar
        onRoomTypeChange={setRoomType}
        onPriceChange={setPriceRange}
        onSetLocation={setLocation}
      />

      <Main roomType={roomType} priceRange={priceRange} location={location} />
      <About />
      <Footer id="footer" />
    </div>
  );
}
