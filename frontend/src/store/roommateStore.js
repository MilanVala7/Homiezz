import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useRoommateStore = create((set, get) => ({
  // State
  roommates: [],
  currentRoommate: null,
  userRoommateProfile: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    location: '',
    minBudget: 8000,
    maxBudget: 20000,
    gender: '',
    occupationType: '',
    lifestyle: [],
    interests: [],
    sortBy: 'newest'
  },

  // Get roommates with filters
  getRoommates: async (filters = {}) => {
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams();
      
      // Merge with existing filters
      const searchFilters = { ...get().filters, ...filters };
      
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              queryParams.append(key, value.join(','));
            }
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const res = await axios.get(`/roommates?${queryParams}`);
      
      set({ 
        roommates: res.data.data?.roommates || [],
        pagination: res.data.data?.pagination,
        filters: searchFilters,
        loading: false 
      });
      
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to fetch roommates");
      return { success: false };
    }
  },

  // Get single roommate by ID
  getRoommateById: async (roommateId) => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get(`/roommates/${roommateId}`);
      
      if (res.data.success) {
        set({ currentRoommate: res.data.data, loading: false });
        return { success: true, data: res.data.data };
      } else {
        set({ error: res.data.message, loading: false });
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to fetch roommate");
      return { success: false, message: errorMessage };
    }
  },

  // Get user's roommate profile
  getUserRoommateProfile: async () => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get("/user/roommate-profile");
      
      set({ 
        userRoommateProfile: res.data.data,
        loading: false 
      });
      
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to fetch roommate profile");
      return { success: false };
    }
  },

  // Create or update roommate profile
  updateRoommateProfile: async (profileData) => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.put("/user/roommate-profile", profileData);
      
      set({ 
        userRoommateProfile: res.data.data,
        loading: false 
      });
      
      toast.success("Roommate profile updated successfully!");
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to update roommate profile");
      return { success: false };
    }
  },

  // Toggle profile active status
  toggleRoommateProfile: async (isActive) => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.patch("/user/roommate-profile/active", { isActive });
      
      // Update local state if successful
      if (get().userRoommateProfile) {
        set({ 
          userRoommateProfile: {
            ...get().userRoommateProfile,
            roommateProfile: {
              ...get().userRoommateProfile.roommateProfile,
              isActive
            }
          },
          loading: false 
        });
      }
      
      toast.success(`Roommate profile ${isActive ? 'activated' : 'deactivated'} successfully!`);
      return { success: true, data: res.data };
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message });
      toast.error(error.response?.data?.message || "Failed to toggle roommate profile");
      return { success: false };
    }
  },

  // Send roommate request/message
  sendRoommateMessage: async (roommateId, message) => {
    set({ loading: true, error: null });
    
    try {
      const res = await axios.post(`/roommates/${roommateId}/message`, { message });
      
      toast.success("Message sent successfully!");
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage || "Failed to send message");
      return { success: false, message: errorMessage };
    }
  },

  // Set filters
  setFilters: (filters) => {
    set(state => ({ 
      filters: { ...state.filters, ...filters } 
    }));
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        location: '',
        minBudget: 8000,
        maxBudget: 20000,
        gender: '',
        occupationType: '',
        lifestyle: [],
        interests: [],
        sortBy: 'newest'
      }
    });
  },

  // Clear current roommate
  clearCurrentRoommate: () => {
    set({ currentRoommate: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Clear all roommates data
  clearRoommates: () => {
    set({ 
      roommates: [],
      currentRoommate: null,
      userRoommateProfile: null,
      pagination: null
    });
  },

  // Reset loading
  resetLoading: () => {
    set({ loading: false });
  }
}));