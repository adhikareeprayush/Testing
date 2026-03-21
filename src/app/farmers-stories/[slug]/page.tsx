import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FarmerStoryPage({ params }: Props) {
  const { slug } = await params;

  const farmer = {
    name: slug === "kamala-devi-tamang" ? "Kamala Devi Tamang" : "Hari Prasad Sharma",
    title: slug === "kamala-devi-tamang" ? "Organic Dairy Farmer" : "Organic Vegetable Farmer",
    location: slug === "kamala-devi-tamang" ? "Nuwakot District, Nepal" : "Kavre District, Nepal",
    experience: slug === "kamala-devi-tamang" ? "12+ Years" : "15+ Years",
    certification: "Organic Certified",
    badge: "Partner Farmer",
    heroImage: slug === "kamala-devi-tamang" ? "/assets/Homepage/pexels-pixabay-533982.jpg" : "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
    profileImage: "/assets/Homepage/profile.jpg",
    stats: [
      { label: "Customers Served", value: slug === "kamala-devi-tamang" ? "300+" : "500+" },
      { label: "Years Organic", value: slug === "kamala-devi-tamang" ? "12+" : "15+" },
      { label: "Crop Varieties", value: slug === "kamala-devi-tamang" ? "8+" : "20+" },
      { label: "Chemical Free", value: "100%" },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Banner */}
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
        <Image src={farmer.heroImage} alt={farmer.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-10 text-white">
          <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
            {farmer.badge}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{farmer.name}</h1>
          <p className="text-white/80 text-lg">{farmer.title} • {farmer.location}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 lg:px-12">
        <p className="text-sm lg:text-base text-muted">
          <Link href="/" className="hover:text-primary-700 transition-colors">Home</Link>
          {" / "}
          <Link href="/farmers-stories" className="hover:text-primary-700 transition-colors">Farmer Stories</Link>
          {" / "}
          <span className="text-primary-700 font-medium">{farmer.name}</span>
        </p>
      </div>

      <div className="px-6 lg:px-12 pb-12 flex flex-col lg:flex-row gap-12">
        {/* Story Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Stats — green value, muted label on light bg */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {farmer.stats.map((stat) => (
              <div key={stat.label} className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary-700">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Story Text */}
          <div className="flex flex-col gap-6 text-muted leading-relaxed">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">My Journey to <span className="text-primary-700">Organic Farming</span></h2>
            <p>
              Growing up in a farming family in Nepal, I learned the importance of the land from a very young age.
              For years, like many farmers around me, I relied on chemical fertilizers and pesticides to boost yields.
              But I began to notice the toll these chemicals were taking — on my land, on the local ecosystem, and on my own health.
            </p>
            <p>
              The turning point came when I attended a workshop on organic farming techniques. I learned how composting,
              natural pest control, and crop rotation could not only maintain yields but actually improve the long-term
              health of my farmland. That was over {farmer.experience} ago, and I haven&apos;t looked back since.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-dark">Partnering with <span className="text-primary-700">Farm Commerce</span></h2>
            <p>
              Joining the Organic Shop Nepal partner program was a game-changer. Before, I struggled to find buyers
              who would pay fair prices for my organic produce. Now I have a direct channel to thousands of customers
              who understand and appreciate the value of truly organic food.
            </p>
            <p>
              The support doesn&apos;t stop at selling. The team provides training, helps with certification, and connects
              us with other farmers so we can share knowledge and techniques.
            </p>

            <blockquote className="border-l-4 border-primary-600 pl-6 italic text-dark text-xl bg-primary-50 py-4 pr-4 rounded-r-xl">
              &ldquo;When you grow food organically, you&apos;re not just feeding people — you&apos;re healing the land for the next generation.&rdquo;
            </blockquote>
          </div>

          {/* Photo Gallery */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-dark">Farm <span className="text-primary-700">Gallery</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "/assets/Homepage/pexels-pixabay-533982.jpg",
                "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
                "/assets/Homepage/honey-dripping-from-dipper.jpg",
                "/assets/Homepage/plant.png",
                "/assets/Homepage/Hero/spinach-PVB3BJ8.png",
                "/assets/Homepage/Hero/fresh-carrots-QEAUF2R.png",
              ].map((img, i) => (
                <div key={i} className="relative h-40 rounded-lg overflow-hidden group">
                  <Image src={img} alt={`Farm photo ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          {/* Farmer Profile Card — white bg, green accents */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100">
            <div className="flex items-center gap-4">
              <Image src={farmer.profileImage} alt={farmer.name} width={80} height={80} className="w-20 h-20 rounded-full object-cover border-4 border-primary-300" />
              <div>
                <h3 className="font-bold text-dark">{farmer.name}</h3>
                <p className="text-sm text-primary-600 font-medium">{farmer.title}</p>
                <span className="text-xs bg-primary-700 text-white px-2.5 py-0.5 rounded-full mt-1 inline-block">{farmer.badge}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm border-t border-gray-100 pt-4">
              {[
                { label: "Location", value: farmer.location },
                { label: "Experience", value: farmer.experience },
                { label: "Certification", value: farmer.certification },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-muted">{item.label}:</span>
                  <span className="font-medium text-dark">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meet Other Farmers — light green bg */}
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-bold text-primary-700 text-lg">Meet Other Farmers</h3>
            {["Kamala Devi Tamang", "Ram Bahadur Poudel"].map((name) => (
              <Link key={name} href={`/farmers-stories/${name.toLowerCase().replace(/ /g, "-")}`} className="flex items-center gap-3 group">
                <Image src="/assets/Homepage/profile.jpg" alt={name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border-2 border-primary-200 group-hover:border-primary-600 transition-colors" />
                <p className="text-sm font-medium text-dark group-hover:text-primary-700 transition-colors">{name}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
