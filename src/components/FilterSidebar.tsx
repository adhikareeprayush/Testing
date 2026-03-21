"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PriceSlider from "./PriceSlider";

interface CategoryItem {
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  priceMinBound?: number;
  priceMaxBound?: number;
  categories?: CategoryItem[];
  featuredProduct?: {
    name: string;
    category: string;
    price: string;
    stock?: number;
  };
}

/** Build query string from current params + overrides */
function buildQuery(
  base: URLSearchParams,
  updates: Record<string, string | null | undefined>
) {
  const next = new URLSearchParams(base.toString());
  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === undefined || v === "") {
      next.delete(k);
    } else {
      next.set(k, v);
    }
  }
  const s = next.toString();
  return s ? `?${s}` : "";
}

export default function FilterSidebar({
  priceMinBound = 0,
  priceMaxBound = 200,
  categories = [],
  featuredProduct,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSearch = searchParams.get("search") ?? "";
  const minPrice = Number(searchParams.get("minPrice") ?? priceMinBound) || priceMinBound;
  const maxPrice = Number(searchParams.get("maxPrice") ?? priceMaxBound) || priceMaxBound;
  const featured = searchParams.get("featured") === "1";
  const trending = searchParams.get("trending") === "1";
  const inStock = searchParams.get("inStock") === "1";
  const onSale = searchParams.get("onSale") === "1";

  const navigate = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const q = buildQuery(searchParams, updates);
      startTransition(() => {
        router.push(`${pathname}${q}`);
        setOpen(false);
      });
    },
    [pathname, router, searchParams]
  );

  const [searchDraft, setSearchDraft] = useState(currentSearch);
  const [priceLocal, setPriceLocal] = useState({ min: minPrice, max: maxPrice });

  useEffect(() => {
    setSearchDraft(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setPriceLocal({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  const sliderMax = useMemo(
    () => Math.max(priceMaxBound, priceMinBound + 1),
    [priceMaxBound, priceMinBound]
  );

  const onCategoryChange = (slug: string, checked: boolean) => {
    if (!checked) {
      navigate({ category: null });
      return;
    }
    navigate({ category: slug });
  };

  const onToggleParam = (key: string, enabled: boolean) => {
    navigate({ [key]: enabled ? "1" : null });
  };

  return (
    <>
      <button
        type="button"
        className="lg:hidden mb-4 px-6 py-2.5 bg-primary-700 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-primary-800 transition-colors w-fit"
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M2 3H18M2 10H18M2 17H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>Filters</span>
      </button>

      <div
        className={`fixed lg:static inset-0 lg:inset-auto z-50 flex flex-col lg:flex lg:px-8 px-4 gap-8 lg:gap-12 w-full lg:w-[300px] xl:w-[320px] shrink-0 border-r border-gray-200 bg-white lg:bg-transparent transition-transform duration-300 overflow-y-auto lg:overflow-visible ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          type="button"
          className="lg:hidden sticky top-0 ml-auto p-2 hover:bg-gray-100 rounded-lg z-10 bg-white"
          onClick={() => setOpen(false)}
          aria-label="Close filters"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col gap-6 lg:gap-8 w-full py-4 lg:py-0">
          {/* Search */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-primary-700">Search</label>
            <div className="flex items-stretch gap-2 w-full">
              <input
                type="search"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    navigate({ search: searchDraft.trim() || null });
                  }
                }}
                placeholder="Search products..."
                className="flex-1 border-2 border-gray-300 rounded-lg placeholder:text-muted text-sm bg-white px-3 py-2.5 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
              />
              <button
                type="button"
                onClick={() => navigate({ search: searchDraft.trim() || null })}
                className="flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white w-12 rounded-lg shrink-0"
                aria-label="Search"
              >
                <Image src="/assets/ProductPage/right.svg" alt="" width={20} height={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <PriceSlider
              key={`${minPrice}-${maxPrice}-${sliderMax}`}
              min={priceMinBound}
              max={sliderMax}
              defaultMin={Math.min(priceLocal.min, priceLocal.max)}
              defaultMax={Math.max(priceLocal.min, priceLocal.max)}
              onChange={(lo, hi) => setPriceLocal({ min: lo, max: hi })}
            />
            <button
              type="button"
              onClick={() =>
                navigate({
                  minPrice: String(priceLocal.min),
                  maxPrice: String(priceLocal.max),
                })
              }
              className="w-full py-2 text-sm font-semibold bg-primary-700 text-white rounded-lg hover:bg-primary-800"
            >
              Apply price range
            </button>
          </div>

          {/* Categories — visible checkboxes */}
          {categories.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-primary-700">Categories</h4>
              <div className="flex flex-col gap-2.5 pl-0.5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentCategory === ""}
                    onChange={() => navigate({ category: null })}
                    className="h-5 w-5 shrink-0 rounded border-2 border-gray-400 text-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer accent-primary-700"
                  />
                  <span className="text-sm font-medium text-dark group-hover:text-primary-700">
                    All categories
                  </span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat.slug}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={currentCategory === cat.slug}
                      onChange={(e) => onCategoryChange(cat.slug, e.target.checked)}
                      className="h-5 w-5 shrink-0 rounded border-2 border-gray-400 text-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer accent-primary-700"
                    />
                    <span className="text-sm text-dark group-hover:text-primary-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quick filters */}
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-semibold text-primary-700">Quick filters</h4>
            <div className="flex flex-col gap-2.5 pl-0.5">
              {[
                { key: "featured", label: "Featured only", value: featured },
                { key: "trending", label: "Trending only", value: trending },
                { key: "inStock", label: "In stock only", value: inStock },
                { key: "onSale", label: "On sale", value: onSale },
              ].map((row) => (
                <label key={row.key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={row.value}
                    onChange={(e) => onToggleParam(row.key, e.target.checked)}
                    className="h-5 w-5 shrink-0 rounded border-2 border-gray-400 text-primary-700 focus:ring-2 focus:ring-primary-500 cursor-pointer accent-primary-700"
                  />
                  <span className="text-sm text-dark group-hover:text-primary-700">{row.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate({
                category: null,
                search: null,
                minPrice: null,
                maxPrice: null,
                featured: null,
                trending: null,
                inStock: null,
                onSale: null,
              })
            }
            className="w-full py-2.5 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:border-primary-600 hover:text-primary-700 transition-colors"
          >
            Clear all filters
          </button>

          {featuredProduct && (
            <Link href="/products" className="flex flex-col gap-3 group relative mt-2">
              <div className="bg-gray-100 w-full px-6 py-4 h-[220px] flex items-center justify-center rounded-xl overflow-hidden relative group-hover:shadow-lg transition-shadow">
                <Image
                  src="/assets/Homepage/plant.png"
                  alt={featuredProduct.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                  sizes="280px"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold z-10">
                  Sale!
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-primary-600 font-medium">{featuredProduct.category}</p>
                <h4 className="text-lg font-semibold text-dark group-hover:text-primary-700">
                  {featuredProduct.name}
                </h4>
                <h5 className="text-primary-700 font-bold">{featuredProduct.price}</h5>
              </div>
            </Link>
          )}
        </div>
      </div>

      {open && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          aria-label="Close overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
