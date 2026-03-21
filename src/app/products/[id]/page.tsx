import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }], isActive: true },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    include: { category: true, reviews: { select: { rating: true } } },
    take: 4,
  });

  const avgRating =
    product.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <>
      {/* Breadcrumb */}
      <section className="px-6 lg:px-12 py-4 max-w-[1700px] mx-auto">
        <p className="text-sm text-muted flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-primary-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-700 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-700 transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-primary-700 font-medium truncate">{product.name}</span>
        </p>
      </section>

      {/* Main Product Section */}
      <section className="px-6 lg:px-12 py-8 flex flex-col gap-12 max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-primary-50 w-full h-[350px] md:h-[450px] lg:h-[520px] flex items-center justify-center rounded-2xl overflow-hidden relative group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500 p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold z-10">
                  {product.badge}
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold z-10">
                  {discount}% OFF
                </div>
              )}
            </div>
            {/* Thumbnail row */}
            <div className="flex gap-3">
              {[product.image, product.image, product.image].map((img, i) => (
                <div
                  key={i}
                  className={`bg-primary-50 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 relative ${
                    i === 0 ? "border-primary-600 shadow-sm" : "border-gray-200 hover:border-primary-400"
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm font-medium text-muted uppercase tracking-wide hover:text-primary-700 transition-colors"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-dark leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-200"}`}
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted">
                {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-primary-800 font-bold text-3xl md:text-4xl">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-muted line-through text-xl">${product.comparePrice.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <span className="bg-yellow-100 text-yellow-700 font-semibold text-sm px-3 py-1 rounded-lg">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-primary-500" : "bg-red-400"}`} />
              <span className="text-sm font-medium text-dark">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="flex flex-col gap-2 border-t border-gray-100 pt-5">
                <h3 className="font-semibold text-dark">About this product</h3>
                <p className="text-muted leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
              {[
                { label: "Weight / Unit", value: product.weight ?? product.unit ?? "—" },
                { label: "Category", value: product.category.name },
                { label: "Stock", value: product.stock > 0 ? `${product.stock} units` : "Sold out" },
                { label: "Certification", value: "Organic" },
              ].map((info) => (
                <div key={info.label} className="flex flex-col gap-1">
                  <p className="text-xs text-muted uppercase tracking-wide">{info.label}</p>
                  <p className="font-semibold text-dark">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <div className="border-t border-gray-100 pt-5">
              <AddToCartButton productId={product.id} stock={product.stock} />
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-3">
              <button className="flex-1 border-2 border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
                ♡ Wishlist
              </button>
              <button className="flex-1 border-2 border-gray-300 text-muted hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-colors duration-200">
                ↗ Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-6 lg:px-12 py-8 border-t border-gray-100 max-w-[1700px] mx-auto">
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-dark">Customer Reviews</h2>

          {/* Review Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Average Rating", value: avgRating > 0 ? avgRating.toFixed(1) : "—", sub: "out of 5", highlight: true },
              { label: "Total Reviews", value: String(product.reviews.length), sub: "verified purchases" },
              { label: "Satisfaction", value: product.reviews.length > 0 ? `${Math.round((product.reviews.filter(r => r.rating >= 4).length / product.reviews.length) * 100)}%` : "—", sub: "rated 4★ or higher" },
            ].map((s) => (
              <div key={s.label} className="bg-primary-50 rounded-2xl p-5 flex flex-col gap-2">
                <p className="text-xs text-muted uppercase tracking-wide">{s.label}</p>
                <p className={`text-3xl font-bold ${s.highlight ? "text-primary-700" : "text-dark"}`}>{s.value}</p>
                <p className="text-xs text-muted">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Reviews list */}
          {product.reviews.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
              <p className="text-muted">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
                      {review.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark">{review.user.name}</h4>
                      <p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-muted leading-relaxed text-sm">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="px-6 lg:px-12 py-8 flex flex-col gap-8 max-w-[1700px] mx-auto">
          <div className="flex items-center justify-center gap-2 flex-col">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-dark">You Might Also Like</h2>
            <Image src="/assets/Homepage/leaf.png" alt="" width={60} height={60} className="hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => {
              const avg = p.reviews.length
                ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
                : undefined;
              return (
                <ProductCard key={p.id} id={p.id} name={p.name} category={p.category.name}
                  price={p.price} comparePrice={p.comparePrice} image={p.image}
                  badge={p.badge} stock={p.stock} slug={p.slug} rating={avg} />
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
