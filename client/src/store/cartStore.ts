import { create } from 'zustand';
import axios from 'axios';

interface CartItem {
  productId: string; // ID sản phẩm
  quantity: number; // Số lượng sản phẩm
  price: number; // Giá sản phẩm
  imageUrl: string[]; // Mảng các hình ảnh của sản phẩm
  productName: string; // Tên sản phẩm
}

interface CartStore {
  cartItems: CartItem[]; // Danh sách sản phẩm trong giỏ hàng
  totalQuantity: number; // Tổng số lượng sản phẩm
  totalPrice: number; // Tổng giá
  loading: boolean; // Trạng thái loading
  error: string | null; // Lỗi nếu có
  fetchCartItems: () => void; // Hàm lấy sản phẩm trong giỏ hàng
  addCartItem: (productId: string, quantity: number, price: number, imageUrl: string[], productName: string) => void; // Hàm thêm sản phẩm vào giỏ hàng
  removeCartItem: (productId: string) => void; // Hàm xóa sản phẩm khỏi giỏ hàng
}

const API_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/cart`
    : 'https://twohandstore.onrender.com/api/cart';

// Hàm tính toán tổng số lượng và tổng giá
const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalQuantity, totalPrice };
};

export const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,

  fetchCartItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      // Kiểm tra cấu trúc dữ liệu trả về từ API
      console.log('API response:', response.data);

      // Gán cartItems từ thuộc tính cart
      const cartItems: CartItem[] = response.data.cart?.items.map((item: { productId: string; productName: string; quantity: number; price: number; imageUrl: string[]; }) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl // Lưu hình ảnh là mảng
      })) || []; // Gán mảng rỗng nếu không có cartItems

      console.log(cartItems);
      
      // Tính toán tổng số lượng và tổng giá
      const { totalQuantity, totalPrice } = calculateTotals(cartItems);
      
      set({
        cartItems: cartItems,
        loading: false,
        totalQuantity,
        totalPrice,
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      set({ error: 'Failed to fetch cart items', loading: false });
    }
  },

  addCartItem: async (productId, quantity, price, imageUrl, productName) => {
    set({ loading: true, error: null });
    try {
      // Gửi yêu cầu POST tới backend để thêm sản phẩm vào giỏ hàng
      const response = await axios.post(
        `${API_URL}/add`, 
        { productId, quantity, price, imageUrl, productName }, // Gửi cả imageUrl
        { withCredentials: true }
      );
      console.log(response)
  
      if (response.data.success) {
        const cartItems: CartItem[] = response.data.cart?.items.map((item: { productId: string; quantity: number; price: number; imageUrl: string[]; productName: string; }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl, // Lưu hình ảnh là mảng
          productName: item.productName
        })) || [];
        
        // Tính toán tổng số lượng và tổng giá
        const { totalQuantity, totalPrice } = calculateTotals(cartItems);
        
        set({
          cartItems: cartItems,
          totalQuantity,
          totalPrice,
          loading: false,
          error: null, // Xóa lỗi nếu thêm sản phẩm thành công
        });
      } else {
        set({ error: response.data.message, loading: false }); // Hiển thị lỗi từ backend
      }
    } catch (error) {
      console.log(error)
      console.error('Có lỗi xảy ra: vượt quá số lượng!');
      set({ error: 'Có lỗi xảy ra: vượt quá số lượng trong kho!', loading: false });
    }
  },
  
  removeCartItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      // Gửi yêu cầu DELETE tới backend để xóa sản phẩm khỏi giỏ hàng
      const response = await axios.delete(
        `${API_URL}/remove/${productId}`,
        { withCredentials: true }
      );
  
      // Cập nhật lại giỏ hàng trong state với dữ liệu từ backend
      const cartItems: CartItem[] = response.data.cart?.items.map((item: { productId: string; quantity: number; price: number; imageUrl: string[]; }) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl // Lưu hình ảnh là mảng
      })) || [];
  
      // Tính toán tổng số lượng và tổng giá
      const { totalQuantity, totalPrice } = calculateTotals(cartItems);
  
      // Cập nhật trạng thái giỏ hàng
      set({
        cartItems: cartItems,
        totalQuantity,
        totalPrice,
        loading: false,
      });
  
    } catch (error) {
      console.error('Error removing item from cart:', error);
      set({ error: 'Failed to remove item from cart', loading: false });
    }
  },
}));
