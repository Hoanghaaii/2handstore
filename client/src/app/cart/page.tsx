"use client";
import React, { useEffect, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Import toast từ Sonner
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { useRouter } from "next/navigation";

const Cart: React.FC = () => {
  const router = useRouter()
  const {
    cartItems,
    totalQuantity,
    totalPrice,
    loading,
    error,
    fetchCartItems,
    addCartItem,
    removeCartItem,
  } = useCartStore();

  const { user } = useAuthStore(); // Lấy thông tin người dùng từ authStore
  const [address, setAddress] = useState(user?.address || ""); // Thiết lập địa chỉ từ user
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là thanh toán khi nhận hàng
  const { placeOrder } = useOrderStore(); 
  
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn trống!");
      return;
    }
  
    if (!address) {
      toast.error("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }
  
    try {
      const orderData = {
        paymentMethod,
        shippingAddress: address,
      };
  
      // Gọi hàm placeOrder từ orderStore
      await placeOrder(orderData);
  
      // Thông báo thành công và làm sạch giỏ hàng
      toast.success("Đặt hàng thành công!");
      // Sau khi đặt hàng thành công, có thể làm sạch giỏ hàng
      fetchCartItems(); // Cập nhật lại giỏ hàng
      router.push('/order')
    } catch (error) {
      console.error(error);
      toast.error( "Có lỗi xảy ra khi đặt hàng.");
    }
  };
  
  return (
    <div className="relative max-w-4xl mx-auto p-6 rounded-lg shadow-lg border-2">
      {/* Hiển thị overlay khi loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 z-50">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4 text-center">Giỏ hàng của bạn</h2>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item.productId} className="flex justify-between items-center p-4 rounded-3xl shadow-xl border-2">
            <div className="flex items-center space-x-4">
              <Image src={item.imageUrl[0]} alt="Sản phẩm" width={100} height={100} className="rounded" />
              <div className="space-y-2">
                <p className="text-3xl font-semibold my-5"> {item.productName}</p>
                <p className="text-slate-500">
                  <span>Số lượng:</span> <span className="font-semibold dark:text-white text-black">{item.quantity}</span>
                </p>
                <p className="text-slate-500">
                  <span>Giá:</span> <span className="font-semibold dark:text-white text-black">{item.price.toLocaleString()} VNĐ</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="bg-red-400 rounded-lg text-black dark:text-white hover:bg-red-500 dark:hover:bg-red-500 transition hover:scale-105 duration-300 dark:bg-red-600"
                onClick={() =>
                  item.quantity > 1
                    ? addCartItem(item.productId, -1, item.price, item.imageUrl, item.productName) // Giảm số lượng
                    : removeCartItem(item.productId) // Xóa sản phẩm nếu số lượng về 0
                }
              >
                -
              </Button>
              <Button
                className="bg-green-400 dark:hover:bg-green-500 rounded-lg text-black dark:text-white hover:bg-green-500 transition hover:scale-105 duration-300 dark:bg-green-600"
                onClick={() => addCartItem(item.productId, 1, item.price, item.imageUrl, item.productName)} // Tăng số lượng
              >
                +
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between my-4">
        <p className="text-lg">
          Tổng số lượng sản phẩm: <span className="font-semibold">{totalQuantity}</span>
        </p>
        <p className="text-lg">
          Tổng giá trị: <span className="font-semibold">{totalPrice.toLocaleString()} VNĐ</span>
        </p>
      </div>

      {/* Phần nhập địa chỉ */}
      <div className="my-4">
        <label className="block text-lg font-semibold mb-2">Địa chỉ giao hàng:</label>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Nhập địa chỉ của bạn"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phần chọn phương thức thanh toán */}
      <div className="my-4">
        <label className="block text-lg font-semibold mb-2">Phương thức thanh toán:</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="COD" // Giá trị thống nhất
              checked={paymentMethod === "COD"}
              onChange={handlePaymentMethodChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="Banking" // Giá trị thống nhất
              checked={paymentMethod === "Banking"}
              onChange={handlePaymentMethodChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span>Chuyển khoản ngân hàng</span>
          </label>
        </div>

      </div>

      <div className="flex justify-center">
        <Button
          onClick={handlePlaceOrder} // Thêm sự kiện onClick gọi hàm handlePlaceOrder
          className="dark:bg-slate-800 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 dark:text-white text-black rounded-lg p-2"
        >
          Đặt hàng
        </Button>
      </div>
    </div>
  );
};

export default Cart;
