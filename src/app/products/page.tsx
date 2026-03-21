import { Suspense } from "react";
import {
  getProducts,
  getCategories,
  getProductPriceBounds,
} from "@/lib/actions/product.actions";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  trending?: string;
  inStock?: string;
  onSale?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [products, categories, bounds] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      search: params.search,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      featured: params.featured === "1",
      trending: params.trending === "1",
      inStockOnly: params.inStock === "1",
      onSaleOnly: params.onSale === "1",
    }),
    getCategories(),
    getProductPriceBounds(),
  ]);

  const featuredProduct = products[0];

  return (
    <div className="px-6 lg:px-12 py-8 max-w-[1700px] mx-auto">
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-dark">
          Home
        </Link>
        <span>/</span>
        <span className="text-dark font-medium">Products</span>
      </nav>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/products"
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !params.category
              ? "bg-primary-700 text-white border-primary-700"
              : "border-gray-200 text-dark hover:border-primary-500"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              params.category === cat.slug
                ? "bg-primary-700 text-white border-primary-700"
                : "border-gray-200 text-dark hover:border-primary-500"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense
          fallback={
            <div className="hidden lg:block w-[300px] shrink-0 h-96 bg-gray-100 rounded-xl animate-pulse" />
          }
        >
          <FilterSidebar
            priceMinBound={bounds.min}
            priceMaxBound={bounds.max}
            categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
            featuredProduct={
              featuredProduct
                ? {
                    name: featuredProduct.name,
                    category: featuredProduct.category.name,
                    price: `$${featuredProduct.price.toFixed(2)}`,
                    stock: featuredProduct.stock,
                  }
                : undefined
            }
          />
        </Suspense>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-semibold text-dark">{products.length}</span>{" "}
              products
              {params.category && (
                <>
                  {" "}
                  in{" "}
                  <span className="text-primary-700 font-medium">
                    {categories.find((c) => c.slug === params.category)?.name}
                  </span>
                </>
              )}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                🌿
              </div>
              <h3 className="text-xl font-semibold text-dark">No products found</h3>
              <p className="text-muted max-w-xs">
                Try adjusting your filters or{" "}
                <Link href="/products" className="text-primary-700 underline">
                  browse all products
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => {
                const avgRating = p.reviews.length
                  ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
                  : undefined;
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    category={p.category.name}
                    price={p.price}
                    comparePrice={p.comparePrice}
                    image={p.image}
                    badge={p.badge}
                    stock={p.stock}
                    slug={p.slug}
                    rating={avgRating}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
