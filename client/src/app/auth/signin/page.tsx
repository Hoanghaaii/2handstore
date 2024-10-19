"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { AiOutlineLoading } from "react-icons/ai";
import {toast} from 'sonner';
import { useRouter } from "next/navigation";

const formSchema = z.object({
  emailAddress: z.string().email("Email không hợp lệ."),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự."),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const { signin, isLoading, error, message, checkAuth } = useAuthStore();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await signin(values.emailAddress, values.password);
        await checkAuth(); // Kiểm tra xác thực ngay sau khi đăng nhập
        toast("Thành công", {
            description: "Đăng nhập thành công",
            duration: 2000,
            className: "bg-gradient-to-r from-green-100 to-green-200 text-green-500",
        });
        router.push('/');
    } catch (error) {
        toast("Thất bại", {
            description: "Đăng nhập thất bại",
            duration: 2000,
            className: "bg-gradient-to-r from-red-100 to-red-200 text-red-500",
        });
        console.error("Đăng nhập thất bại: ", error);
    }
};


  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold text-center mb-2">Đăng nhập</h1>
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4 shadow-lg p-5 "
        >
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end items-center gap-2">
            <Label className="text-slate-400">Chưa có tài khoản? </Label>
            <Link className="text-blue-500 text-sm hover:underline hover:text-blue-600" href="/auth/signup">
              Đăng ký
            </Link>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {message && <div className="text-green-500">{message}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <AiOutlineLoading className="animate-spin" /> : "Đăng nhập"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
