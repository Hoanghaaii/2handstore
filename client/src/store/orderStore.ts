import { create } from 'zustand';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface OrderProduct {
  productId: Product;
  quantity: number;
  price: number;
  author: string;
}
interface Buyer {
  email: string; // Hoặc các thuộc tính khác mà bạn muốn lưu trữ
  // Thêm các thuộc tính khác nếu cần
}

interface Order {
  _id: string;
  buyer: Buyer;
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  status: string;
}

interface OrderStore {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  totalOrders: number; // Thêm thuộc tính này để lưu tổng số đơn hàng
  fetchOrders: () => void;
  fetchOrderById: (id: string) => void;
  placeOrder: (orderData: {
    paymentMethod: string;
    shippingAddress: string;
    
  }) => void;
  cancelOrder: (orderId: string) => void; // Phương thức hủy đơn hàng
}

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/order'
    : '/api/order';

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  order: null,
  loading: true,
  error: null,
  totalOrders: 0, // Khởi tạo totalOrders

  // Lấy tất cả đơn hàng
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/all-orders`, {
        withCredentials: true,
      });
      console.log(response.data);
      set({
        orders: response.data.orders,
        totalOrders: response.data.totalOrders, // Giả sử API trả về tổng số đơn hàng
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  // Lấy đơn hàng theo ID
  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      set({ order: response.data.order, loading: false }); // Giả sử API trả về thông tin đơn hàng
    } catch (error) {
      console.error('Error fetching order:', error);
      set({ error: 'Failed to fetch order', loading: false });
    }
  },

  // Đặt đơn hàng
  placeOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      // Chỉ truyền paymentMethod và shippingAddress theo yêu cầu của backend
      const { paymentMethod, shippingAddress } = orderData;
  
      const response = await axios.post(API_URL, {
        paymentMethod,
        shippingAddress,
      }, {
        withCredentials: true,
      });
  
      set((state) => ({
        orders: [...state.orders, response.data.order], // Thêm đơn hàng mới vào danh sách
        loading: false,
      }));
    } catch (error) {
      console.error('Error placing order:', error);
      set({ error: 'Failed to place order', loading: false });
    }
  },
  
  // Hủy đơn hàng
  cancelOrder: async (orderId: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${orderId}`, {
        withCredentials: true,
      });
      set((state) => ({
        orders: state.orders.filter(order => order._id !== orderId), // Xóa đơn hàng khỏi danh sách
        loading: false,
      }));
    } catch (error) {
      console.error('Error canceling order:', error);
      set({ error: 'Failed to cancel order', loading: false });
    }
  },
}))