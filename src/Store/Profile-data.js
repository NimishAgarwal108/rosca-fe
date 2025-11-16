import { create } from "zustand";
import { persist } from "zustand/middleware";

// ROOM STORE

export const useRoomStore = create(
  persist(
    (set) => ({
      rooms: [],

      // Add room
      addRoom: (newRoom) =>
        set((state) => {
          const id = Date.now(); // Create ID ONCE
          return {
            rooms: [...state.rooms, { ...newRoom, id }],
          };
        }),

      // Update room
      updateRoom: (updatedRoom) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === updatedRoom.id ? updatedRoom : room
          ),
        })),

      // Delete room
      deleteRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== id),
        })),
    }),
    {
      name: "user-rooms",
    }
  )
);

// USER AUTH STORE
export const useAuthStore = create((set) => ({
  user: null, // Initially empty

  setUser: (userData) => set({ user: userData }),

  logout: () => set({ user: null }),
}));
