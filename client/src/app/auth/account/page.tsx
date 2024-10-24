"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import React, { useEffect } from 'react';
import { FaPerson } from "react-icons/fa6";
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const handleVerifyEmail = ()=>{
        router.push('/auth/verify-email')
    }
    useEffect(() => {
        const message = localStorage.getItem('updateMessage');
        if (message) {
          alert(message); // Hiển thị thông báo từ localStorage
          localStorage.removeItem('updateMessage'); // Xóa thông báo sau khi hiển thị
        }
      }, []);
    return (
        <div className="w-[60%] max-w-[800px] min-w-[700px] min-h-[1000px] mx-auto flex flex-col justify-start border-solid gap-4 border-2 shadow-lg rounded-xl p-4">
            <div className="w-[95%] mb-10 h-[400px] mx-auto border-solid border-blue-400 border-opacity-65 shadow-blue-500 gap-4 border-2 shadow-md rounded-xl hover:scale-105 relative">
                <div className="m-5">
                    <Label className="flex items-center font-semibold m-3">
                    <FaPerson size={20} className="mr-1 mb-2" />
                    Tài khoản
                    </Label>
                    <div className="flex justify-between items-start">
                    <div className="flex">
                        <Avatar className="size-40">
                        <AvatarImage src={user?.avatar ?? "/fallback-image.png"} />
                        <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="mx-8 space-y-1 flex flex-col">
                        <Label className="text-4xl font-bold">{user?.name}</Label>
                        <Label className="text-md">{user?.email}</Label>
                        <Label className="text-md">{user?.phoneNumber}</Label>
                        <Label className="text-md inline-flex ">{user?.gender}</Label>
                        {user?.age && <Label className="text-md">Tuổi: {user?.age}</Label>}
                        <Label className="text-md">{user?.address}</Label>
                        </div>
                    </div>
                    </div>
                </div>
                {/* Badge ở góc trên bên phải */}
                <div className="absolute top-2 right-2">
                    {user?.isVerified? (
                    <Badge className="bg-green-400 hover:bg-green-500 text-white text-sm">Verified</Badge>
                    ) : (
                    <Link href="/">
                        <Badge className="bg-red-400 hover:bg-red-500 text-white text-sm">Unverified</Badge>
                    </Link>
                    )}
                </div>
                <div className="flex justify-center mt-4 gap-4"> {/* Thêm justify-center để căn giữa */}
                    <Button className=' px-12' onClick={() => router.push('/auth/update-account')}> 
                        Sửa
                    </Button>
                    {!user?.isVerified && <Button onClick={handleVerifyEmail} className=' bg-green-500 hover:bg-green-600'>Xác minh email</Button>}
                </div>
            </div>
        </div>

    );
}

export default Page;
