"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useRef, useState } from "react";

export default function NavBar({
  onRoomTypeChange,
  onPriceChange,
  onSetLocation,
}) {
  const triggerRef = useRef(null);

  const [selectedRoom, setSelectedRoom] = useState("Room Type");

  const handleSelect = (value) => {
    setSelectedRoom(value);
    onRoomTypeChange(value); // update state for reactive UI
  };

  const [selectedPrice, setSelectedPrice] = useState("Price Range");

  const handlePriceSelect = (value) => {
    setSelectedPrice(value); // update state for reactive UI
    onPriceChange(value);
  };

  return (
    <>
      <div className="filter-bar flex items-center gap-6 justify-center m-5">
        {/* Search Input */}
        <div className="relative w-[700px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search properties & locations..."
            className="pl-10"
          />
        </div>

        <div className="w-60 mx-auto">
          <DropdownMenu>
            <DropdownMenuTrigger ref={triggerRef} className="dropdown-trigger">
              <span>{selectedRoom}</span>
              <ChevronDown className="h-4 w-4 text-gray-700" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="dropdown-content">
              <DropdownMenuItem
                className="dropdown-item"
                onSelect={() => handleSelect("All")}
              >
                ALL
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handleSelect("Boy's PG")}
              >
                Boy's PG
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handleSelect("Girl's PG")}
              >
                Girl's PG
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handleSelect("Independent Room")}
              >
                Independent Room
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handleSelect("Sharing Room")}
              >
                Sharing Room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-50 mx-auto">
          <DropdownMenu>
            <DropdownMenuTrigger ref={triggerRef} className="dropdown-trigger">
              <span>{selectedPrice}</span>
              <ChevronDown className="h-4 w-4 text-gray-700" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="dropdown-content">
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handlePriceSelect("ALL")}
              >
                ALL
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handlePriceSelect("10k-20k")}
              >
                Rs 10000 - Rs 20000
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handlePriceSelect("20k-40k")}
              >
                Rs 20000 - Rs 40000
              </DropdownMenuItem>
              <DropdownMenuItem
                className=" dropdown-item"
                onSelect={() => handlePriceSelect("40k+")}
              >
                Rs 40000+
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
