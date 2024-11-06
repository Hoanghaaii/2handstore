'use client'; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../../store/productStore'; // Adjust the import path as necessary
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table'; // Import UI components
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const MyProducts = () => {
  const { products, loading, error, fetchProductsByOwner, setProductQuantityToZero } = useProductStore(); // Destructure the necessary values from the store
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const [filteredProducts, setFilteredProducts] = useState(products); // State to hold filtered products

  useEffect(() => {
    fetchProductsByOwner(); // Fetch products when component mounts
  }, [fetchProductsByOwner]);

  useEffect(() => {
    // Filter products whenever the search term changes
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]); // Run when searchTerm or products change

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await setProductQuantityToZero(id); // Call the function to set quantity to zero and update status
      fetchProductsByOwner(); // Optionally refetch products to refresh the list
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-semibold my-5">Danh sách sản phẩm của tôi</h2>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm theo tên hoặc ID sản phẩm..."
        className="border rounded-md p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
      />
      
      {filteredProducts.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên SP</TableHead>
              <TableHead>SL</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Phân mục</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Hành động</TableHead> {/* New column for actions */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product._id}>
                <TableCell className='text-xl'>
                  <Image src={`${product.imageUrl}`} alt='image' width={200} height={200} className='rounded-2xl' />
                </TableCell>
                <TableCell className='text-xl'>{product.name}</TableCell>
                <TableCell className='text-xl'>{product.quantity}</TableCell>
                <TableCell className='text-xl'>{product.price}đ</TableCell>
                <TableCell className={`text-xl ${product.status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                  {product.status || 'Chưa xác định'}
                </TableCell>
                <TableCell className='text-xl'>{product.category}</TableCell>
                <TableCell className='text-xl'>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className='text-xl'>
                  <Button 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" 
                    onClick={() => handleDelete(product._id)} // Call handleDelete with product ID
                  >
                    Ngưng bán
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MyProducts;
