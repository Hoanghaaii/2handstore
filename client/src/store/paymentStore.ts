import { create } from 'zustand';
import axios from 'axios';



interface PaymentState {
    checkoutUrl: string | null;
    checkFinish: boolean;
    isLoading: boolean;
    error: string | null;
    handleCreatePayment: (orderId: string) => Promise<void>; // Chỉ nhận vào orderId
    getPaymentLinkInformation: (orderCode: string) => Promise<string | null>;
    updatePaymentStatus: (orderId: string, paymentStatus: string) => Promise<void>; // Thêm hàm update
    resetPaymentState: () => void;
}

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/payment'
    : '/api/payment';

export const usePaymentStore = create<PaymentState>((set) => ({
    checkoutUrl: null,
    isLoading: false,
    error: null,
    checkFinish: false,

    handleCreatePayment: async (orderId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(`${API_URL}/create-payment-link`, { orderId });

            if (response.data.checkOutUrl) {
                set({ checkoutUrl: response.data.checkOutUrl, isLoading: false });
                window.location.href = response.data.checkOutUrl;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error("Error creating payment link:", error);
            const errorMessage = axios.isAxiosError(error) && error.response 
                ? error.response.data.message 
                : "Có lỗi xảy ra khi tạo link thanh toán.";
            set({
                error: errorMessage,
                isLoading: false,
            });
        }
    },
    getPaymentLinkInformation: async (orderCode) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/get-payment-link`, {
                params: { orderCode },
            });
            set({checkFinish: response.data.status ==='PAID', isLoading: false})
            return response.data; // Trả về dữ liệu nhận được từ server
        } catch (error) {
            console.error("Error fetching payment link:", error);
            throw new Error('Không thể lấy link thanh toán.'); // Ném lỗi nếu có
        }
    },

    // Thêm hàm updatePaymentStatus với URL mới
    updatePaymentStatus: async (orderId, paymentStatus) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.patch(`http://localhost:3001/api/order/${orderId}/payment-status`, { paymentStatus });

            if (response.data.success) { // Kiểm tra phản hồi từ máy chủ
                set({ isLoading: false });
                console.log('Cập nhật trạng thái thanh toán thành công');
            } else {
                throw new Error('Cập nhật trạng thái thanh toán không thành công');
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            const errorMessage = axios.isAxiosError(error) && error.response 
                ? error.response.data.message 
                : "Có lỗi xảy ra khi cập nhật trạng thái thanh toán.";
            set({
                error: errorMessage,
                isLoading: false,
            });
        }
    },

    resetPaymentState: () => set({ checkoutUrl: null, error: null, isLoading: false }),
}));
