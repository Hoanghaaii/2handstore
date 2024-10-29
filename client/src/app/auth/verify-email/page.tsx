"use client";

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore'; // Đảm bảo rằng đường dẫn đúng
import { useRouter } from 'next/navigation';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { verifyEmail, resendVerificationCode, user } = useAuthStore();
  const router = useRouter();
  
  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyEmail(value); // Chuyển đổi mã OTP thành chuỗi
      toast("Thành công", {
        description: "Xác minh thành công",
        duration: 2000,
        className: "bg-gradient-to-r from-green-100 to-green-200 text-green-500",
      });
      router.push('/auth/signin'); // Hoặc trang bạn muốn
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      toast(error, {
        description: "Xác minh không thành công",
        duration: 2000,
        className: "bg-gradient-to-r from-red-100 to-red-200 text-red-500",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!user?.email) {
      toast.error("Không tìm thấy email để gửi mã xác thực.");
      return;
    }
    
    setLoading(true);
    try {
      await resendVerificationCode(user.email);
      toast("Mã xác thực đã được gửi lại", {
        description: "Kiểm tra hộp thư đến của bạn",
        duration: 2000,
        className: "bg-gradient-to-r from-green-100 to-green-200 text-green-500",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className=' border-2 items-center justify-center flex flex-col p-10'>
        <h1 className="text-2xl font-bold mb-4">Xác thực Email</h1>
        <form onSubmit={handleVerifyEmail} className="flex flex-col items-center">
          <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div className='flex space-x-5'>
            <Button type="submit" disabled={loading} className={`mt-4 w-full bg-green-500 hover:bg-green-600 dark:text-white text-black ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
            <Button onClick={resendCode} disabled={loading} className={`mt-4 w-full bg-slate-300 hover:bg-slate-400 dark:text-white text-black ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Gửi lại mã
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
