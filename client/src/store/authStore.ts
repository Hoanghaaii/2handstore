import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 
  process.env.NODE_ENV === "development" 
    ? `http://localhost:3001/api/auth` 
    : 'https://twohandstore.onrender.com/api/auth';

console.log(API_URL);

interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  isVerified: boolean;
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
  getUserById: (userId: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
}

const setupAxiosInterceptors = () => {
  // Set the token in the headers for every request
  axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const useAuthStore = create<AuthState>((set) => {
  // Setup Axios interceptors
  setupAxiosInterceptors();

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    message: null,
    getUserById: async (userId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}/get-user-by-id/${userId}`);
        set({ user: response.data.user, isLoading: false });
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Error fetching user"
          : "An unknown error occurred";
        set({ error: errorMessage, isLoading: false });
      }
    },
    signup: async (email, password, name) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/signup`, { email, password, name });
        set({ user: response.data.user, token: response.data.token, isAuthenticated: true, isLoading: false });
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? "Có lỗi xảy ra trong quá trình đăng ký"
          : "Có lỗi không xác định xảy ra";
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
        console.log('Response from sign in:', response);
    
        const { user, token } = response.data; // Giải nén user và token từ phản hồi

        // Log the extracted token to verify it's correct
        console.log('Extracted token:', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
        Cookies.set('token', token, { expires: expirationDate, secure: true, sameSite: 'Lax' });
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
        Cookies.remove('token'); // Xóa cookie token
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
      try {
        const response = await axios.get(`${API_URL}/check-auth`, {
          withCredentials: true, // Đảm bảo rằng cookie được gửi kèm theo yêu cầu
        });
        console.log(response)
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error('Error during checkAuth:', error);
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
        const response = await axios.put(`${API_URL}/update-account/${userId}`, accountData, {
          withCredentials: true,
        });
        set({ message: response.data.message, isLoading: false });
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Error updating account"
          : "An unknown error occurred";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },
    resendVerificationCode: async (email) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/resend-verify-email`, { email });
        set({ message: response.data.message, isLoading: false });
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Lỗi khi gửi mã xác thực"
          : "Đã có lỗi không xác định xảy ra";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    }
  };
});
