import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 2xl:max-w-[1700px] mx-auto">
      {/* Hero */}
      <section className="px-6 lg:px-12 py-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex flex-col gap-6 max-w-[550px]">
          <span className="text-xs font-semibold text-primary-700 uppercase tracking-widest bg-primary-50 border border-primary-100 px-3 py-1 rounded-full w-fit">
            Our Story
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-dark">
            About <span className="text-primary-700">Farm Commerce</span>
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            We are Nepal&apos;s premier organic grocery store, connecting local farmers with health-conscious consumers.
            Our mission is to provide fresh, chemical-free, and sustainably grown products while supporting local agricultural communities.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-700 text-white py-3 px-7 rounded-xl font-semibold text-base hover:bg-primary-800 hover:scale-105 transition-all duration-300 w-fit"
          >
            Shop Now →
          </Link>
        </div>
        <div className="relative w-full max-w-[550px] h-[400px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/assets/Homepage/pexels-pixabay-533982.jpg"
            alt="About Us"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Stats — green bg, white text */}
      <section className="px-6 lg:px-12 py-14 bg-primary-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
          {[
            { value: "500+", label: "Local Farmers" },
            { value: "10K+", label: "Happy Customers" },
            { value: "200+", label: "Organic Products" },
            { value: "5+", label: "Years of Service" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <h3 className="text-4xl md:text-5xl font-bold">{stat.value}</h3>
              <p className="text-white/80 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission — white bg, green card titles */}
      <section className="px-6 lg:px-12 py-8 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-dark">
            Our Mission & <span className="text-primary-700">Values</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-sm md:text-base">The principles that guide everything we do at Farm Commerce.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🌱", title: "Organic First", desc: "Every product we sell is grown without harmful chemicals or pesticides, ensuring the highest quality for your family." },
            { icon: "🤝", title: "Supporting Farmers", desc: "We partner directly with local Nepali farmers, ensuring fair prices and sustainable livelihoods for farming communities." },
            { icon: "🌍", title: "Sustainability", desc: "From eco-friendly packaging to zero-waste delivery, we are committed to reducing our environmental footprint." },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary-700">{item.title}</h3>
              <p className="text-muted leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us — light green bg */}
      <section className="px-6 lg:px-12 py-12 bg-primary-50">
        <div className="text-center flex flex-col gap-2 mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-dark">
            Why <span className="text-primary-700">Choose Us?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "Same-day delivery within Kathmandu valley." },
            { icon: "✅", title: "100% Organic", desc: "All products certified organic, no chemicals." },
            { icon: "💰", title: "Fair Prices", desc: "Best prices, direct from farmers, no middlemen." },
            { icon: "🔄", title: "Easy Returns", desc: "Not happy? Return within 24 hours, no questions." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-primary-100 hover:border-primary-300 transition-colors">
              <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <h4 className="font-semibold text-dark">{item.title}</h4>
              <p className="text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team — white bg */}
      <section className="px-6 lg:px-12 py-8 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-dark">
            Meet Our <span className="text-primary-700">Team</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-sm md:text-base">The passionate people behind Farm Commerce.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Ram Sharma", "Sita Poudel", "Hari Thapa", "Maya Gurung"].map((name, i) => (
            <div key={name} className="flex flex-col items-center gap-3 text-center group">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary-200 group-hover:border-primary-700 transition-colors">
                <Image src="/assets/Homepage/profile.jpg" alt={name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-dark group-hover:text-primary-700 transition-colors">{name}</h4>
                <p className="text-xs text-muted mt-0.5">{["Founder & CEO", "Head of Farmer Relations", "Marketing Director", "Operations Manager"][i]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner — green bg, white text */}
      <section className="mx-6 lg:mx-12 mb-8 bg-primary-700 rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to eat organic?</h2>
          <p className="text-white/80">Browse 200+ certified organic products from local Nepali farms.</p>
        </div>
        <Link
          href="/products"
          className="bg-white text-primary-700 font-bold py-3.5 px-8 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap"
        >
          Shop Now →
        </Link>
      </section>
    </div>
  );
}
