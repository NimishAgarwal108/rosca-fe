const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function signupUser(userData) {
  try {
    const response = await fetch(`${baseUrl}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Signup failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store user data in localStorage
    if (data.success && data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function forgotPassword(emailData) {
  try {
    const response = await fetch(`${baseUrl}/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Forgot password request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export async function verifyOtp(otpData) {
  try {
    const response = await fetch(`${baseUrl}/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otpData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'OTP verification failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

export async function resetPassword(resetData) {
  try {
    const response = await fetch(`${baseUrl}/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resetData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Password reset failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}