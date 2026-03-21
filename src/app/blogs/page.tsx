import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    slug: "complete-guide-organic-garden",
    title: "The Complete Guide to Starting Your Organic Garden in Nepal",
    author: "Ram Bahadur Thapa",
    date: "March 15, 2024",
    category: "Gardening",
    excerpt: "Discover how to start your own organic garden in Nepal's diverse climate zones. From soil preparation to harvest, we cover everything you need to know.",
    image: "/assets/Homepage/pexels-pixabay-533982.jpg",
  },
  {
    slug: "benefits-organic-farming",
    title: "10 Benefits of Organic Farming for Your Health and Environment",
    author: "Sita Sharma",
    date: "March 10, 2024",
    category: "Health",
    excerpt: "Organic farming is not just a trend - it's a commitment to healthier food and a cleaner planet. Learn why choosing organic matters.",
    image: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
  },
  {
    slug: "himalayan-honey-guide",
    title: "A Guide to Himalayan Honey: Types, Benefits and How to Use It",
    author: "Hari Thapa",
    date: "March 5, 2024",
    category: "Products",
    excerpt: "Nepal produces some of the world's most sought-after honey. Discover the different varieties and their incredible health benefits.",
    image: "/assets/Homepage/honey-dripping-from-dipper.jpg",
  },
  {
    slug: "seasonal-eating-nepal",
    title: "Seasonal Eating in Nepal: What to Buy and When",
    author: "Maya Gurung",
    date: "February 28, 2024",
    category: "Nutrition",
    excerpt: "Eating seasonally is the key to maximum nutrition and flavor. Find out which organic produce is at its peak in each season in Nepal.",
    image: "/assets/Homepage/plant.png",
  },
  {
    slug: "spices-nepal",
    title: "The Spices of Nepal: A Culinary Journey",
    author: "Ram Bahadur Thapa",
    date: "February 20, 2024",
    category: "Cooking",
    excerpt: "Nepal's spice tradition goes back centuries. Explore the aromatic world of Nepali spices and how to use them in your cooking.",
    image: "/assets/Homepage/pexels-pixabay-533982.jpg",
  },
  {
    slug: "farmers-partner-program",
    title: "How Our Farmers Partner Program is Changing Lives",
    author: "Organic Shop Nepal Team",
    date: "February 15, 2024",
    category: "Community",
    excerpt: "Meet the farmers behind your food and learn how our direct partnership model ensures fair prices and sustainable farming practices.",
    image: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg",
  },
];

export default function BlogsPage() {
  return (
    <div className="px-6 lg:px-12 py-8 flex flex-col gap-8 2xl:max-w-[1700px] mx-auto">
      {/* Header — white bg, green accent heading */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-semibold text-primary-700 uppercase tracking-widest bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
          Tips, Stories & Insights
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-dark">
          Our <span className="text-primary-700">Blog</span>
        </h1>
        <p className="text-center text-muted max-w-2xl">
          Insights on organic farming, healthy living, recipes, and stories from Nepal&apos;s farming communities.
        </p>
      </div>

      {/* Featured Post — dark overlay on image, white text */}
      <Link href={`/blogs/${blogs[0].slug}`} className="group relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        <Image src={blogs[0].image} alt={blogs[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 inline-block">
            {blogs[0].category}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white group-hover:text-primary-200 transition-colors leading-snug">
            {blogs[0].title}
          </h2>
          <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">{blogs[0].excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span>By {blogs[0].author}</span>
            <span>•</span>
            <span>{blogs[0].date}</span>
            <span>•</span>
            <span className="text-primary-300 font-semibold">Read More →</span>
          </div>
        </div>
      </Link>

      {/* Blog Grid — white cards, green accents on hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(1).map((blog) => (
          <Link
            key={blog.slug}
            href={`/blogs/${blog.slug}`}
            className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-100"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-primary-700 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                {blog.category}
              </span>
            </div>
            <div className="flex flex-col gap-3 p-6">
              <h3 className="text-base font-semibold text-dark group-hover:text-primary-700 transition-colors leading-tight line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{blog.excerpt}</p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>By {blog.author}</span>
                  <span>•</span>
                  <span>{blog.date}</span>
                </div>
                <span className="text-xs text-primary-700 font-semibold group-hover:underline">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA — green bg, white text */}
      <div className="bg-primary-700 rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Stay in the loop</h2>
          <p className="text-white/80">Get weekly articles on organic farming and healthy living.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 md:w-64 px-4 py-3 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
