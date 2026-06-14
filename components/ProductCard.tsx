type Props = {
  title: string;
  price: number;
  image: string;
};

export default function ProductCard({
  title,
  price,
  image,
}: Props) {
  return (
    <div className="rounded-xl border p-4">
      <img
        src={image}
        alt={title}
        className="aspect-square w-full object-cover rounded-lg"
      />

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="font-bold">฿{price}</p>

      <button className="mt-3 w-full rounded-lg bg-blue-900 text-white py-2">
        Add to Cart
      </button>
    </div>
  );
}