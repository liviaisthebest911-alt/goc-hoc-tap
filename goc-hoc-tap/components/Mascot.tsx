import Image from "next/image";

/*
 * Khung bao ảnh mascot. Đổi nhân vật chỉ cần thay file trong public/mascots
 * (hoặc truyền src khác); khung hồng nhạt, độ bão hòa và vị trí giữ nguyên.
 * Mặc định trang trí (alt rỗng); truyền alt khi ảnh có nội dung cần đọc.
 */
export const MASCOTS = {
  reader: "/mascots/mascot-black-hair.png",
  buddy: "/mascots/mascot-orange-hair.png",
} as const;

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export default function Mascot({ src, alt = "", className = "" }: Props) {
  return (
    <div className={`mascot ${className}`.trim()}>
      <Image src={src} alt={alt} width={290} height={250} sizes="160px" className="mascot-img" />
    </div>
  );
}
