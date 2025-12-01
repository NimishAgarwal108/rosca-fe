const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://rosca-be.vercel.app/api";

// Helper function to get the base URL without /api suffix for static assets
export const getServerBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "")
    : "https://rosca-be.vercel.app";
};

// Helper function to construct full image URL from path
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If imagePath already starts with http, return as is
  if (imagePath.startsWith("http")) return imagePath;
  // Otherwise, prepend server base URL
  return `${getServerBaseUrl()}${imagePath}`;
};

export async function getAllRooms() {
  try {
    console.log("🔍 Fetching rooms from:", `${baseUrl}/rooms`);

    const response = await fetch(`${baseUrl}/rooms `, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Disable caching for dynamic data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to fetch rooms:", errorData);
      throw new Error(errorData.message || "Failed to fetch rooms");
    }

    const data = await response.json();
    console.log("✅ Rooms fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Get all rooms error:", error);
    throw error;
  }
}

export async function getRoomById(id) {
  try {
    console.log("🔍 Fetching room by ID:", id);

    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to fetch room:", errorData);
      throw new Error(errorData.message || "Failed to fetch room");
    }

    const data = await response.json();
    console.log("✅ Room fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Get room by ID error:", error);
    throw error;
  }
}

export async function addRoom(formData) {
  try {
    console.log("📤 ═══════════════════════════════════════");
    console.log("📤 Sending room data to:", `${baseUrl}/rooms`);

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log("📤", pair[0], ":", pair[1]);
    }
    console.log("📤 ═══════════════════════════════════════");

    const response = await fetch(`${baseUrl}/rooms`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type header; browser sets it automatically for multipart/form-data
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Server error:", errorData);
      throw new Error(errorData.message || "Failed to add room");
    }

    const data = await response.json();
    console.log("✅ Success:", data);
    return data;
  } catch (error) {
    console.error("❌ Add room error:", error);
    throw error;
  }
}

export async function updateRoom(id, roomData) {
  try {
    console.log("🔄 Updating room:", id);

    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to update room:", errorData);
      throw new Error(errorData.message || "Failed to update room");
    }

    const data = await response.json();
    console.log("✅ Room updated successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Update room error:", error);
    throw error;
  }
}

export async function deleteRoom(id) {
  try {
    console.log("🗑 Deleting room:", id);

    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to delete room:", errorData);
      throw new Error(errorData.message || "Failed to delete room");
    }

    const data = await response.json();
    console.log("✅ Room deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Delete room error:", error);
    throw error;
  }
}
