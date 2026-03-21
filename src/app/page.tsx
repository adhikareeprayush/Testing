import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import { getProducts } from "@/lib/actions/product.actions";

export const dynamic = "force-dynamic";

const categoryIcons = [
  { src: "/assets/Homepage/Hero/Dairy.svg", label: "Dairy Products", slug: "dairy" },
  { src: "/assets/Homepage/Hero/Fruits and vegetables.svg", label: "Vegetables & Fruits", slug: "vegetables-fruits" },
  { src: "/assets/Homepage/Hero/Condiments.svg", label: "Spices & Seasonings", slug: "spices-seasoning" },
  { src: "/assets/Homepage/Hero/Baby food.svg", label: "Honey & Groceries", slug: "local-groceries" },
  { src: "/assets/Homepage/Hero/Grain and pasta.svg", label: "Seasonal", slug: "local-seasonal" },
];

export default async function HomePage() {
  const [featured, trending] = await Promise.all([
    getProducts({ featured: true, limit: 4 }),
    getProducts({ trending: true, limit: 4 }),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="px-6 py-8 lg:px-12 lg:py-6 flex flex-col w-full 2xl:max-w-[1700px] mx-auto [overflow:visible]">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full items-center gap-8 [overflow:visible]">
          <div className="col-span-1 flex flex-col gap-8 lg:gap-12 w-full lg:w-[500px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight lg:leading-14">
                Let your <span className="text-[#39a116]">groceries</span> come to you
              </h1>
              <p className="text-sm md:text-base">
                Get fresh groceries online without stepping out to make delicious food with the freshest ingredients
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <form action="/products" method="GET">
                <div className="flex items-center w-full lg:max-w-[400px] bg-[#E8E8E8] h-12 md:h-[52px] rounded-lg overflow-hidden">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search Product..."
                    className="text-sm md:text-lg placeholder:text-[#949494] outline-0 border-0 flex-1 w-full bg-transparent px-2.5"
                  />
                  <button type="submit" className="flex items-center h-full bg-[#39a116] px-3">
                    <Image src="/assets/Resuable/search-white.svg" alt="Search" width={20} height={20} />
                  </button>
                </div>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {["Fresh Vegetables", "100% Guarantee", "Cash on Delivery", "Fast Delivery"].map((feature) => (
                  <div key={feature} className="col-span-1 flex items-center gap-2">
                    <Image src="/assets/Homepage/Hero/check.svg" alt="" width={16} height={16} className="md:w-5 md:h-5" />
                    <p className="text-xs md:text-sm lg:text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Girl Image */}
          <div className="hidden lg:flex col-span-1 items-center [overflow:visible]">
            <div className="relative flex-1 flex items-center justify-center [overflow:visible]">
              <Image
                src="/assets/Homepage/Hero/girl.png"
                alt=""
                width={715}
                height={682}
                className="w-full max-w-[480px] h-auto [overflow:visible]"
                style={{ overflow: "visible" }}
              />
              <div className="absolute -z-10 top-1/2 left-1/2 w-[400px] h-[400px] border-2 border-[#f5da9f] rounded-xl transform -translate-y-1/2 -translate-x-1/2 rotate-45" />
              <div className="absolute -z-10 top-1/2 left-1/2 w-[400px] h-[400px] border-2 border-[#f5da9f] rounded-xl transform -translate-y-1/2 -translate-x-1/2 -rotate-12" />
            </div>
            <div className="flex flex-col gap-4">
              {[
                { img: "/assets/Homepage/Hero/spinach-PVB3BJ8.png", name: "Fresh Spinach", price: "$2.49" },
                { img: "/assets/Homepage/Hero/fresh-carrots-QEAUF2R.png", name: "Fresh Carrots", price: "$1.99" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center px-6 py-4 border-[#949494] border bg-[#F381600D] rounded-2xl gap-2">
                  <div className="bg-white p-4 rounded-2xl shadow-sm w-[160px] h-[120px] relative">
                    <Image src={item.img} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h4 className="text-lg text-[#403c39] font-normal">{item.name}</h4>
                    <h4 className="text-[#f38160] text-lg font-normal">{item.price}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tablet/Mobile Featured Products */}
          <div className="lg:hidden col-span-1 grid grid-cols-2 gap-3">
            {[
              { img: "/assets/Homepage/Hero/spinach-PVB3BJ8.png", name: "Fresh Spinach", price: "$2.49" },
              { img: "/assets/Homepage/Hero/fresh-carrots-QEAUF2R.png", name: "Fresh Carrots", price: "$1.99" },
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center px-3 py-3 border border-gray-200 bg-[#F381600D] rounded-lg gap-2">
                <div className="bg-white p-3 rounded-lg w-full h-24 relative">
                  <Image src={item.img} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex flex-col items-center text-center">
                  <h4 className="text-xs md:text-sm font-medium">{item.name}</h4>
                  <h4 className="text-xs md:text-sm text-[#f38160] font-semibold">{item.price}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Icons Row */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-center justify-between gap-4 lg:gap-6 px-4 lg:px-8 py-6 lg:py-8 bg-white/80 backdrop-blur-lg rounded-lg lg:rounded-xl w-full mt-6 lg:mt-0">
          {categoryIcons.map((cat) => (
            <Link key={cat.label} href={`/products?category=${cat.slug}`} className="flex flex-col gap-3 lg:gap-6 sm:col-span-1 w-full sm:w-auto hover:opacity-80 transition-opacity">
              <Image src={cat.src} alt={cat.label} width={64} height={64} className="md:w-24 md:h-24 lg:w-24 lg:h-24" />
              <div className="flex flex-col gap-1 lg:gap-2">
                <h4 className="text-sm md:text-base lg:text-xl font-medium">{cat.label}</h4>
                <p className="text-xs md:text-sm lg:text-base">Farm fresh, delivered daily</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="px-6 py-8 lg:px-12 lg:py-6 flex flex-col w-full gap-8 2xl:max-w-[1700px] mx-auto">
        <div className="flex items-center justify-center gap-2 flex-col">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Best Selling Products</h3>
          <Image src="/assets/Homepage/leaf.png" alt="" width={75} height={75} className="hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-6 md:gap-8">
          {featured.map((p) => {
            const avg = p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : undefined;
            return (
              <ProductCard key={p.id} id={p.id} name={p.name} category={p.category.name}
                price={p.price} comparePrice={p.comparePrice} image={p.image}
                badge={p.badge} stock={p.stock} slug={p.slug} rating={avg} />
            );
          })}
        </div>
        <div className="flex justify-center">
          <Link href="/products" className="px-8 py-3 border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white font-semibold rounded-xl transition-colors">
            View All Products
          </Link>
        </div>
      </section>

      {/* Banner Section */}
      <section className="h-[620px] bg-section-background flex items-end justify-start px-6 py-8 lg:px-12 lg:py-6">
        <p className="max-w-[700px] w-full text-white text-xl font-medium">
          Treat yourself to a creamy paradise with ScoopFest&apos;s premium, handcrafted ice cream flavors.
          Each scoop is a heavenly blend of rich, velvety goodness that will leave you craving more
        </p>
      </section>

      {/* Partners Section */}
      <section className="px-6 py-8 lg:px-12 lg:py-6 flex flex-col items-center gap-8 2xl:max-w-[1700px] mx-auto">
        <h3 className="text-2xl md:text-3xl lg:text-4xl text-[#626262] text-center leading-tight max-w-4xl">
          160,000+ customers in over 120 countries grow their businesses with Us
        </h3>
        <div className="flex flex-wrap justify-center items-center w-full gap-8 md:gap-10 lg:gap-12 max-w-6xl">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[calc(50%-1rem)] sm:w-[calc(33.333%-1.5rem)] md:w-[calc(25%-1.875rem)] lg:w-[calc(20%-2.4rem)] flex justify-center">
              <Image
                src="/assets/Homepage/Logo.png"
                alt="Partner logo"
                width={140}
                height={55}
                className="w-full h-auto max-h-[55px] max-w-[140px] object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="px-6 py-8 lg:px-12 lg:py-6 flex flex-col w-full gap-8 2xl:max-w-[1700px] mx-auto">
        <div className="flex items-center justify-center gap-2 flex-col">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Trending Products</h3>
          <Image src="/assets/Homepage/leaf.png" alt="" width={75} height={75} className="hover:rotate-12 transition-transform duration-300" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-6 md:gap-8">
          {trending.map((p) => {
            const avg = p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : undefined;
            return (
              <ProductCard key={p.id} id={p.id} name={p.name} category={p.category.name}
                price={p.price} comparePrice={p.comparePrice} image={p.image}
                badge={p.badge} stock={p.stock} slug={p.slug} rating={avg} />
            );
          })}
        </div>
      </section>

      {/* Best Sellers CTA */}
      <section className="px-6 py-8 lg:px-12 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-8 2xl:mx-auto 2xl:w-[1700px]">
        <div className="flex flex-col gap-6 max-w-[500px] w-full lg:w-[50%]">
          <h4 className="text-3xl md:text-4xl lg:text-left text-center">
            Best <span className="font-serif">Sellers</span>
          </h4>
          <p className="text-base md:text-lg lg:text-left text-center">
            Treat yourself to a creamy paradise with ScoopFest&apos;s premium, handcrafted ice cream flavors.
            Each scoop is a heavenly blend of rich, velvety goodness that will leave you craving more.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 md:gap-2.5 bg-[#1A6109] hover:bg-[#2d8011] py-2 md:py-3 px-5 md:px-6 lg:px-8 rounded-lg text-white text-sm md:text-base lg:text-lg font-semibold w-fit lg:mx-0 mx-auto hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Your Scoop of Bliss Now
            <Image src="/assets/Homepage/arrow-upright.svg" alt="arrow" width={16} height={16} className="md:w-5 md:h-5" />
          </Link>
        </div>
        <Image
          src="/assets/Homepage/honey-dripping-from-dipper.jpg"
          alt="Honey dripping from dipper"
          width={500}
          height={400}
          className="w-full lg:w-[500px] max-w-full rounded-sm object-cover"
        />
      </section>

      {/* Customer Reviews */}
      <section className="px-6 py-8 lg:px-12 lg:py-6 flex flex-col w-full gap-8 lg:gap-12 overflow-hidden 2xl:max-w-[1700px] mx-auto">
        <div className="flex items-center justify-center gap-2 flex-col">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold animate-fade-in">Customer Reviews</h3>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-between gap-8 lg:gap-6">
          <div className="flex py-8 md:py-12 gap-4 md:gap-6 flex-col bg-white w-full max-w-[350px] items-center px-4 md:px-3 shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-in-left">
            <StarRating type="yellow" />
            <p className="text-base md:text-lg lg:text-xl text-gray-600 text-center leading-relaxed">
              Absolutely fresh and delicious! The vegetables were so crisp and vibrant. I could taste the difference from day one.
            </p>
            <div className="flex items-center gap-3 group">
              <Image src="/assets/Homepage/profile.jpg" alt="Prayush Adhikari" width={55} height={55}
                className="rounded-full h-[50px] w-[50px] md:h-[55px] md:w-[55px] object-cover border-2 border-transparent group-hover:border-[#39A116] transition-all duration-300" />
              <p className="text-lg md:text-xl text-gray-800 font-medium">Prayush Adhikari</p>
            </div>
          </div>

          <div
            className="w-full max-w-[400px] lg:h-[550px] px-8 md:px-12 lg:px-20 shadow-xl rounded-xl flex items-center flex-col justify-center gap-6 md:gap-8 py-12 md:py-16 lg:py-20 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-scale-in relative overflow-hidden"
            style={{ backgroundImage: "url('/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-xl" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-slow" style={{ animationDelay: "1s" }} />
            <div className="flex flex-col gap-6 md:gap-8 relative z-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl text-center text-white font-bold leading-tight">
                Deal Of The Day 15% Off On All Vegetables!
              </h3>
              <p className="text-white/90 text-center text-base md:text-lg">
                Fresh from local farms — hurry, limited stock!
              </p>
            </div>
            <Link
              href="/products?category=vegetables-fruits"
              className="px-6 md:px-8 py-3 md:py-4 flex items-center gap-2.5 bg-[#39A116] hover:bg-[#2d8011] rounded-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 relative z-10"
            >
              <span className="text-base md:text-lg font-semibold text-white">Shop Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="flex py-8 md:py-12 gap-4 md:gap-6 flex-col bg-white w-full max-w-[350px] items-center px-4 md:px-3 shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-in-right">
            <StarRating type="yellow" />
            <p className="text-base md:text-lg lg:text-xl text-gray-600 text-center leading-relaxed">
              The delivery was so fast and everything was packaged beautifully. Best organic shopping experience I've had!
            </p>
            <div className="flex items-center gap-3 group">
              <Image src="/assets/Homepage/profile.jpg" alt="Sita Sharma" width={55} height={55}
                className="rounded-full h-[50px] w-[50px] md:h-[55px] md:w-[55px] object-cover border-2 border-transparent group-hover:border-[#39A116] transition-all duration-300" />
              <p className="text-lg md:text-xl text-gray-800 font-medium">Sita Sharma</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="flex flex-col px-6 py-8 lg:px-12 lg:py-6 gap-8 lg:gap-12 2xl:max-w-[1700px] mx-auto">
        <div className="w-full flex justify-center relative overflow-hidden py-8 lg:py-0">
          <Image src="/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg" alt="" width={700} height={482}
            className="hidden lg:block -z-10 h-[300px] w-[450px] lg:h-[400px] lg:w-[550px] xl:h-[482px] xl:w-[700px] object-cover rounded-3xl absolute left-[35%] xl:left-[40%] top-1/2"
            style={{ transform: "translateY(-50%) perspective(1000px) rotateY(-15deg)", transformOrigin: "right center" }} />
          <Image src="/assets/Homepage/pexels-pixabay-533982.jpg" width={700} height={482}
            className="h-[300px] w-full max-w-[500px] sm:h-[350px] sm:max-w-[550px] md:h-[400px] md:max-w-[600px] lg:h-[400px] lg:w-[550px] xl:h-[482px] xl:w-[700px] object-cover rounded-2xl lg:rounded-3xl shadow-2xl"
            alt="Sustainable kitchen products" />
          <Image src="/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg" alt="" width={700} height={482}
            className="hidden lg:block -z-10 h-[300px] w-[450px] lg:h-[400px] lg:w-[550px] xl:h-[482px] xl:w-[700px] object-cover rounded-3xl absolute right-[35%] xl:right-[40%] top-1/2"
            style={{ transform: "translateY(-50%) perspective(1000px) rotateY(15deg)", transformOrigin: "left center" }} />
        </div>
        <div className="text-gray-600 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed px-4 max-w-5xl mx-auto">
          Discover our commitment to{" "}
          <Image src="/assets/Homepage/pexels-pixabay-533982.jpg" width={120} height={24}
            className="h-[18px] w-[90px] sm:h-[20px] sm:w-[100px] md:h-[22px] md:w-[110px] lg:h-[24px] lg:w-[120px] object-cover rounded-2xl lg:rounded-3xl inline align-middle" alt="" />{" "}
          <span className="font-semibold text-black hover:text-[#39A116] transition-colors duration-300">sustainable</span>{" "}
          materials, low-impact production, and{" "}
          <span className="text-black font-semibold hover:text-[#39A116] transition-colors duration-300">ethical sourcing</span>{" "}
          partnerships - all crafted to support a healthier planet and a{" "}
          <Image src="/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg" width={120} height={24}
            className="h-[18px] w-[90px] sm:h-[20px] sm:w-[100px] md:h-[22px] md:w-[110px] lg:h-[24px] lg:w-[120px] object-cover rounded-2xl lg:rounded-3xl inline align-middle" alt="" />{" "}
          <span className="text-black font-semibold hover:text-[#39A116] transition-colors duration-300">greener kitchen</span>
        </div>
      </section>
    </>
  );
}
