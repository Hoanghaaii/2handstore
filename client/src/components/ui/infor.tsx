import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Định nghĩa kiểu dữ liệu cho các props mới
interface InforProps {
  src: string;
  fallbackText: string;
  name: string;        // Tên của người dùng
  role: string;        // Vai trò của người dùng
  description: string; // Mô tả thêm về người dùng
}

const Infor: React.FC<InforProps> = ({ src, fallbackText, name, role, description }) => {
  return (
    <div className="flex items-center gap-4 border-solid border-2 shadow-lg rounded-xl max-w-lg p-4"> {/* Bổ sung padding */}
        <div>
            <Avatar className='w-24 h-24 shadow-sky-500 shadow-md'>
                <AvatarImage src={src} className='w-24 h-24' />
                <AvatarFallback className='text-2xl'>{fallbackText}</AvatarFallback>
            </Avatar>
        </div>
        <div className="flex flex-col">
            <h2 className="text-xl font-medium ">{name}</h2> {/* Hiển thị tên */}
            <p className="text-sm text-gray-500">{role}</p>      {/* Hiển thị vai trò */}
            <p className="text-sm text-gray-700">{description}</p> {/* Hiển thị mô tả */}
        </div>
    </div>
  )
}

export default Infor;
