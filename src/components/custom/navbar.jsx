"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export default function NavBar({
  onRoomTypeChange = () => {},
  onPriceChange = () => {},
  onSetLocation = () => {},
}) {
  const triggerRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState("All Types");
  const [selectedPrice, setSelectedPrice] = useState("Any Budget");
  const [location, setLocation] = useState("");

  const handleRoomType = (value) => {
    setSelectedRoom(value);
    onRoomTypeChange(value);
  };

  const handlePriceSelect = (value) => {
    setSelectedPrice(value);
    onPriceChange(value);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    onSetLocation(value);
  };

  const handleSearch = () => {
    console.log("Searching rooms: ", {
      location,
      selectedRoom,
      selectedPrice,
    });
  };
  const ROOM_TYPE = [
    "All Types",
    "Single Room",
    "Double Room",
    "Shared Room",
    "Apartment",
    "Flat",
  ];
  const ROOM_BUDGED = [
    "All Prices",
    "Below ₹3000",
    "₹3000 - ₹6000",
    "₹6000 - ₹10000",
    "Above ₹10000",
  ];

  return (
    <section className="w-full max-w-8xl px-6 mx-auto my-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Location Input */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block ">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={handleLocationChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Room Type Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block ">
              Room Type
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger
                ref={triggerRef}
                className="w-full p-3 flex items-center justify-between border rounded-xl hover:bg-gray-50 "
              >
                {selectedRoom} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full ">
                {ROOM_TYPE.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => handleRoomType(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Price Dropdown */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Price Range
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-full p-3 flex items-center justify-between border rounded-xl hover:bg-gray-50">
                {selectedPrice} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full">
                {ROOM_BUDGED.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => handlePriceSelect(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
}
