/* eslint-disable */

"use client";
import React from 'react';
import Image from 'next/image';

const ArticlePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center my-10">Hướng dẫn sử dụng trang web 2Hand Store</h1>
      <h2 className="text-2xl font-semibold mt-8">Bán sản phẩm</h2>

      {/* Introduction Paragraph */}
      <p className="text-lg leading-relaxed">
        Để bán sản phẩm của chính mình, hãy hover vào mục <b>"Khác"</b> trên thanh Navi bar, sau đó chọn vào <b>"Bán hàng"</b>
      </p>

      {/* Image and Caption */}
      <div className="flex justify-center">
        <Image
          src="/guide1.png" // Đường dẫn hình ảnh của bạn
          alt="img ban hang"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-center text-sm text-gray-500">Hình ảnh minh họa về navbar và mục Bán hàng</p>
      <p className="text-lg leading-relaxed">
        Sau đó nhập thông tin sang phẩn bạn đang muốn bán (Lưu ý nhập ảnh có tỉ lệ 3/2 - Chiều rộng 3 chiều dài 2 để có tỉ lệ ảnh đẹp nhất)
      </p>
      <div className="flex justify-center">
        <Image
          src="/guide2.png" // Đường dẫn hình ảnh của bạn
          alt="img ban hang"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-center text-sm text-gray-500">Hình ảnh minh họa về thêm sản phẩm và các mục nhập liệu</p>
      <p className="text-lg leading-relaxed">
        Khi đăng bán, sản phẩm sẽ hiện công khai trên trang chủ, người dùng có thể mua bằng 2 phương thức: COD hoặc Banking. <span className='text-blue-400'>(Nếu người dùng Banking thì sẽ bank vào số tk của Admin, sau khi giao dịch thành công tiền sẽ hoàn về cho người bán).</span>
      </p>
      <div className="flex justify-center mt-8">
        <Image
          src="/guide3.png" // Đường dẫn hình ảnh của bạn
          alt="Công nghệ AI và ứng dụng"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-center text-sm text-gray-500">Mô tả trang đặt hàng</p>
      <div className="mx-auto p-6">
      <p className="text-lg mb-4">
        Khi đặt hàng thành công, người dùng được chuyển đến trang đơn hàng bao gồm các đơn hàng người dùng đã đặt. Trong trang này, người dùng có thể quan sát được trạng thái của đơn hàng:
      </p>
      <ul className="space-y-4">
        {[
          { status: "Pending", description: "Đơn hàng đã được đặt thành công, đang đợi người bán xác nhận." },
          { status: "Confirmed", description: "Đơn hàng đã được người bán xác nhận." },
          { status: "Shipped", description: "Đơn hàng đã được người bán vận chuyển." },
          { status: "Delivered", description: "Đơn hàng đã giao đến người mua thành công, đơn hàng thành công." },
          { status: "Canceled", description: "Đơn hàng đã bị huỷ." }
        ].map((item, index) => (
          <li
            key={index}
            className="flex items-start p-4 border rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
          >
            <span
              className={`w-4 h-4 mr-4 mt-1 rounded-full 
                ${item.status === "Pending" ? "bg-gray-400" :
                  item.status === "Confirmed" ? "bg-blue-400" :
                  item.status === "Shipped" ? "bg-orange-400" :
                  item.status === "Delivered" ? "bg-green-400" :
                  "bg-red-400"
                }`}
            ></span>
            <div>
              <h3 className="font-semibold text-lg">{item.status}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
      <div className="flex justify-center mt-8">
        <Image
          src="/guide5.png" // Đường dẫn hình ảnh của bạn
          alt="Công nghệ AI và ứng dụng"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-center text-sm text-gray-500">mô tả thanh toán online</p>
      <p className="text-md leading-relaxed text-destructive">
        Lưu ý: đơn hàng chỉ có thể huỷ khi người bán chưa Confirm đơn hàng
      </p>
      <p className="text-lg leading-relaxed">
        Nếu người mua chọn phương thức thanh toán là Banking, khi bấm thanh toán, người mua sẽ được chuyển tới đường link gồm mã QR để thanh toán hoặc nhập đúng số tiền và nội dung yêu cầu để thanh toán
      </p>
      <div className="flex justify-center mt-8">
        <Image
          src="/guide4.png" // Đường dẫn hình ảnh của bạn
          alt="Công nghệ AI và ứng dụng"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
      <p className="text-center text-sm text-gray-500">mô tả thanh toán online</p>
      <p className="text-lg leading-relaxed">
        Khi thanh toán thành công, trạng thái Payment Status sẽ chuyển từ Pending sang Paid
      </p>
      </div>
  );
};

export default ArticlePage;
