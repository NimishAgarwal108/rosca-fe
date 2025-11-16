const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function getAllRooms() {
  try {
    const response = await fetch(`${baseUrl}/rooms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch rooms');
    }
    
    return response.json();
  } catch (error) {
    console.error('Get all rooms error:', error);
    throw error;
  }
}

export async function getRoomById(id) {
  try {
    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch room');
    }
    
    return response.json();
  } catch (error) {
    console.error('Get room by ID error:', error);
    throw error;
  }
}

export async function addRoom(roomData) {
  try {
    const response = await fetch(`${baseUrl}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add room');
    }
    
    return response.json();
  } catch (error) {
    console.error('Add room error:', error);
    throw error;
  }
}

export async function updateRoom(id, roomData) {
  try {
    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update room');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update room error:', error);
    throw error;
  }
}

export async function deleteRoom(id) {
  try {
    const response = await fetch(`${baseUrl}/rooms/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete room');
    }
    
    return response.json();
  } catch (error) {
    console.error('Delete room error:', error);
    throw error;
  }
}