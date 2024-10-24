'use client'; // Đảm bảo đây là component client

import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/orderStore'; // Đường dẫn đến file order.store.ts
import Image from 'next/image'; // Nhập Image từ Next.js
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../components/ui/table'; // Import các component từ UI Table
import { Button } from '@/components/ui/button';
import { FaCaretDown } from "react-icons/fa";

const Order = () => {
  const { orders, loading, error, fetchOrders, cancelOrder } = useOrderStore(); // Thêm cancelOrder
  const [openOrderId, setOpenOrderId] = useState<string | null>(null); // Trạng thái cho dropdown

  useEffect(() => {
    fetchOrders(); // Gọi hàm để lấy danh sách đơn hàng khi component được mount
  }, [fetchOrders]);

  const toggleDropdown = (orderId: string) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId)); // Thay đổi trạng thái mở dropdown
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      await cancelOrder(orderId); // Gọi hàm hủy đơn hàng từ store
      fetchOrders(); // Tải lại danh sách đơn hàng
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p> {/* Hiển thị loading */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p> {/* Hiển thị lỗi nếu có */}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Danh sách đơn hàng mua</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <Table>
          <TableHeader className=''>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Địa chỉ giao hàng</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <TableRow>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell>{order.totalAmount}đ</TableCell>
                  <TableCell>{order.shippingAddress}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  {/* Thay đổi màu của text trạng thái dựa trên trạng thái của đơn hàng */}
                  <TableCell> 
                    <span
                      className={`${
                        order.status === 'Pending'
                          ? 'text-blue-500'
                          : order.status === 'Cancelled'
                          ? 'text-red-500'
                          : order.status === 'Completed'
                          ? 'text-green-500'
                          : ''
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 justify-end"> {/* Sử dụng justify-end để căn sang phải */}
                      {/* Kiểm tra trạng thái, chỉ hiển thị nút "Hủy đơn hàng" nếu trạng thái là "Pending" */}
                      {order.status === 'Pending' && (
                        <Button
                          onClick={() => handleCancelOrder(order._id)}
                          className=" bg-red-200 hover:bg-red-300 dark:bg-red-900 dark:hover:bg-red-800 text-black dark:text-white"
                        >
                          Hủy
                        </Button>
                      )}
                      <Button
                        onClick={() => toggleDropdown(order._id)}
                        className="flex items-center text-black bg-slate-300 dark:text-white dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700 ml-auto" // Sử dụng ml-auto để đẩy nút dropdown sang phải
                      >
                        <FaCaretDown className={`${openOrderId === order._id ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {openOrderId === order._id && ( // Kiểm tra nếu dropdown đang mở cho order này
                  <TableRow className='bg-slate-300 dark:bg-slate-800 hover:bg-slate-300'>
                    <TableCell colSpan={7} className='rounded-2xl'> {/* Căn chỉnh cột cho đúng */}
                      <div className="">
                        <ul className="list-disc">
                          {order.products.map((product) => (
                            <li key={product.productId._id} className="flex items-center space-x-2 my-5 border-2 shadow-sm shadow-blue-500 border-slate-500 rounded-2xl p-5"  >
                              {product.productId.imageUrl ? (
                                <Image
                                  src={`${product.productId.imageUrl}`}
                                  alt={product.productId.name}
                                  width={100} // Chiều rộng ảnh
                                  height={100} // Chiều cao ảnh
                                  className="rounded" // Thêm border-radius
                                />
                              ) : (
                                <span className="text-gray-500">Không có ảnh</span>
                              )}
                              <div>
                                <p>Sản phẩm: {product.productId.name}</p>
                                <p className="font-medium">Số lượng: {product.quantity}</p>
                                <p>Người bán: {product.author}</p>
                              </div>

                            </li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Order;
