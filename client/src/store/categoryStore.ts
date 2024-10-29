// store/categoryStore.ts
import { create } from 'zustand';
import axios from 'axios';

const API_URL = 
  process.env.NODE_ENV === "development" 
    ? `http://localhost:3001/api/category` 
    : 'https://twohandstore.onrender.com/api/category'; // Chỉnh sửa ở đây

interface Category {
  id: string;
  name: string;
}

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => Promise<void>; // Đảm bảo hàm này trả về Promise
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  fetchCategories: async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) { // Kiểm tra xem API trả về có thành công hay không
        set({ categories: response.data.categories }); // Lấy categories từ response
      } else {
        console.error('Failed to fetch categories:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
}));
