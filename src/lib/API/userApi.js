const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://rosca-be.vercel.app/api";

export async function signupUser(userData) {
  try {
    console.log("📝 Signing up user:", userData.email);

    const response = await fetch(`${baseUrl}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Signup failed:", errorData);
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await response.json();
    console.log("✅ Signup successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Signup error:", error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    console.log("🔐 Logging in user:", credentials.email);

    const response = await fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Login failed:", errorData);
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store user data in localStorage
    if (data.success && data.user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ User data saved to localStorage");
      }
    }

    console.log("✅ Login successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

export async function forgotPassword(emailData) {
  try {
    console.log("📧 Requesting password reset for:", emailData.email);

    const response = await fetch(`${baseUrl}/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Forgot password failed:", errorData);
      throw new Error(errorData.message || "Forgot password request failed");
    }

    const data = await response.json();
    console.log("✅ Password reset email sent:", data);
    return data;
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    throw error;
  }
}

export async function verifyOtp(otpData) {
  try {
    console.log("🔢 Verifying OTP for:", otpData.email);

    const response = await fetch(`${baseUrl}/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otpData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ OTP verification failed:", errorData);
      throw new Error(errorData.message || "OTP verification failed");
    }

    const data = await response.json();
    console.log("✅ OTP verified successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    throw error;
  }
}

export async function resetPassword(resetData) {
  try {
    console.log("🔒 Resetting password");

    const response = await fetch(`${baseUrl}/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Password reset failed:", errorData);
      throw new Error(errorData.message || "Password reset failed");
    }

    const data = await response.json();
    console.log("✅ Password reset successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Reset password error:", error);
    throw error;
  }
}

export function getCurrentUser() {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("❌ Error getting current user:", error);
      return null;
    }
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    console.log("👋 User logged out");
  }
}
