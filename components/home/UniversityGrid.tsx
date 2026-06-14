import UniversityCard from "./UniversityCard";

const universities = [
  {
    id: "cu",
    name: "Chulalongkorn University",
    province: "Bangkok",
    image: "/universities/cu.png",
  },
  {
    id: "tu",
    name: "Thammasat University",
    province: "Pathum Thani",
    image: "/universities/tu.png",
  },
  {
    id: "mu",
    name: "Mahidol University",
    province: "Nakhon Pathom",
    image: "/universities/mu.png",
  },
  {
    id: "ku",
    name: "Kasetsart University",
    province: "Bangkok",
    image: "/universities/ku.png",
  },
  {
    id: "cmu",
    name: "Chiang Mai University",
    province: "Chiang Mai",
    image: "/universities/cmu.png",
  },
  {
    id: "kku",
    name: "Khon Kaen University",
    province: "Khon Kaen",
    image: "/universities/kku.png",
  },
];

export default function UniversityGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {universities.map((item) => (
        <UniversityCard
          key={item.id}
          id={item.id}
          name={item.name}
          province={item.province}
          image={item.image}
        />
      ))}
    </div>
  );
}
