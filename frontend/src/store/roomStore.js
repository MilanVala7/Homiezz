import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useRoomStore = create((set, get) => ({
  rooms: [],
  userRooms: [],
  requestedRooms: [],
  receivedRequests: [],
  currentRoom: null,
  loading: false,
  error: null,
  pagination: null,

  getRooms: async (filters = {}) => {
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const res = await axios.get(`/rooms?${queryParams}`);
      set({ 
        rooms: res.data.data, 
        pagination: res.data.pagination,
        loading: false 
      });
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to fetch rooms");
      return { success: false };
    }
  },

  getRoomById: async (roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/rooms/${roomId}`);
      
      if (response.data.success) {
        set({ currentRoom: response.data.data, loading: false });
        return { success: true, data: response.data.data };
      } else {
        set({ error: response.data.message, loading: false });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to fetch room");
      return { success: false, message: errorMessage };
    }
  },

  createRoom: async (roomData) => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.post("/rooms", roomData);
      set(state => ({ 
        userRooms: [...state.userRooms, res.data.data],
        loading: false 
      }));
      toast.success("Room created successfully!");
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to create room");
      return { success: false };
    }
  },

  getUserRooms: async () => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get("/rooms/my-rooms");
      set({ userRooms: res.data.data, loading: false });
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to fetch your rooms");
      return { success: false };
    }
  },

  updateRoom: async (roomId, roomData) => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.put(`/rooms/${roomId}`, roomData);
      set(state => ({
        userRooms: state.userRooms.map(room => 
          room._id === roomId ? res.data.data : room
        ),
        rooms: state.rooms.map(room => 
          room._id === roomId ? res.data.data : room
        ),
        currentRoom: state.currentRoom?._id === roomId ? res.data.data : state.currentRoom,
        loading: false
      }));
      toast.success("Room updated successfully!");
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to update room");
      return { success: false };
    }
  },

  deleteRoom: async (roomId) => {
    set({ loading: true, error: null });
    
    try {
      await axios.delete(`/rooms/${roomId}`);
      set(state => ({
        userRooms: state.userRooms.filter(room => room._id !== roomId),
        rooms: state.rooms.filter(room => room._id !== roomId),
        currentRoom: state.currentRoom?._id === roomId ? null : state.currentRoom,
        loading: false
      }));
      toast.success("Room deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to delete room");
      return { success: false };
    }
  },

  getAvailableCities: async () => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get("/rooms/cities/available");
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to fetch cities");
      return { success: false };
    }
  },

  // Request related functions - using axios consistently
  requestRoom: async (roomId, message) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/rooms/${roomId}/request`, { message });
      
      toast.success("Room request sent successfully!");
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to send room request");
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  getRequestedRooms: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/rooms/requests/sent");
      set({ requestedRooms: res.data.data || [], loading: false });
      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to fetch sent requests");
      return { success: false, message: errorMessage };
    }
  },

  getReceivedRequests: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/rooms/requests/received");
      set({ receivedRequests: res.data.data || [], loading: false });
      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to fetch received requests");
      return { success: false, message: errorMessage };
    }
  },

  acceptRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/rooms/requests/${requestId}/accept`);
      
      // Refresh received requests after accepting
      await get().getReceivedRequests();
      toast.success("Request accepted successfully!");
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to accept request");
      return { success: false, message: errorMessage };
    }
  },

  rejectRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/rooms/requests/${requestId}/reject`);
      
      // Refresh received requests after rejecting
      await get().getReceivedRequests();
      toast.success("Request rejected successfully!");
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to reject request");
      return { success: false, message: errorMessage };
    }
  },

  cancelRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/rooms/requests/${requestId}/cancel`);
      
      // Refresh requested rooms after cancelling
      await get().getRequestedRooms();
      toast.success("Request cancelled successfully!");
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to cancel request");
      return { success: false, message: errorMessage };
    }
  },

  clearCurrentRoom: () => {
    set({ currentRoom: null });
  },

  clearError: () => {
    set({ error: null });
  },

  clearRooms: () => {
    set({ 
      rooms: [],
      userRooms: [],
      requestedRooms: [],
      receivedRequests: [],
      currentRoom: null,
      pagination: null
    });
  },

  resetLoading: () => {
    set({ loading: false });
  }
}));