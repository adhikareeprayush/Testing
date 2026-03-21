import Image from "next/image";
import Link from "next/link";

const farmers = [
  {
    slug: "hari-prasad-sharma",
    name: "Hari Prasad Sharma",
    title: "Organic Vegetable Farmer",
    location: "Kavre District, Nepal",
    experience: "15+ Years",
    badge: "Partner Farmer",
    products: "Tomatoes, Cauliflower, Spinach, Cabbage, Radish, Carrots",
    story: "After years of using chemical fertilizers that degraded his land and health, Hari Prasad made the courageous switch to fully organic farming 15 years ago...",
    image: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
    stats: { customers: "500+", years: "15+", crops: "20+", chemical: "100%" },
  },
  {
    slug: "kamala-devi-tamang",
    name: "Kamala Devi Tamang",
    title: "Organic Dairy Farmer",
    location: "Nuwakot District, Nepal",
    experience: "12+ Years",
    badge: "Partner Farmer",
    products: "Fresh Milk, Organic Ghee, Butter, Paneer, Yogurt",
    story: "As a widow raising three children, Kamala built her dairy farm from a single cow to a thriving organic enterprise that now supplies fresh dairy products to over 300 families...",
    image: "/assets/Homepage/pexels-pixabay-533982.jpg",
    stats: { customers: "300+", years: "12+", products: "8+", chemical: "100%" },
  },
  {
    slug: "ram-bahadur-poudel",
    name: "Ram Bahadur Poudel",
    title: "Organic Spice Farmer",
    location: "Sindhupalchok, Nepal",
    experience: "8+ Years",
    badge: "Partner Farmer",
    products: "Turmeric, Ginger, Cardamom, Black Pepper",
    story: "Ram Bahadur discovered that the traditional spices his grandparents grew were worth far more when produced organically. Today he exports premium spices internationally...",
    image: "/assets/Homepage/honey-dripping-from-dipper.jpg",
    stats: { customers: "200+", years: "8+", varieties: "15+", chemical: "100%" },
  },
];

export default function FarmersStoriesPage() {
  return (
    <div className="px-6 lg:px-12 py-8 flex flex-col gap-12 2xl:max-w-[1700px] mx-auto">
      {/* Hero — white bg, green accent heading */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-xs font-semibold text-primary-700 uppercase tracking-widest bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
          Real People, Real Impact
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark">
          Farmers <span className="text-primary-700">Stories</span>
        </h1>
        <p className="text-muted max-w-2xl text-base md:text-lg">
          Behind every organic product is a dedicated farmer with a remarkable story.
          Meet the people who grow your food with love, care, and generations of knowledge.
        </p>
      </div>

      {/* Farmer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farmers.map((farmer) => (
          <Link
            key={farmer.slug}
            href={`/farmers-stories/${farmer.slug}`}
            className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-gray-100"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={farmer.image}
                alt={farmer.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-primary-700 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                {farmer.badge}
              </div>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div>
                <h3 className="text-xl font-bold text-dark group-hover:text-primary-700 transition-colors">{farmer.name}</h3>
                <p className="text-sm text-primary-600 font-medium mt-0.5">{farmer.title}</p>
                <p className="text-xs text-muted mt-1">📍 {farmer.location}</p>
              </div>

              <p className="text-sm text-muted leading-relaxed line-clamp-3">{farmer.story}</p>

              {/* Stats — green value, muted label */}
              <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                {Object.entries(farmer.stats).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="text-center bg-primary-50 rounded-xl py-2 px-1">
                    <p className="text-lg font-bold text-primary-700">{val}</p>
                    <p className="text-xs text-muted capitalize">{key === "chemical" ? "Chemical Free" : key}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm mt-auto">
                <span>Read Full Story</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA — green bg, white text */}
      <div className="flex flex-col items-center gap-5 py-14 bg-primary-700 rounded-2xl text-white text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Are you a farmer?</h2>
        <p className="text-white/80 max-w-xl">
          Join our partner farmer program and connect your organic products directly with thousands of customers across Nepal.
        </p>
        <Link
          href="/contact"
          className="bg-white text-primary-700 py-3.5 px-10 rounded-xl font-bold hover:bg-primary-50 transition-colors"
        >
          Apply to Join →
        </Link>
      </div>
    </div>
  );
}
