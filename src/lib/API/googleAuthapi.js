// src/lib/API/googleAuthapi.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

console.log('🔗 API Base URL:', API_BASE_URL);

/**
 * Get Google OAuth URL from backend
 */
export const getGoogleAuthUrl = async () => {
  try {
    const url = `${API_BASE_URL}/auth/google/url`;
    console.log('📡 Requesting Google Auth URL from:', url);
    
    const response = await axios.get(url);
    console.log('✅ Response:', response.data);
    
    if (!response.data || !response.data.url) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error getting Google auth URL:', error);
    console.error('❌ API_BASE_URL being used:', API_BASE_URL);
    console.error('❌ Error details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to initiate Google authentication');
  }
};

/**
 * Handle successful Google OAuth callback
 * Fetches user data and stores it like manual login does
 * @param {string} token - JWT token from backend
 */
export const handleGoogleCallback = async (token) => {
  try {
    console.log('💾 Processing Google callback with token...');
    
    // Store the auth token
    localStorage.setItem('authToken', token);
    
    // Fetch user data from your backend using the token
    const userResponse = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (userResponse.data && userResponse.data.user) {
      // Store user data exactly like manual login does
      localStorage.setItem("user", JSON.stringify(userResponse.data.user));
      localStorage.setItem("userLoggedIn", "true");
      
      console.log('✅ User data stored successfully:', userResponse.data.user);
      
      return {
        success: true,
        user: userResponse.data.user,
        token: token
      };
    } else {
      throw new Error('User data not found in response');
    }
    
  } catch (error) {
    console.error('❌ Error handling Google callback:', error);
    
    // Clean up on error
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userLoggedIn');
    
    throw new Error(error.response?.data?.message || 'Failed to complete authentication');
  }
};

/**
 * Alternative: If your backend returns user data with the token in the callback URL
 * Use this version if user data comes in the callback directly
 */
export const handleGoogleCallbackWithUserData = async (token, userData) => {
  try {
    console.log('💾 Storing Google auth data...');
    
    // Store token
    localStorage.setItem('authToken', token);
    
    // Store user data exactly like manual login does
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userLoggedIn", "true");
    
    console.log('✅ Authentication data stored successfully');
    
    return {
      success: true,
      user: userData,
      token: token
    };
  } catch (error) {
    console.error('❌ Error storing auth data:', error);
    throw error;
  }
};