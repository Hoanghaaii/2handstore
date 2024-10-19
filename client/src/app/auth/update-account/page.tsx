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
import { useAuthStore } from "@/store/authStore";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Xây dựng schema cho form cập nhật tài khoản
const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống."),
  age: z.number().min(1, "Tuổi phải hợp lệ"),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại không hợp lệ.")
    .max(10, "Số điện thoại không hợp lệ."),
  address: z.string().min(1, "Địa chỉ không được để trống."),
  avatar: z.any().optional(), // Trường avatar là tùy chọn
});

export default function UpdateAccount() {
    const { updateAccount, user, isLoading, error, message } = useAuthStore();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: user?.name || "",
        age: user?.age || 1,
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || "",
        avatar: "", // Khởi tạo avatar là null
        },
    });
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("age", String(values.age));
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("address", values.address);
        if (values.avatar) {
          formData.append("avatar", values.avatar[0]);
        }

        await updateAccount(user._id, formData);
        toast("Thành công", {
          description: "Cập nhật tài khoản thành công",
          duration: 2000,
          className: "bg-gradient-to-r from-green-100 to-green-200 text-green-500",
        });
        router.push('account');
      }
    } catch (error) {
      toast("Thất bại", {
        description: "Cập nhật tài khoản thất bại",
        duration: 2000,
        className: "bg-gradient-to-r from-red-100 to-red-200 text-red-500",
      });
      console.error("Cập nhật thất bại: ", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold text-center mb-2">Cập nhật tài khoản</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4 shadow-lg p-5"
        >
          {/* Các trường nhập liệu */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tuổi</FormLabel>
                <FormControl>
                  <Input placeholder="Tuổi" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(e.target.files);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Thông báo lỗi */}
          {error && <div className="text-red-500">{error}</div>}
          {message && <div className="text-green-500">{message}</div>}
          
          {/* Nút cập nhật */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <AiOutlineLoading className="animate-spin" /> : "Cập nhật"}
          </Button>

          {/* Nút hủy bỏ */}
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={() => router.back()}
          >
            Hủy bỏ
          </Button>
        </form>
      </Form>
    </main>
  );
}
