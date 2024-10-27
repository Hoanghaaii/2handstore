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
  email: string;
  name: string; // Thêm tên người mua
  avatar: string; // Thêm avatar người mua
}

interface Order {
  _id: string;
  buyer: Buyer;
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentLink: string | null;
  createdAt: Date;
  status: string;
  orderCode: string;
}

interface OrderStore {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  totalOrders: number;
  fetchOrders: () => void;
  fetchOrderById: (id: string) => void;
  placeOrder: (orderData: {
    paymentMethod: string;
    shippingAddress: string;
  }) => void;
  fetchOrderBySeller: () => void; // Phương thức lấy đơn hàng theo người bán
  cancelOrder: (orderId: string) => void; // Phương thức hủy đơn hàng
  updateStatus: (orderId: string, status: string) => Promise<void>; // Cập nhật trạng thái đơn hàng
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
  totalOrders: 0, // Khởi tạo tổng số đơn hàng

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

  // Lấy đơn hàng theo người bán
  fetchOrderBySeller: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-by-seller`, {
        withCredentials: true,
      });
      console.log(response.data);
      set({
        orders: response.data, // Cập nhật danh sách đơn hàng của người bán
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching orders by seller:', error);
      set({ error: 'Failed to fetch orders by seller', loading: false });
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (orderId: string, orderStatus: string): Promise<void> => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`${API_URL}/${orderId}/status`, { orderStatus }, {
        withCredentials: true,
      });

      // Cập nhật danh sách đơn hàng trong state
      set((state) => ({
        orders: state.orders.map(order => 
          order._id === orderId ? { ...order, status: response.data.status } : order
        ),
        loading: false,
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      set({ error: 'Failed to update order status', loading: false });
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi
    }
  },
}));
