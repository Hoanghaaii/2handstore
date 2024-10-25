"use client"
import React, { useEffect } from 'react';
import { useEventStore } from '../../store/evenStore';
import { FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
  const { events, fetchEvents, isLoading, error } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Tất cả sự kiện</h1>
      <div className="space-y-8">
        {events.map((event) => {
          console.log("Image URL:", event.imageUrl);

          return (
            <Link key={event._id} href={`/event/${event._id}`} className="dark:bg-slate-900 bg-slate-200 shadow-lg rounded-lg overflow-hidden hover:scale-105 text-black dark:text-white duration-300 flex flex-col md:flex-row ">
              {/* Phần ảnh */}
              <div className="md:w-1/3 h-96 relative"> {/* Đặt chiều cao cố định cho khung ảnh */}
                <Image
                  fill
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-cover"
                />
              </div>

              {/* Phần thông tin */}
              <div className="p-6 md:w-2/3">
                <h3 className="text-3xl font-bold mb-4">
                  {event.title}
                </h3>
                <p className=" mb-6">{event.description}</p>
                <p className="text-gray-500 flex mb-5 text-lg">
                    Từ: 
                    <span className="text-green-500 mx-4 mr-12">{new Date(event.dateFrom).toLocaleDateString()}</span> 
                    Đến hết: 
                    <span className="text-red-500 mx-4">{new Date(event.dateTo).toLocaleDateString()}</span>
                </p>

                <p className="text-lg text-gray-500 mb-4">Áp dụng tại: {event.location}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
