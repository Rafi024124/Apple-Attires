"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProductForm({ initialData = {}, onClose }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: initialData.name || "",
    price: initialData.price || "",
    discount: initialData.discount || "",
    brand: initialData.brand || "",
    mainCategory: initialData.mainCategory || "",
    subCategory: initialData.subCategory || "",
    type: initialData.type || "",
    gender: initialData.gender || "",
    description: initialData.description || "",
    stockCount: initialData.stockCount || "",
    colors: initialData.colors?.join(", ") || "",
    models: initialData.models?.join(", ") || "",
    tag: initialData.tag || "",
    isAvailable: initialData.isAvailable ?? true,
    isFeatured: initialData.isFeatured ?? false,
    slug: initialData.slug || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axios.patch(`/api/covers/${initialData._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      onClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      models: form.models.split(",").map((m) => m.trim()),
      colors: form.colors.split(",").map((c) => c.trim()),
    };

    updateMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 bg-gray-800 text-white rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="p-2 bg-gray-800 text-white rounded" />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="Discount" className="p-2 bg-gray-800 text-white rounded" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="p-2 bg-gray-800 text-white rounded" />
        <input name="mainCategory" value={form.mainCategory} onChange={handleChange} placeholder="Main Category" className="p-2 bg-gray-800 text-white rounded" />
        <input name="subCategory" value={form.subCategory} onChange={handleChange} placeholder="Sub Category" className="p-2 bg-gray-800 text-white rounded" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type" className="p-2 bg-gray-800 text-white rounded" />
        <input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" className="p-2 bg-gray-800 text-white rounded" />
        <input name="tag" value={form.tag} onChange={handleChange} placeholder="Tag" className="p-2 bg-gray-800 text-white rounded" />
        <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug" className="p-2 bg-gray-800 text-white rounded" />
        <input name="models" value={form.models} onChange={handleChange} placeholder="Models (comma separated)" className="p-2 bg-gray-800 text-white rounded" />
        <input name="colors" value={form.colors} onChange={handleChange} placeholder="Colors (comma separated)" className="p-2 bg-gray-800 text-white rounded" />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 bg-gray-800 text-white rounded"
      ></textarea>

      <div className="flex items-center space-x-4">
        <label className="flex items-center text-white space-x-2">
          <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
          <span>Available</span>
        </label>
        <label className="flex items-center text-white space-x-2">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
          <span>Featured</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={updateMutation.isLoading}
        className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-white rounded shadow-md"
      >
        {updateMutation.isLoading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
