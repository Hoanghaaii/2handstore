"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { IoSearch } from "react-icons/io5"
import { Input } from "./input"
import { ModeToggle } from "./modetoggle"

const components: { title: string; href: string; description: string }[] = [
    {
      title: "MXH",
      href: "/docs/primitives/progress",
      description:
        "Hiển thị những bài đăng liên quan đến đồ 2Hand",
    },
  {
    title: "Phát thanh",
    href: "/docs/primitives/alert-dialog",
    description:
      "Nơi giao lưu của tất cả mọi người, từ users đến admins",
  },
  {
    title: "Thông báo",
    href: "/docs/primitives/hover-card",
    description:
      "Tất cả thông báo được hiển thị ở đây",
  },
  {
    title: "Khiếu nại",
    href: "/docs/primitives/scroll-area",
    description: "Khiếu nại mọi vấn đề với admin",
  },
  {
    title: "Tuyển dụng",
    href: "/docs/primitives/tabs",
    description:
      "Cập nhật thông tin tuyển dụng",
  },
  {
    title: "Ủng hộ",
    href: "/docs/primitives/tooltip",
    description:
      "Ủng hộ hoa hồng cho admin :))",
  },
]

export function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList >
        <NavigationMenuItem>
        <NavigationMenuTrigger className="text-black dark:text-white">Danh mục</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className=" bg-red-400 rounded-md">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Hàng 2Hand
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Tổng hợp sản phẩm hàng 2Hand chất lượng cao
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Đồ may mặc">
                Các thể loại đồ 2Hand liên quan đến may mặc, eg: Áo, quần, giày, dép,etc... 
              </ListItem>
              <ListItem href="/docs/installation" title="Đồ điện tử">
                Các thể loại đồ 2Hand liên quan đến điện tử, eg: Máy tính, bếp từ, TV, etc...
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Đồ gia dụng">
                Các thể loại đồ 2Hand liên quan đến gia dụng, eg: bàn, ghế, giường, tủ, etc...
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Đồ lưu niệm">
                Các thể loại đồ 2Hand liên quan đến lưu niệm...
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Đồ tiêu dùng">
                Các thể loại đồ 2Hand liên quan đến đồ tiêu dùng, eg: sữa, bánh, etc...
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Đồ giá trị cao">
                Các thể loại đồ 2Hand liên quan đến những đồ giá trị cao...
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Khác">
                Các thể loại đồ thuộc nhánh khác...
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Phát thanh</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Hướng dẫn
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <Input className=" bg-white dark:bg-black dark:text-white" size={50} placeholder="Tìm kiếm"/>
        </NavigationMenuItem>
        <NavigationMenuItem >
          <Link href="/docs" legacyBehavior passHref>
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()}`}>
              <IoSearch/>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
