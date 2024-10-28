import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhoneAlt } from 'react-icons/fa';

const AboutMePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Giới Thiệu Về Tôi</h1>
      <p className="text-lg text-gray-700 mb-8">
        Xin chào! Tôi là Vũ Hoàng Hải, một sinh viên năm 4 đam mê công nghệ và luôn muốn khám phá những điều mới mẻ trong thế giới lập trình. Tôi thích xây dựng những ứng dụng web độc đáo và mang lại trải nghiệm tốt nhất cho người dùng. Ngoài công việc, tôi thích dành thời chơi game, du lịch, và học hỏi kiến thức qua các trang mạng xã hội.
      </p>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Kết Nối Với Tôi</h2>
        <ul className="flex justify-center space-x-6">
          <li className="group">
            <a href="https://www.facebook.com/hai.vuhoang.39589/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="text-3xl text-blue-600 group-hover:text-blue-800 transition duration-200" />
            </a>
          </li>
          <li className="group">
            <a href="https://www.instagram.com/vhhai.90kg/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-3xl text-pink-500 group-hover:text-pink-700 transition duration-200" />
            </a>
          </li>
          <li className="group">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="text-3xl text-blue-700 group-hover:text-blue-900 transition duration-200" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutMePage;
