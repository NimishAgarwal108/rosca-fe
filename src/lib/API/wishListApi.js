// lib/API/wishlistApi.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

/**
 * Get user's wishlist
 */
export const getWishlist = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch wishlist");
    }

    return data;
  } catch (error) {
    console.error("Get wishlist error:", error);
    throw error;
  }
};

/**
 * Add room to wishlist
 * @param {string} roomId - The ID of the room to add
 */
export const addToWishlist = async (roomId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/add/${roomId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to wishlist");
    }

    return data;
  } catch (error) {
    console.error("Add to wishlist error:", error);
    throw error;
  }
};

/**
 * Remove room from wishlist
 * @param {string} roomId - The ID of the room to remove
 */
export const removeFromWishlist = async (roomId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/remove/${roomId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove from wishlist");
    }

    return data;
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    throw error;
  }
};

/**
 * Clear entire wishlist
 */
export const clearWishlist = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/clear`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to clear wishlist");
    }

    return data;
  } catch (error) {
    console.error("Clear wishlist error:", error);
    throw error;
  }
};

/**
 * Check if a room is in user's wishlist
 * @param {string} roomId - The ID of the room to check
 */
export const checkInWishlist = async (roomId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/wishlist/check/${roomId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to check wishlist");
    }

    return data;
  } catch (error) {
    console.error("Check wishlist error:", error);
    throw error;
  }
};

/**
 * Toggle wishlist status (add if not in wishlist, remove if already in wishlist)
 * @param {string} roomId - The ID of the room
 * @param {boolean} isInWishlist - Current wishlist status
 */
export const toggleWishlist = async (roomId, isInWishlist) => {
  try {
    if (isInWishlist) {
      return await removeFromWishlist(roomId);
    } else {
      return await addToWishlist(roomId);
    }
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    throw error;
  }
};

// Export all functions as default object as well
export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkInWishlist,
  toggleWishlist,
};
