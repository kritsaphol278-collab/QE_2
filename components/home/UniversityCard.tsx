import Link from "next/link";

type UniversityCardProps = {
  id: string;
  name: string;
  province: string;
  image: string;
};

export default function UniversityCard({
  id,
  name,
  province,
  image,
}: UniversityCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <img
        src={image}
        alt={name}
        className="h-20 w-20 rounded-lg object-cover"
      />

      <h3 className="mt-4 text-xl font-bold">{name}</h3>

      <p className="mt-2 text-gray-500">{province}</p>

      {/* เปลี่ยน href เป็น path สำหรับหน้าเว็บขายของของคุณ เช่น /shop/${id} หรือ /university/${id} */}
      <Link href={`/university/${id}`} className="mt-4 block w-full">
        <button className="w-full rounded-xl bg-slate-100 py-2 font-medium hover:bg-slate-200 transition-colors">
          View Faculty Collections
        </button>
      </Link>
    </div>
  );
}