import Image from "next/image";

export default function AuthHero() {
  return (
    <div className="relative hidden lg:flex overflow-hidden h-full min-h-screen">
      {/* Background Image */}
      <Image
        src="/images/signin-bg.jpg"
        alt="ThaiUniform Direct"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay matching screenshot */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-20 text-white h-full w-full">
        <span className="text-xl font-bold text-blue-400 tracking-wide">
          ThaiUniform Direct
        </span>

        <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
          The Future of
          <br />
          Tradition.
        </h1>

        <p className="mt-6 max-w-md text-base text-slate-350 leading-relaxed">
          Bridging academic standards with modern convenience. Access official university
          apparel and accessories through Thailand's premier licensed distributor.
        </p>

      </div>
    </div>
  );
}
