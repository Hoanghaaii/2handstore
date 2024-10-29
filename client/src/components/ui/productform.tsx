"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCategoryStore } from '../../store/categoryStore';
import axios from 'axios';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Label } from './label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AiOutlineLoading } from "react-icons/ai";

const API_URL = 
  process.env.NODE_ENV === "development" 
    ? `http://localhost:3001/api/product` 
    : 'https://twohandstore.onrender.com/api/product';

const ProductForm = () => {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('available');
  const [isSubmitting, setIsSubmitting] = useState(false); // State để theo dõi trạng thái gửi yêu cầu

  useEffect(() => {
    if (quantity === '0') {
      setStatus('sold');
    } else {
      setStatus('available');
    }
  }, [quantity]);

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
      fetchCategories();
    };
    fetchData();
  }, []); //eslint-disable-line

  useEffect(() => {
    if (user) {
      setAuthorEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Nếu đang gửi yêu cầu thì không làm gì

    setIsSubmitting(true); // Bắt đầu gửi yêu cầu

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('authorEmail', authorEmail);
    formData.append('location', location);
    formData.append('status', status);
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    try {
      const response = await axios.post(`${API_URL}/add-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Product added successfully:', response.data);
      toast('Sản phẩm đã được thêm thành công!', {
        style: {
          background: 'green',
          color: 'white',
        },
      });
      router.push('/product');
    } catch (error) {
      console.error('Error adding product:', error);
      toast('Có lỗi xảy ra!', {
        style: {
          background: 'red',
          color: 'white',
        },
      });
    } finally {
      setIsSubmitting(false); // Kết thúc gửi yêu cầu
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Thêm Sản Phẩm Mới</CardTitle>
        <CardDescription>Vui lòng điền thông tin dưới đây để thêm sản phẩm mới.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Tên sản phẩm</Label>
              <Input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Vị trí</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                placeholder='nhập số lượng'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Danh mục</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="image">Hình ảnh</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files![0])}
                required
              />
            </div>

            <div>
              <Label htmlFor="authorEmail">Tác giả</Label>
              <Input
                id="authorEmail"
                type="text"
                value={authorEmail}
                disabled // Trường này sẽ hiển thị tên tác giả từ trạng thái user
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <AiOutlineLoading className=' animate-spin'/> : 'Thêm sản phẩm'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
