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
  createdAt: Date;
}

interface ProductStore {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  totalProducts: number; 
  fetchProducts: (page: number, limit: number) => void;
  fetchProductById: (id: string) => void;
  fetchProductsByName: (name: string, page: number, limit: number) => void;
  fetchProductsByCategory: (category: string, page: number, limit: number) => void;
  fetchProductsByOwner: () => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<void>;
  setProductQuantityToZero: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>; // Thêm phương thức deleteProduct
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
    } catch (error) {
      console.error('Error fetching products by category:', error);
      set({ error: 'Failed to fetch products by category', loading: false });
    }
  },

  fetchProductsByOwner: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-by-owner`, {
        withCredentials: true,
      });
      set({
        products: response.data,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching products by owner:', error);
      set({ error: 'Failed to fetch products by owner', loading: false });
    }
  },

  updateProduct: async (id: string, updatedData: Partial<Product>) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/update-product/${id}`, updatedData, {
        withCredentials: true,
      });
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? { ...product, ...updatedData } : product
        ),
        product: state.product?._id === id ? { ...state.product, ...updatedData } : state.product,
        loading: false,
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      set({ error: 'Failed to update product', loading: false });
    }
  },

  setProductQuantityToZero: async (id: string) => {
    set({ loading: true, error: null });
    try {
        const updatedData = { quantity: 0, status: 'sold' }; // Set quantity to 0 and status to 'Sold'
        const response = await axios.put(`${API_URL}/update-product/${id}`, updatedData, { withCredentials: true });
        
        set((state) => ({
            products: state.products.map((product) =>
                product._id === id ? { ...product, quantity: 0, status: 'Sold' } : product // Update both quantity and status
            ),
            loading: false,
        }));
    } catch (error) {
        console.error('Error updating product quantity and status:', error);
        set({ error: 'Failed to update product quantity and status', loading: false });
    }
},


  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/delete-product/${id}`, { withCredentials: true }); // Gọi API để xóa sản phẩm
      set((state) => ({
        products: state.products.filter((product) => product._id !== id), // Cập nhật danh sách sản phẩm
        loading: false,
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      set({ error: 'Failed to delete product', loading: false });
    }
  }
}));
