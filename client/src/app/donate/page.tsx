import React from 'react';
import Image from 'next/image';

const DonatePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 text-center flex flex-col items-center space-y-6 border-2 rounded-2xl border-blue-500 shadow-xl">
      <h1 className="text-4xl font-bold mb-6">Ủng Hộ Chúng Tôi</h1>
      <p className="text-lg text-gray-700 mb-8">
        Nếu bạn thấy dự án của chúng tôi hữu ích và muốn ủng hộ ít cơm ít cháo, bạn có thể đóng góp thông qua thông tin dưới đây. Sự ủng hộ của bạn sẽ giúp chúng tôi tiếp tục phát triển và cải thiện dự án. Xin cảm ơn!
      </p>

      <div className="flex flex-col md:flex-row md:space-x-8 mt-10 ">
        {/* QR Code Image */}
        <div className="mb-4 md:mb-0">
          <Image 
            src="/qrdonate.png" 
            alt="QR Code for Donation" 
            width={200} 
            height={200} 
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Donation Information */}
        <div className="text-left">
          <p className="text-xl font-semibold mb-2">Thông Tin Chuyển Khoản:</p>
          <p>Chủ tài khoản: VU HOANG HAI</p>
          <p>Ngân hàng: MBBANK</p>
          <p>Số tài khoản: 0327928897</p>
          <p>Nội dung chuyển khoản: "Ủng hộ 2Hand Store"</p>
        </div>
      </div>
    </div>
  );
}

export default DonatePage;
