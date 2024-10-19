import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie'
const API_URL = 
  process.env.NODE_ENV === "development" 
    ? `http://localhost:3001/api/auth` 
    : '/api/auth';
console.log(API_URL)
interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  verified: boolean;
  age: number;
  gender: string;
  avatar: string | null;
}
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  
  signup: (email: string, password: string, name: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  updateAccount: (id: string, accountData: FormData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ user: response.data.user, token: response.data.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error signing up" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

    signin: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Cookie hết hạn sau 7 ngày
          const response = await axios.post(`${API_URL}/signin`, { email, password });
          const { user, token } = response.data; // Giải nén user và token từ phản hồi
          set({user, token, isAuthenticated: true, isLoading: false });
          // Sau khi đăng nhập thành công
          Cookies.set('token', token, { expires: expirationDate }); // Lưu cookie token vào máy tính

      } catch (error) {
          const errorMessage = axios.isAxiosError(error) ? 
              error.response?.data?.message || "Error logging in" : 
              "An unknown error occurred";
          set({ error: errorMessage, isLoading: false });
          throw error;
      }
  },


  signout: async () => {
    set({ isLoading: true, error: null });
    try {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Lax'; // Xóa cookie token
      set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error logging out" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, token: response.data.token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error verifying email" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });

    // Không cần lấy token từ cookie, vì backend sẽ tự động lấy token từ cookie
    try {
        const response = await axios.get(`${API_URL}/check-auth`, {
            withCredentials: true, // Đảm bảo rằng cookie được gửi kèm theo yêu cầu
            headers: {
                'Content-Type': 'application/json'
            }
        });
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
        console.error('Error during checkAuth:', error); // Log lỗi để kiểm tra
        const errorMessage = axios.isAxiosError(error) ? 
            error.response?.data?.message || "Error checking authentication" : 
            "An unknown error occurred";
        set({ error: errorMessage, isLoading: false, isAuthenticated: false });
    }
},



  

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error sending reset password email" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  resetPassword: async (password) => {
    set({ isLoading: true, error: null });
    try {
      const token = new URLSearchParams(window.location.search).get('token');
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error resetting password" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
  updateAccount: async (userId, accountData) => {
    set({ isLoading: true, error: null });
    try {
      const token = Cookies.get('token');
      console.log(token)
      if(!token) throw new Error
      const response = await axios.put(`${API_URL}/update-account/${userId}`, accountData, {
        withCredentials: true,
      }); // Pass the user ID in the URL
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Error updating account"
        : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  }
  
}));
