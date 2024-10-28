"use client"
import { useEffect, useState } from "react"; 
import { useProductStore } from "../../../store/productStore";
import { useCartStore } from "../../../store/cartStore"; // Import useCartStore
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CiShoppingCart } from "react-icons/ci";   
import { toast } from "sonner"; // Import toast từ Sonner


const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; 
  const { fetchProductById, product, loading, error } = useProductStore(); 
  const { addCartItem } = useCartStore(); // Lấy hàm addCartItem từ store giỏ hàng
  const [quantity, setQuantity] = useState(1); 
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  useEffect(() => {
    if (id) {
      fetchProductById(id); 
    }
  }, [fetchProductById, id]);

  const increaseQuantity = () => {
    const maxQuantity = product?.quantity || 0; 
    setQuantity(prevQuantity => (prevQuantity < maxQuantity ? prevQuantity + 1 : maxQuantity));
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (product) {
        const imageUrls = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
        if(product.quantity===0){
          toast("Thêm sản phẩm vào giỏ hàng thất bại vì hết hàng!", {
            style: {
                backgroundColor: '#ff0000', // Background color for success message
                color: '#ffffff', // Text color for success message
            },
        });
        return;
        }
        await addCartItem(product._id, quantity, product.price, imageUrls, product.name);
        toast.success("Thêm sản phẩm vào giỏ hàng thành công!", {
            style: {
                backgroundColor: '#008000', // Background color for success message
                color: '#ffffff', // Text color for success message
            },
        });
    }
};


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>No product found.</p>;
  }

  return (
    <div className="p-4">
      <Card className="mx-auto border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
          <CardTitle className="text-md font-light text-slate-500 ">Đăng bởi: {product.author}</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent>
            {Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
              product.imageUrl.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={product.name}
                  className="mb-4"
                  width={500}
                  height={500}
                />
              ))
            ) : (
              <p>No image available.</p>
            )}
          </CardContent>
          <CardContent className="space-y-7">
            <div className='flex justify-between items-center'>
              <p className='text-5xl gradient-text'>{formatPrice(product.price)}</p>
              <p className='text-slate-700 text-xl mr-5'>đ</p>
              {product.status === "available" ? (
                <p className='text-xl font-semibold text-green-500'>Còn hàng</p>
              ) : (
                <p className='text-lg text-red-500'>Hết hàng</p>
              )}
            </div>
            
            <p className=''>Tồn kho: <b >{product.quantity}</b></p>

            <div className="flex items-center">
              <Button onClick={decreaseQuantity} className=" hover:scale-105 duration-200 ">
                -
              </Button>
              <span className="mx-2 text-lg">{quantity}</span>
              <Button onClick={increaseQuantity} className=" hover:scale-105 duration-200 ">
                +
              </Button>
            </div>
            <p className='text-lg font-semibold'>
              <b className="font-medium">Danh mục: </b>
              {Array.isArray(product.category) ? product.category.join(', ') : product.category}
            </p>
            <p className='font-semibold text-lg'> <b className="font-medium">Vị trí: </b> {product.location}</p>
            <Button 
              className="w-full font-bold px-6 rounded-md duration-300 transition hover:scale-105" 
              onClick={handleAddToCart} // Thêm hàm xử lý nhấn nút
            >
              <CiShoppingCart className=" size-7 "/>
              Thêm vào giỏ hàng
            </Button>
          </CardContent>
          <CardContent className="">
            
          </CardContent>
        </div>
        <hr className=" border-2 rounded-full my-5"/>
        <div>
            <div className="flex justify-center">
                <p className=" text-2xl font-semibold">Mô tả chi tiết</p>
            </div>
            <div>
                <div className="m-10">
                    <p className="">{product.description}</p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
