// stores/eventStore.ts
import { create } from 'zustand';
import axios from 'axios';

const API_URL = 
  process.env.NODE_ENV === "development" 
    ? `http://localhost:3001/api/event` 
    : 'https://twohandstore.onrender.com/api/events';

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  content: string;
  imageUrl: string;
}

interface EventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  message: string | null;

  fetchEvents: () => Promise<void>;
  fetchEventById: (eventId: string) => Promise<void>; // Thêm hàm này
  addEvent: (eventData: FormData) => Promise<void>;
  updateEvent: (eventId: string, eventData: FormData) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,
  message: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    console.log(process.env.NODE_ENV);
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      set({ events: response.data.events, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error fetching events" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchEventById: async (eventId: string) => { // Cài đặt hàm này
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${eventId}`, { withCredentials: true });
      set({ events: [response.data.event], isLoading: false }); // Cập nhật chỉ sự kiện đó
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error fetching event by ID" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addEvent: async (eventData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, eventData, {
        withCredentials: true, // Gửi cookie
      });
      set({ message: response.data.message, isLoading: false });
      await (useEventStore.getState().fetchEvents()); // Cập nhật danh sách sự kiện sau khi thêm mới
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error adding event" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateEvent: async (eventId: string, eventData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${eventId}`, eventData, {
        withCredentials: true, // Gửi cookie
      });
      set({ message: response.data.message, isLoading: false });
      await (useEventStore.getState().fetchEvents()); // Cập nhật danh sách sự kiện sau khi cập nhật
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error updating event" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteEvent: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/${eventId}`, {
        withCredentials: true, // Gửi cookie
      });
      set({ message: response.data.message, isLoading: false });
      await (useEventStore.getState().fetchEvents()); // Cập nhật danh sách sự kiện sau khi xóa
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? 
        error.response?.data?.message || "Error deleting event" : 
        "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  }
}));
