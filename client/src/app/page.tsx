import { CiMemoPad } from "react-icons/ci";
import ImageCarousel from "@/components/ui/EventCarouse";
import Infor from "@/components/ui/infor";




export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <ImageCarousel/>  
          <div className="flex items-center gap-2 mb-2">
            <CiMemoPad size={20}/>
            <h1 className=" text-2xl">Thông tin</h1>
          </div>
          <div className="flex items-center justify-between">
            <Infor src="https://github.com/shadcn.png" fallbackText="HH" role="Fullstack Intern(Nodejs, Nextjs)" description="Sinh viên năm 4 Trường đại học Công Nghiệp Hà Nội (Chuyên ngành CNTT)" name="Vũ Hoàng Hải (Admin)" />
          </div>
        </div>

      </main>
    </div>
  );
}
