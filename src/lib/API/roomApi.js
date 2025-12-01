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

// ✅ Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ✅ Get all rooms (public)
export async function getAllRooms() {
  try {
    console.log("🔍 Fetching rooms from:", `${baseUrl}/rooms`);

    const response = await fetch(`${baseUrl}/rooms`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
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

// ✅ Get room by ID (for viewing details)
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

// ✅ Get user's rooms
export async function getUserRooms() {
  try {
    console.log("🏠 Fetching user rooms...");
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${baseUrl}/rooms/user/my-rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to fetch user rooms:", errorData);
      throw new Error(errorData.message || "Failed to fetch user rooms");
    }

    const data = await response.json();
    console.log("✅ User rooms fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Get user rooms error:", error);
    throw error;
  }
}

// ✅ Add new room
export async function addRoom(formData) {
  try {
    console.log("📤 ═══════════════════════════════════════");
    console.log("📤 Sending room data to:", `${baseUrl}/rooms`);

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log("📤", pair[0], ":", pair[1]);
    }
    console.log("📤 ═══════════════════════════════════════");

    const token = getAuthToken();
    console.log("🔑 Token found:", token ? "Yes ✅" : "No ❌");

    if (!token) {
      throw new Error("No authentication token found. Please login.");
    }

    const response = await fetch(`${baseUrl}/rooms`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
      // DO NOT set Content-Type header; browser sets it automatically for multipart/form-data
    });

    console.log("📥 Response status:", response.status);

    // Get the response text first to see what we're working with
    const responseText = await response.text();
    console.log("📥 Raw response:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || "Unknown server error" };
      }
      
      console.error("❌ ═══════════════════════════════════════");
      console.error("❌ Server returned error status:", response.status);
      console.error("❌ Error details:", errorData);
      console.error("❌ ═══════════════════════════════════════");
      
      throw new Error(errorData.message || `Server Error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    console.log("✅ Room added successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ ═══════════════════════════════════════");
    console.error("❌ Add room error:", error.message);
    console.error("❌ ═══════════════════════════════════════");
    throw error;
  }
}

// ✅ Update existing room (for Edit Modal)
export async function updateRoom(id, roomData) {
  try {
    console.log("🔄 ═══════════════════════════════════════");
    console.log("🔄 Updating room ID:", id);
    console.log("🔄 Update data:", roomData);
    
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found. Please login.");
    }

    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(roomData),
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to update room:", errorData);
      throw new Error(errorData.message || "Failed to update room");
    }

    const data = await response.json();
    console.log("✅ Room updated successfully:", data);
    console.log("🔄 ═══════════════════════════════════════");
    return data;
  } catch (error) {
    console.error("❌ Update room error:", error);
    throw error;
  }
}

// ✅ Update room with images (alternative method if images need to be updated)
export async function updateRoomWithImages(id, formData) {
  try {
    console.log("🔄 Updating room with images, ID:", id);
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found. Please login.");
    }

    // Log FormData contents
    for (let pair of formData.entries()) {
      console.log("📤 Update field:", pair[0], ":", pair[1]);
    }

    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
        // DO NOT set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to update room with images:", errorData);
      throw new Error(errorData.message || "Failed to update room");
    }

    const data = await response.json();
    console.log("✅ Room with images updated successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Update room with images error:", error);
    throw error;
  }
}

// ✅ Delete room
export async function deleteRoom(id) {
  try {
    console.log("🗑 ═══════════════════════════════════════");
    console.log("🗑 Deleting room ID:", id);
    
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found. Please login.");
    }

    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to delete room:", errorData);
      throw new Error(errorData.message || "Failed to delete room");
    }

    const data = await response.json();
    console.log("✅ Room deleted successfully:", data);
    console.log("🗑 ═══════════════════════════════════════");
    return data;
  } catch (error) {
    console.error("❌ Delete room error:", error);
    throw error;
  }
}

// ✅ Search/Filter rooms (optional - if you want search functionality)
export async function searchRooms(query) {
  try {
    console.log("🔎 Searching rooms with query:", query);

    const params = new URLSearchParams(query);
    const response = await fetch(`${baseUrl}/rooms?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to search rooms");
    }

    const data = await response.json();
    console.log("✅ Search results:", data);
    return data;
  } catch (error) {
    console.error("❌ Search rooms error:", error);
    throw error;
  }
}