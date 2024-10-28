"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore } from '../../store/productStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Image from 'next/image';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDistanceToNow, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

const ProductsPage = () => {
  const { products, loading, error, fetchProducts, totalProducts } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const router = useRouter();

  useEffect(() => {
    fetchProducts(currentPage, productsPerPage);
  }, [fetchProducts, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCardClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!Array.isArray(products) || products.length === 0) {
    return <p>No products available.</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 hover:cursor-pointer">
        {products.map((product) => {
          const createdAtDate = new Date(product.createdAt);
          const isDateValid = isValid(createdAtDate);

          return (
            <Card
              key={product._id}
              className="max-w-md mx-auto hover:scale-105 duration-300"
              onClick={() => handleCardClick(product._id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-4xl gradient-text">{product.name}</CardTitle>
                  <CardTitle className={`text-md ${product.status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                    {product.status}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
                  product.imageUrl.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      alt={product.name}
                      className="mb-4 rounded-2xl"
                      width={500}
                      height={500}
                    />
                  ))
                ) : (
                  <p>No image available.</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <p className="text-4xl gradient-text">{product.price.toLocaleString('vi-VN')}</p>
                    <p className="text-slate-700 text-xl">đ</p>
                  </div>
                  <div className="text-sm">
                    <p>Đăng: {isDateValid ? formatDistanceToNow(createdAtDate, { addSuffix: true, locale: vi }) : 'Không xác định'}</p>
                  </div>
                </div>
                <div className="flex">
                  <p>Vị trí: {product.location || 'Việt Nam'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>Danh mục: {product.category}</p>
                  </div>
                  <div className="flex text-sm justify-end">
                    <p className="mr-1">by:</p>
                    <p>{product.author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousPage} isActive={currentPage !== 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={handleNextPage} isActive={currentPage !== totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ProductsPage;
