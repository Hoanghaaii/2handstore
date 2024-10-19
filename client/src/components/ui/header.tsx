"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useEffect, useState } from 'react'
import { Navbar } from './navbar'
import { ModeToggle } from './modetoggle'
import { Button } from './button'
import { CiShoppingCart } from "react-icons/ci";   
import Link from 'next/link'
import {useAuthStore} from '../../store/authStore'
import { FiLoader } from "react-icons/fi";
import Image from 'next/image'
import { GoPerson } from "react-icons/go";
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "./avatar"
import { useRouter } from "next/navigation"


const Header = () => {
  const { isAuthenticated, checkAuth, user, signout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false); // Thêm state để quản lý AlertDialog
  const router = useRouter()
  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    checkUserAuth();
  }, []);

  const handleSignout = () => {
    setOpenAlert(true); // Mở AlertDialog
  };

  const confirmSignout = () => {
    signout(); // Gọi hàm signout từ store
    setOpenAlert(false); // Đóng AlertDialog sau khi đăng xuất
  };

  return (
    <>
      <div className='flex items-center justify-between w-full min-h-10 dark:bg-black p-3 border-separate border-2 border-x-0 border-t-0'>
        <div className='flex items-center gap-4'>
          <Link href={'/'}>
              <Image quality={100} src="/logo.png" width={80} height={80} alt="Logo" className="object-contain rounded-full shadow-lg hover:scale-105" />
          </Link>
        </div>
        <div className='flex flex-col items-start rounded-lg p-3'>
            <h1 className='text-2xl text-center'><i>Nơi giao dịch đồ <b>Second Hand </b>số 1 Việt Nam </i></h1>
            <h1 className='text-sm opacity-20 text-slate-500 dark:text-slate-100 text-center'><i>Do Admin tự bình chọn</i></h1>
        </div>
        <div className='mr-20'>
          <ModeToggle /> {/* Di chuyển ModeToggle ra bên phải */}
        </div>
      </div>
      <div className="flex justify-between items-center px-4 dark:bg-black py-3 border-separate border-t-0 border-2 border-x-0">
        <Navbar />
        <div className="flex space-x-4 items-center">
          {loading ? ( // Kiểm tra trạng thái loading
            <FiLoader className='animate-spin' />
          ) : isAuthenticated ? (
            <>
              <Button className='bg-inherit text-inherit outline-none border-none shadow-none bg-white hover:bg-slate-100 dark:text-inherit dark:bg-inherit dark:text-white dark:hover:bg-slate-800'>
                Đăng bán
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost"><GoPerson /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="flex justify-between">
                    <div className=" m-2">
                      <Avatar className='w-10 h-10 shadow-sky-500 shadow-md'>
                          <AvatarImage src={'https://avatars.githubusercontent.com/u/124599?v=4'} className='w-15 h-15 rounded-full' />
                          <AvatarFallback className='text-2xl'>img</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span>{user?.name}</span>
                      <h1 className="text-slate-500 text-xs font-light">{user?.email}</h1>
                    </div>

                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className=" cursor-pointer" onClick={()=>{
                      router.push('/auth/account')
                    }}>Tài khoản</DropdownMenuItem>
                    <DropdownMenuItem className=" cursor-pointer" onClick={()=>{
                      router.push('/auth/update-account')
                    }}>Shop của tôi</DropdownMenuItem>
                    <DropdownMenuItem className=" cursor-pointer" onClick={()=>{
                      router.push('/auth/update-account')
                    }}>Thông báo</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleSignout} className=" cursor-pointer">
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet>
                <SheetTrigger><CiShoppingCart size={23} /></SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Giỏ hàng của bạn</SheetTitle>
                    <SheetDescription>Kiểm tra giỏ hàng của bạn trước khi thanh toán</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Button className='bg-slate-300 hover:bg-slate-400 text-black dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'>
                <Link href={'/auth/signin'}>Đăng nhập</Link>
              </Button>
              <Button className='text-black bg-green-300 hover:bg-green-400 dark:bg-green-800 dark:text-white dark:hover:bg-green-700'>
                <Link href={'/auth/signup'}>Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* AlertDialog */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ kết thúc phiên làm việc của bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSignout}>Đăng xuất</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;
