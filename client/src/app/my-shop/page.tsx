"use client";
import React, { useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const OrdersPage: React.FC = () => {
  const { orders, loading, error, fetchOrderBySeller, updateStatus, cancelOrder } = useOrderStore();

  useEffect(() => {
    fetchOrderBySeller();
  }, [fetchOrderBySeller]);

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    if (loading) {
      return <div className="text-center mt-10">Loading...</div>;
    }

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

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center mt-10">No orders found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm đã đặt hàng</h1>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order._id} className="border rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold">Đơn hàng ID: {order.orderCode}</h2>
            <p>Tổng số tiền: <span className="font-bold">{order.totalAmount} VNĐ</span></p>
            <p>Người mua: {order.buyer.name}</p>
            <p>Email: {order.buyer.email}</p>
            <p>{order.buyer.avatar}</p>

            <p>Địa chỉ giao hàng: {order.shippingAddress}</p>
            <p>Phương thức thanh toán: {order.paymentMethod}</p>
            <div className='flex'>
              <p>Trạng thái thanh toán: </p>
              <p className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'} mx-2`}>
                {order.paymentStatus}
              </p>
            </div>
            <div className='flex'>
              <p>Trạng thái đơn hàng: </p>
              <p className={`font-semibold ${order.status === 'Pending' ? 'text-blue-500' : 'text-red-500'} mx-2`}>
                {order.status}
              </p>
            </div>
            <h3 className="text-lg font-medium mt-4">Sản phẩm trong đơn hàng:</h3>
            <ul className="space-y-4">
              {order.products.map((product) => (
                <li key={product.productId._id} className="flex items-center border rounded-md p-2 bg-gray-800">
                  <img
                    src={product.productId.imageUrl}
                    alt={product.productId.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="font-semibold">{product.productId.name}</p>
                    <p className="text-gray-600">Số lượng: {product.quantity}</p>
                    <p className="text-gray-600">Giá: {product.price} VNĐ</p>
                    <p className="text-gray-600">Tác giả: {product.author}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex mt-4 space-x-4">
              {/* Hiển thị thông báo nếu đơn hàng đã bị hủy hoặc đã hoàn thành */}
              {order.status === 'Cancelled' ? (
                <span className="text-red-500 font-semibold">Đơn hàng đã bị hủy</span>
              ) : order.status === 'Delivered' ? (
                <span className="text-green-500 font-semibold">Đơn hàng đã thành công</span>
              ) : (
                <>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleStatusUpdate(order._id, order.status)}
                  >
                    {(() => {
                      const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
                      const currentIndex = statuses.indexOf(order.status);
                      return currentIndex !== -1 && currentIndex < statuses.length - 1
                        ? `${statuses[currentIndex + 1]}`
                        : 'Không thể cập nhật';
                    })()}
                  </button>
                  {/* Chỉ hiển thị nút Hủy đơn hàng khi trạng thái là Pending */}
                  {order.status === 'Pending' && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleCancelOrder(order._id, order.status)}
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
