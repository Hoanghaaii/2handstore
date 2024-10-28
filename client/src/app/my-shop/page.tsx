"use client";
import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { toast } from 'sonner';
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a type for order status counts
type OrderStatusCounts = {
  Pending: number;
  Confirmed: number;
  Shipped: number;
  Delivered: number;
  Cancelled: number;
};

const OrdersPage: React.FC = () => {
  const { orders, loading, error, fetchOrderBySeller, updateStatus, cancelOrder } = useOrderStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('Pending');
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  useEffect(() => {
    // Fetch orders initially
    fetchOrderBySeller();

    // Set up an interval to fetch orders every minute (60000 milliseconds)
    const intervalId = setInterval(() => {
      fetchOrderBySeller();
    }, 60000); // 1 minute

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchOrderBySeller]);

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    if (loading) return;
    const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);

    if (currentIndex === -1 || currentIndex === statuses.length - 1) {
      alert('Trạng thái không hợp lệ hoặc đã ở trạng thái cuối cùng.');
      return;
    }

    const newStatus = statuses[currentIndex + 1];
    if (window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái từ "${currentStatus}" thành "${newStatus}" không?`)) {
      await updateStatus(orderId, newStatus);
      await fetchOrderBySeller();
    }
  };

  const handleCancelOrder = async (orderId: string, currentStatus: string) => {
    if (currentStatus !== 'Pending') {
      alert('Bạn chỉ có thể hủy đơn hàng khi trạng thái là "Pending".');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      await cancelOrder(orderId);
      toast.success('Đơn hàng đã được hủy thành công.');
      await fetchOrderBySeller();
    }
  };

  const filteredOrders = orders.filter(order => 
    order.status === selectedStatus && (
      (order.orderCode.toString().includes(searchQuery)) ||
      (typeof order.buyer.name === 'string' && order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||   // Search by buyer name
      (typeof order.buyer.phoneNumber === 'string' && order.buyer.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
      order.products.some(product => 
        typeof product.productId.name === 'string' && 
        product.productId.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) // Search by product name
      )
    )
  );

  const deliveredOrders = orders.filter(order => order.status === 'Delivered');
  const deliveredCount = deliveredOrders.length;
  const totalAmount = deliveredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  
  // Initialize orderCounts with type OrderStatusCounts
  const orderCounts: OrderStatusCounts = {
    Pending: orders.filter(order => order.status === 'Pending').length,
    Confirmed: orders.filter(order => order.status === 'Confirmed').length,
    Shipped: orders.filter(order => order.status === 'Shipped').length,
    Delivered: orders.filter(order => order.status === 'Delivered').length,
    Cancelled: orders.filter(order => order.status === 'Cancelled').length,
  };

  return (
    <div className="max-w-full mx-auto p-8 shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">Shop Của Tôi</h1>
        <div className="text-right mb-4 items-start flex flex-col">
          <p className="font-medium">Số đơn hàng đã hoàn thành: <span className="font-semibold text-green-500">{deliveredCount}</span></p>
          <p className="font-medium">Tổng tiền đã thu được: <span className="font-semibold text-green-500">{totalAmount.toLocaleString()} VNĐ</span></p>
        </div>
      </div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng theo ID, tên người mua, số điện thoại hoặc tên sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 space-x-4">
        {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg ${
              selectedStatus === status ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-200 text-gray-700 dark:bg-slate-900 dark:text-white'
            }`}
          >
            {status} ({orderCounts[status as keyof OrderStatusCounts]})
          </button>
        ))}
      </div>

      {/* Order List */}
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center mt-10">No orders found for {selectedStatus}.</div>
      ) : (
        <ul className="space-y-8">
          {filteredOrders.map(order => (
            <li key={order._id} className="border dark:border-gray-200 border-black rounded-lg shadow-lg p-6 dark:bg-slate-900 bg-slate-100 flex flex-col space-y-4">
              {/* Order Details */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Đơn hàng ID: {order.orderCode}</h2>
                <div>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
              </div>

              <div className="flex gap-6">
                {/* Buyer Information */}
                <div className="flex-1 space-y-2 flex items-center">
                  <Image
                    src={order.buyer.avatar || "/default-avatar.jpg"}
                    alt="Avatar của người mua"
                    width={100}
                    height={100}
                    className="object-contain rounded-2xl mr-5"
                  />
                  <div>
                    <p className="font-medium">Người mua: {order.buyer.name}</p>
                    <p>Email: {order.buyer.email}</p>
                    <p>Số điện thoại: {order.buyer.phoneNumber}</p>
                    <p>Địa chỉ: {order.shippingAddress}</p>
                    <p>Phương thức thanh toán: {order.paymentMethod}</p>
                    <p>
                      Trạng thái đơn hàng: 
                      <span className={`font-semibold ml-2 ${
                        order.status === 'Pending' ? 'text-gray-500' :
                        order.status === 'Confirmed' ? 'text-blue-500' :
                        order.status === 'Shipped' ? 'text-orange-500' :
                        order.status === 'Delivered' ? 'text-green-500' :
                        'text-red-500'
                      }`}>
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="border-l-2 border-gray-500"></div>

                {/* Product List */}
                <ScrollArea className="h-[300px] flex-1 dark:border-slate-200 border-black border">
                  {order.products.map(product => (
                    <div key={product.productId._id} className="flex items-center gap-4 border p-3 shadow-sm bg-slate-200 dark:bg-slate-800">
                      <Image
                        src={`${product.productId.imageUrl}` || "/default-product.jpg"}
                        alt={product.productId.name || "Product image"}
                        width={80}
                        height={80}
                        className="rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Mã sp: {product.productId._id}</p>
                        <p className="font-semibold">Tên sp: {product.productId.name}</p>
                        <p>Số lượng: {product.quantity}</p>
                        <p>Giá: {product.price} VNĐ</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div className="flex justify-between mt-4 space-x-4 items-center">
                <p className="flex items-center">Total: <span className="font-semibold text-2xl ml-2">{order.totalAmount} VNĐ</span></p>
                <div className="flex items-center space-x-4">
                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        onClick={() => handleStatusUpdate(order._id, order.status)}
                      >
                        {selectedStatus === 'Pending' ? 'Xác nhận đơn' :
                         selectedStatus === 'Confirmed' ? 'Bắt đầu giao hàng' :
                         selectedStatus === 'Shipped' ? 'Hoàn thành đơn' : 'Update Status'}
                      </button>
                      {order.status === 'Pending' && (
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                          onClick={() => handleCancelOrder(order._id, order.status)}
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
