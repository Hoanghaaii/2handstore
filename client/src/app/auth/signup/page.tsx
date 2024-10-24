"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Giả sử bạn có component Input
import { useAuthStore } from '@/store/authStore';
import {toast} from 'sonner'
import { Label } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

const Register = () => {
  const [name, setName] = useState(''); // Thêm state cho tên
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup, isLoading, message } = useAuthStore();
  // Hàm xử lý khi gửi biểu mẫu
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      setLoading(false);
      return;
    }

    try {
      await  signup(email, password, name)
      toast("Thành công", {
        description: "Đăng ký thành công",
        duration: 2000,
        className: "bg-gradient-to-r from-green-100 to-green-200 text-green-500",
    });
      // Chuyển hướng đến trang đăng nhập hoặc trang nào đó
      router.push('/auth/verify-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className=' shadow-xl items-center justify-center flex flex-col p-10 min-w-[600px] rounded-2xl'>
        <h1 className="text-4xl font-bold mb-4">Đăng ký</h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <div>
            <p className=' text-sm'>Tên người dùng</p>
            <Input className='w-96'
              type="text"
              placeholder="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <p className=' text-sm'>Email</p>
            <Input className='w-96'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <p className=' text-sm'>Mật khẩu</p>
            <Input className='w-96'
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <p className=' text-sm'>Xác nhận mật khẩu</p>
            <Input className='w-96'
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
          <div className="flex justify-end items-center gap-2">
            <Label className="text-slate-400">Đã có tài khoản? </Label>
            <Link className="text-blue-500 text-sm hover:underline hover:text-blue-600" href="/auth/signin">
              Đăng nhập
            </Link>
          </div>
          </div>
          <Button type="submit" disabled={loading} className={`mt-4 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
