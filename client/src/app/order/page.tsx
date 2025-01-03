'use client'; // Đảm bảo đây là component client

import React, { useEffect, useState } from 'react';
import { FiAlertTriangle } from "react-icons/fi";
import { useOrderStore } from '../../store/orderStore'; // Đường dẫn đến file order.store.ts
import { usePaymentStore } from '../../store/paymentStore'; // Import paymentStore
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
import { useRouter } from 'next/navigation'; // Import useRouter từ Next.js

const Order = () => {
  const { orders, order, loading, error, fetchOrders, cancelOrder, fetchOrderById } = useOrderStore(); // Thêm fetchOrderById
  const { checkoutUrl, handleCreatePayment } = usePaymentStore(); // Sử dụng paymentStore
  const [openOrderId, setOpenOrderId] = useState<string | null>(null); // Trạng thái cho dropdown
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const router = useRouter(); // Khởi tạo router
  
  useEffect(() => {
    fetchOrders(); // Gọi hàm để lấy danh sách đơn hàng khi component được mount
  }, [fetchOrders]);

  const toggleDropdown = (orderId: string) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId)); // Thay đổi trạng thái mở dropdown
  };

  const handlePayment = async (orderId: string) => {
    try {
        await fetchOrderById(orderId);
        let paymentLink = order?.paymentLink;

        if (!paymentLink) {
            await handleCreatePayment(orderId);
            paymentLink = checkoutUrl;
        }

        if (paymentLink) {
            router.push(paymentLink);
        } else {
            throw new Error("Không thể tạo link thanh toán.");
        }
    } catch (error) {
        console.error("Error in handlePayment:", error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      await cancelOrder(orderId);
      fetchOrders();
    }
  };

  // Filter orders based on the search term
  const filteredOrders = orders.filter(order => {
    const matchesOrderCode = order.orderCode.toString().includes(searchTerm.toLowerCase().trim());
    const matchesShippingAddress = typeof order.shippingAddress === 'string' && order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase().trim());
    
    const matchesProductName = order.products.some(product => {
      // Ensure productId and name are defined before calling toLowerCase()
      const productName = product.productId?.name; // Optional chaining
      return productName && productName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    });
  
    return matchesOrderCode || matchesShippingAddress || matchesProductName;
  });
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Danh sách đơn hàng mua</h2>
      <h2 className="m-3 mb-5 flex items-center text-red-300 text-sm">
        <FiAlertTriangle />Chú ý: nếu muốn huỷ đơn hàng, hãy bấm nút huỷ ở chính trang này, đừng bấm huỷ ở trang mã qr thanh toán!!!
      </h2>
      {/* Search Input Field */}
      <div className="mb-8 flex items-center justify-center mx-5 rounded-3xl">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng, địa chỉ hoặc tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-2xl w-full"
        />
      </div>
      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order Code</TableHead>
              <TableHead>Địa chỉ giao hàng</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order._id}>
                <TableRow>
                  <TableCell className="font-medium">{order.orderCode}</TableCell>
                  <TableCell>{order.shippingAddress}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell className={`${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{order.paymentStatus}</TableCell>
                  <TableCell> 
                    <span
                      className={`${
                        order.status === 'Pending'
                          ? 'text-gray-500'
                          : order.status === 'Cancelled'
                          ? 'text-red-500'
                          : order.status === 'Delivered'
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
                  <TableCell 
                    className={`font-bold text-lg`}
                  >
                    {order.totalAmount.toLocaleString()} đ
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 justify-end"> {/* Sử dụng justify-end để căn sang phải */}
                    {order.paymentMethod === 'Banking' && order.paymentStatus === 'Pending' && order.status !== 'Cancelled' && (
                        <Button
                            onClick={() => handlePayment(order._id)} // Gọi hàm handlePayment
                            className="bg-green-400 hover:bg-green-500 dark:bg-green-900 dark:hover:bg-green-800 text-black dark:text-white"
                        >
                            Thanh toán
                        </Button>
                    )}

                      {order.status === 'Pending' && order.paymentStatus!=='Paid' && (
                        <Button
                          onClick={() => handleCancelOrder(order._id)}
                          className=" bg-red-400 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-800 text-black dark:text-white"
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
