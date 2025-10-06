import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // Signup with additional fields
  signup: async ({ name, email, password, aadharNumber, phone, role }) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/signup", { 
        name, 
        email, 
        password, 
        aadharNumber, 
        phone,
        role 
      });
      
      set({ loading: false });
      toast.success("Registration successful! Please check your email for verification OTP.");
      return { success: true, userId: res.data.userId };
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred during registration");
      return { success: false };
    }
  },

  // Verify OTP
  verifyOTP: async (userId, otp) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/verify-otp", { userId, otp });
      set({ user: res.data.user, loading: false });
      toast.success("Email verified successfully!");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP");
      return { success: false };
    }
  },

  // Resend OTP
  resendOTP: async (userId) => {
    set({ loading: true });

    try {
      await axios.post("/auth/resend-otp", { userId });
      set({ loading: false });
      toast.success("OTP resent successfully. Please check your email.");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      return { success: false };
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true });
    
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
      toast.success("Login successful!");
      console.log(res.data.user)
      return { success: true };
    } catch (error) {
      console.log(error);
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred during login");
      return { success: false };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    set({ loading: true });

    try {
      await axios.post("/auth/forgot-password", { email });
      set({ loading: false });
      toast.success("If the email exists, a password reset link has been sent");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send reset email");
      return { success: false };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    set({ loading: true });

    try {
      await axios.post("/auth/reset-password", { token, newPassword });
      set({ loading: false });
      toast.success("Password reset successfully");
      return { success: true };
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
      return { success: false };
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // Check authentication status - FIXED
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/me");
      if (response.data.success) {
        set({ user: response.data.user });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.log("Error in checkAuth:", error.message);
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  // Set user manually
  setUser: (user) => {
    set({ user });
  }
}));