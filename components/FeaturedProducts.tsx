const products = [
  {
    id: 1,
    name: "Official White Shirt",
    price: 490,
  },
  {
    id: 2,
    name: "Pleated Skirt",
    price: 690,
  },
  {
    id: 3,
    name: "University Trousers",
    price: 790,
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">
          Featured Products
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="aspect-square rounded-xl bg-slate-100" />

              <h3 className="mt-4 font-semibold">
                {product.name}
              </h3>

              <p className="mt-2 text-xl font-bold">
                ฿{product.price}
              </p>

              <button className="mt-4 w-full rounded-xl bg-blue-900 py-3 text-white">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}