import { create } from 'zustand';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  author: string;
  status?: string;
}

interface ProductStore {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  totalProducts: number; 
  fetchProducts: (page: number, limit: number) => void;
  fetchProductById: (id: string) => void;
  fetchProductsByName: (name: string, page: number, limit: number) => void; // Cập nhật để nhận thêm tham số
  fetchProductsByCategory: (category: string, page: number, limit: number) => void; // Thêm vào đây
}

const API_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/product`
    : '/api/product';

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  product: null,
  loading: true,
  error: null,
  totalProducts: 0, 

  fetchProducts: async (page, limit) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      console.log(response.data)
      set({
        products: response.data.products,
        totalProducts: response.data.totalProducts,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: 'Failed to fetch products', loading: false });
    }
  },
  
  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      set({ product: response.data.product, loading: false });
    } catch (error) {
      console.error('Error fetching product:', error);
      set({ error: 'Failed to fetch product', loading: false });
    }
  },

  fetchProductsByName: async (name: string, page: number, limit: number) => {
    set({ loading: true, error: null });
    try {
        const response = await axios.get(`${API_URL}/search/${name}?page=${page}&limit=${limit}`, {
            withCredentials: true,
        });
        set({
            products: response.data.products, 
            totalProducts: response.data.totalProducts,
            loading: false,
        });
    } catch (error) {
        console.error('Error fetching products by name:', error);
        set({ error: 'Failed to fetch products by name', loading: false });
    }
},
fetchProductsByCategory: async (category: string, page: number, limit: number) => {
  set({ loading: true, error: null });
  try {
      const response = await axios.get(`${API_URL}/get-by-category/${category}?page=${page}&limit=${limit}`, {
          withCredentials: true,
      });
      set({
          products: response.data.products, 
          totalProducts: response.data.totalProducts,
          loading: false,
      });
  } catch (error: any) {
      console.error('Error fetching products by category:', error.response ? error.response.data : error.message);
      set({ error: 'Failed to fetch products by category', loading: false });
  }
},


}));
