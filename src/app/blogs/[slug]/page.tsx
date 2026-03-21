import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="px-6 lg:px-12 py-8 flex flex-col gap-8 2xl:max-w-[1700px] mx-auto">
      {/* Breadcrumb */}
      <p className="text-sm lg:text-base text-muted">
        <Link href="/" className="hover:text-primary-700 transition-colors">Home</Link>
        {" / "}
        <Link href="/blogs" className="hover:text-primary-700 transition-colors">Blogs</Link>
        {" / "}
        <span className="text-primary-700 font-medium capitalize">{slug.replace(/-/g, " ")}</span>
      </p>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Article */}
        <article className="flex-1 flex flex-col gap-8">
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden">
            <Image
              src="/assets/Homepage/pexels-pixabay-533982.jpg"
              alt="Blog post"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary-700 text-white text-xs font-semibold px-3 py-1 rounded-full">Gardening</span>
              <span className="text-sm text-[#949494]">March 15, 2024</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight">
              The Complete Guide to Starting Your Organic Garden in Nepal
            </h1>
            <div className="flex items-center gap-3">
              <Image src="/assets/Homepage/profile.jpg" alt="Author" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-[#403c39]">Ram Bahadur Thapa</p>
                <p className="text-xs text-[#949494]">Agricultural Specialist</p>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-muted leading-relaxed flex flex-col gap-6">
            <p>
              Starting an organic garden in Nepal can be one of the most rewarding experiences for any household.
              With Nepal&apos;s diverse climate zones — from the tropical Terai to the high-altitude hills — there is no shortage of opportunities
              to grow a variety of fresh, nutritious produce right in your backyard.
            </p>

            <h2 className="text-2xl font-bold text-dark">Why <span className="text-primary-700">Organic Gardening?</span></h2>
            <p>
              Organic gardening is more than a trend — it&apos;s a return to traditional, sustainable agricultural practices that have sustained communities for generations.
              By avoiding synthetic chemicals and pesticides, you not only protect your family&apos;s health but also preserve the soil&apos;s natural ecosystem.
            </p>

            <h2 className="text-2xl font-bold text-dark">Planning Your <span className="text-primary-700">Garden</span></h2>
            <p>
              The first step to a successful organic garden is planning. Consider the following:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-2 pl-4">
              <li><strong>Space:</strong> Even a small balcony or rooftop can accommodate a productive container garden.</li>
              <li><strong>Season:</strong> Nepal has three main growing seasons — monsoon, winter, and spring-summer.</li>
              <li><strong>Soil:</strong> Healthy soil is the foundation of organic gardening. Start composting kitchen waste to create nutrient-rich compost.</li>
            </ul>

            <h2 className="text-2xl font-bold text-dark">Best <span className="text-primary-700">Crops for Nepal</span></h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#f8f6f3]">
                    <th className="border border-gray-200 px-4 py-2 text-left">Crop</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Season</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Spinach", "Winter", "Hills & Mountains"],
                    ["Tomatoes", "Spring-Summer", "All regions"],
                    ["Cauliflower", "Winter", "Hills"],
                    ["Cucumbers", "Monsoon", "Terai & Hills"],
                  ].map(([crop, season, region]) => (
                    <tr key={crop} className="hover:bg-[#f8f6f3]">
                      <td className="border border-gray-200 px-4 py-2">{crop}</td>
                      <td className="border border-gray-200 px-4 py-2">{season}</td>
                      <td className="border border-gray-200 px-4 py-2">{region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <blockquote className="border-l-4 border-primary-600 pl-6 italic text-dark text-lg bg-primary-50 py-3 pr-4 rounded-r-xl">
              &ldquo;The greatest fine art of the future will be the making of a comfortable living from a small piece of land.&rdquo;
              — Abraham Lincoln
            </blockquote>

            <p>
              Remember, organic gardening is a journey, not a destination. Each season brings new lessons and new rewards.
              Start small, be patient, and enjoy the process of growing your own food.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {["Organic", "Gardening", "Nepal", "Sustainable", "Farming"].map((tag) => (
              <span key={tag} className="bg-primary-50 text-muted text-sm px-3 py-1 rounded-full border border-primary-100 hover:border-primary-500 hover:text-primary-700 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-primary-700">Recent Posts</h3>
            {["10 Benefits of Organic Farming", "A Guide to Himalayan Honey", "Seasonal Eating in Nepal"].map((title) => (
              <Link key={title} href="/blogs" className="flex gap-3 group">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src="/assets/Homepage/pexels-pixabay-533982.jpg" alt={title} fill className="object-cover" />
                </div>
                <p className="text-sm text-dark group-hover:text-primary-700 transition-colors leading-tight">{title}</p>
              </Link>
            ))}
          </div>

          <div className="bg-[#39A116] rounded-2xl p-6 flex flex-col gap-4 text-white">
            <h3 className="text-xl font-semibold">Subscribe to Newsletter</h3>
            <p className="text-white/80 text-sm">Get the latest articles and organic tips in your inbox.</p>
            <input type="email" placeholder="Your email" className="px-4 py-3 rounded-lg text-[#403c39] text-sm focus:outline-none" />
            <button className="bg-white text-[#39A116] py-3 rounded-lg font-semibold hover:bg-[#f8f6f3] transition-colors">
              Subscribe
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
