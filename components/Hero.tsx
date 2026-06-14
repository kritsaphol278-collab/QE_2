export default function Hero() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto grid gap-10 px-6 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Discover Your Perfect University Uniform
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Browse official uniforms from universities across Thailand with
            modern ordering and nationwide delivery.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-blue-900 px-6 py-3 text-white">
              Shop Now
            </button>

            <button className="rounded-xl border px-6 py-3">
              Explore Universities
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="aspect-[4/3] rounded-2xl border border-dashed flex items-center justify-center text-gray-400">
            Hero Image
          </div>
        </div>
      </div>
    </section>
  );
}