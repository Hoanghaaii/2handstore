"use client"
// pages/event/[id]/page.tsx (hoặc src/app/event/[id]/page.tsx nếu bạn dùng cấu trúc mới)
import { useEffect } from 'react';
import { useEventStore } from '../../../store/evenStore'; // Đảm bảo đường dẫn đúng
import React from 'react';
import Image from 'next/image';

interface Props {
  params: {
    id: string; // Đảm bảo rằng id là chuỗi
  };
}

const EventDetail: React.FC<Props> = ({ params }) => {
  const { id } = params; // Lấy ID từ params
  const { events, isLoading, error, fetchEventById } = useEventStore();

  useEffect(() => {
    if (id) {
      fetchEventById(id); // Gọi hàm fetchEventById với ID
    }
  }, [id, fetchEventById]); // Chỉ cần id

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>; // Hiển thị loading
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-xl">Error: {error}</div>; // Hiển thị lỗi nếu có
  }

  // Nếu không có sự kiện nào được tìm thấy
  if (!events.length) {
    return <div className="flex justify-center items-center h-screen text-xl">No event found</div>;
  }

  const event = events[0]; // Lấy sự kiện đầu tiên từ mảng

  return (
    <div className=" mx-auto p-6 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-4">{event.title}</h1>
      <Image 
        src={event.imageUrl} 
        alt={event.title} 
        width={12000} 
        height={8000} 
        className="rounded-lg mb-4" 
      />
      <p className="text-lg mb-2">Location: {event.location}</p>
      <div className=" flex">
      <p className="text-lg text-green-500 mb-2 space-x-2"> {new Date(event.dateFrom).toLocaleDateString()}</p> -
      <p className="text-lg text-red-500 mb-4 space-x-2"> {new Date(event.dateTo).toLocaleDateString()}</p>
      </div>
      <div className=" p-4">
        <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
        <p className="text-gray-700">{event.content}</p>
      </div>
    </div>
  );
};

export default EventDetail;
