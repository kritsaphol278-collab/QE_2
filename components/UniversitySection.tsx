const universities = [
  "Kasetsart University",
  "Chulalongkorn University",
  "Thammasat University",
];

export default function UniversitySection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">
          Featured Universities
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {universities.map((name) => (
            <div
              key={name}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="h-24 rounded-xl bg-slate-100" />

              <h3 className="mt-4 text-xl font-semibold">
                {name}
              </h3>

              <button className="mt-4 w-full rounded-xl border py-2">
                View Collection
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}