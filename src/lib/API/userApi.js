// src/lib/API/userApi.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rosca-be.vercel.app/api';

console.log('🔗 User API Base URL:', API_BASE_URL);

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Create axios instance with auth headers
const createAuthInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

/**
 * Get current user info
 */
export const getCurrentUserInfo = async () => {
  try {
    console.log('🔍 Fetching current user info...');
    
    const instance = createAuthInstance();
    const response = await instance.get('/users/me');
    
    console.log('✅ User info fetched:', response.data.user);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user info:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user info');
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file to upload
 */
export const uploadProfilePicture = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('📤 Uploading profile picture...', file.name);

    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${API_BASE_URL}/users/upload-profile-picture`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Profile picture uploaded successfully:', response.data);
    
    // Update user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('authToken', response.data.token || token);
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error uploading profile picture:', error);
    console.error('❌ Error details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
  }
};

/**
 * Update user type (host/user)
 * @param {string} userType - 'host' or 'user'
 */
export const updateUserType = async (userType) => {
  try {
    if (!['host', 'user'].includes(userType)) {
      throw new Error('Invalid user type');
    }

    console.log('🔄 Updating user type to:', userType);

    const instance = createAuthInstance();
    const response = await instance.patch('/users/update-user-type', {
      userType,
    });

    console.log('✅ User type updated:', response.data);
    
    // Update user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error('❌ Error updating user type:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user type');
  }
};

/**
 * Get user's rooms
 */
export const getUserRooms = async () => {
  try {
    console.log('🏠 Fetching user rooms...');

    const instance = createAuthInstance();
    const response = await instance.get('/rooms/user/my-rooms');

    console.log('✅ User rooms fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user rooms:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user rooms');
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    console.log('👋 Logging out user...');

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userLoggedIn');
      console.log('✅ User logged out successfully');
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error during logout:', error);
    throw error;
  }
};