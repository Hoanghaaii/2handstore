"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const UpdateAccount = () => {
  const router = useRouter();
  const { user, checkAuth, updateAccount } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setAddress(user.address);
        setGender(user.gender || '');
        setAge(user.age);
      }
    };

    fetchData();
  }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('gender', gender);
    if (age !== undefined) {
      formData.append('age', age.toString());
    }
    if (avatar) {
      formData.append('imageUrl', avatar);
    }
  
    // Kiểm tra nếu user?._id là một string hợp lệ
    if (user?._id) {
      try {
        await updateAccount(user._id, formData);
        toast('Thành công! (Reset trang để thấy sự thay đổi)', {
          style: {
            background: 'green',
            color: 'white',
          },
        });
        router.push('/auth/account');
      } catch (error) {
        console.error('Error updating account:', error);
        toast('Có lỗi xảy ra!', {
          style: {
            background: 'red',
            color: 'white',
          },
        });
      }
    } else {
      console.error('User ID is undefined');
      toast('Có lỗi xảy ra: ID người dùng không hợp lệ!', {
        style: {
          background: 'red',
          color: 'white',
        },
      });
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Cập nhật thông tin tài khoản</CardTitle>
        <CardDescription>Vui lòng điền thông tin dưới đây để cập nhật tài khoản của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ tên</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="border rounded p-2 w-full"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <Label htmlFor="age">Tuổi</Label>
              <Input
                id="age"
                type="number"
                value={age ?? ''}
                onChange={(e) => setAge(Number(e.target.value))}
                required
                min={1}
              />
            </div>

            <div>
              <Label htmlFor="avatar">Hình đại diện</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setAvatar(file);
                }}
              />
            </div>

            <Button type="submit" className="w-full">
              Cập nhật tài khoản
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateAccount;
