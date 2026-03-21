import Image from "next/image";

const images = [
  { src: "/assets/Homepage/pexels-pixabay-533982.jpg", alt: "Farm field" },
  { src: "/assets/Homepage/honey-dripping-from-dipper.jpg", alt: "Honey" },
  { src: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg", alt: "Farm" },
  { src: "/assets/Homepage/Hero/spinach-PVB3BJ8.png", alt: "Spinach" },
  { src: "/assets/Homepage/Hero/fresh-carrots-QEAUF2R.png", alt: "Carrots" },
  { src: "/assets/Homepage/plant.png", alt: "Plant" },
  { src: "/assets/Homepage/pexels-pixabay-533982.jpg", alt: "Farm 2" },
  { src: "/assets/Homepage/honey-dripping-from-dipper.jpg", alt: "Honey 2" },
  { src: "/assets/Homepage/pexels-quang-nguyen-vinh-222549-2153824.jpg", alt: "Farm 3" },
];

export default function GalleryPage() {
  return (
    <div className="px-6 lg:px-12 py-8 flex flex-col gap-8 2xl:max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-semibold text-primary-700 uppercase tracking-widest bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
          Photo Gallery
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-dark">
          Our <span className="text-primary-700">Gallery</span>
        </h1>
        <p className="text-center text-muted max-w-2xl">
          A glimpse into our farms, products, and the beautiful landscapes of Nepal where our food is grown.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Upload CTA — green bg, white text */}
      <div className="bg-primary-700 rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Want to add photos?</h3>
          <p className="text-white/80">Upload farm and product images using our ImageKit-powered tool.</p>
        </div>
        <a
          href="/admin/upload"
          className="bg-white text-primary-700 py-3.5 px-8 rounded-xl font-bold hover:bg-primary-50 transition-colors whitespace-nowrap"
        >
          Upload Images →
        </a>
      </div>
    </div>
  );
}
