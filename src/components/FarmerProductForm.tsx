"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import {
  createFarmerProduct,
  updateFarmerProduct,
} from "@/lib/actions/farmer-product.actions";

type Category = { id: string; name: string };

type Initial = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  categoryId: string;
  image: string;
  badge: string | null;
  unit: string | null;
  isFeatured: boolean;
  isTrending: boolean;
};

export default function FarmerProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const [pending, startTransition] = useTransition();
  const editing = !!initial;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = editing
        ? await updateFarmerProduct(initial!.id, formData)
        : await createFarmerProduct(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(editing ? "Product updated" : "Product created");
        if (!editing) (e.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className="text-sm font-semibold text-dark">Name</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-dark">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-dark">Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.price}
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-dark">Compare at ($)</label>
          <input
            name="comparePrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initial?.comparePrice ?? ""}
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-dark">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={initial?.stock}
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-dark">Category</label>
          <select
            name="categoryId"
            required
            defaultValue={initial?.categoryId}
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-dark">Image URL</label>
        <input
          name="image"
          required
          placeholder="https://images.unsplash.com/..."
          defaultValue={initial?.image}
          className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
        <p className="text-xs text-muted mt-1">
          Paste an image URL (e.g. from Image upload or Unsplash).
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold text-dark">Badge (optional)</label>
        <input
          name="badge"
          defaultValue={initial?.badge ?? ""}
          className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-dark">Unit (optional)</label>
        <input
          name="unit"
          placeholder="500g, 1L"
          defaultValue={initial?.unit ?? ""}
          className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initial?.isFeatured}
            className="h-4 w-4 accent-primary-700"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isTrending"
            defaultChecked={initial?.isTrending}
            className="h-4 w-4 accent-primary-700"
          />
          Trending
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-primary-700 text-white font-semibold py-3 rounded-xl hover:bg-primary-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : editing ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
