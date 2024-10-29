"use client";
import React, { useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Cart: React.FC = () => {
  const { cartItems, totalQuantity, totalPrice, loading, fetchCartItems, addCartItem, removeCartItem } = useCartStore();
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  return (
    <div className="relative max-w-2xl mx-auto p-4 rounded-lg shadow-lg border-2">
      {/* Hiển thị overlay khi loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 z-50">
          <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-center">Giỏ hàng của bạn</h2>
      <ul className="space-y-2">
        {cartItems.map((item) => (
          <li key={item.productId} className="flex justify-between items-center p-2 rounded-xl shadow-xl border-2">
            <div className="flex items-center space-x-2">
              <Image src={item.imageUrl[0]} alt="Sản phẩm" width={80} height={80} className="rounded" />
              <div className="space-y-1">
                <p className="text-slate-500 text-sm">
                  <span>Số lượng:</span> <span className="font-semibold dark:text-white text-black">{item.quantity}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
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
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between my-5">
        <p className="text-sm">
          Tổng sp: <span className="font-semibold">{totalQuantity}</span>
        </p>
        <p className="text-sm">
          Tổng giá trị: <span className="font-semibold">{totalPrice.toLocaleString()} VNĐ</span>
        </p>
      </div>
    </div>
  );
};

export default Cart;
