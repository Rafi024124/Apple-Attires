"use client";
import React, { useState } from "react";
import Select from "react-select";

const iphoneModels = [
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
  "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13 Mini", "iPhone 13",
  "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12 Mini", "iPhone 12",
  "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
  "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
  "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7",
  "iPhone 6s Plus", "iPhone 6s", "iPhone SE (2022)", "iPhone SE (2020)",
].map((model) => ({
  value: model.toLowerCase().replace(/\s+/g, "-"),
  label: model,
}));

const samsungModels = [
  "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
  "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
  "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
  "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21",
  "Galaxy A74", "Galaxy A73", "Galaxy A72", "Galaxy A71",
  "Galaxy A54", "Galaxy A53", "Galaxy A52", "Galaxy A34", "Galaxy A33",
  "Galaxy A24", "Galaxy A14", "Galaxy Z Fold 5", "Galaxy Z Flip 5",
  "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10",
].map((model) => ({
  value: model.toLowerCase().replace(/\s+/g, "-"),
  label: model,
}));

// Basic color options for image color selection dropdown
const basicColors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "gray", label: "Gray" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
];

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    discount: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    models: [],
    type: "",
    gender: "Unisex",
    images: [],
    description: "",
    colors: "",
    stockCount: "",
    tag: "",
    isFeatured: false,
    isAvailable: true,
    slug: "",
  });

  // Store selected color object for new image upload (or null)
  const [colorForImage, setColorForImage] = useState(null);

  const handleImageUpload = async () => {
    if (!window.cloudinary) {
      alert(
        "Cloudinary widget script not loaded yet. Please try again in a moment."
      );
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const newImage = {
            color: colorForImage ? colorForImage.value : null,
            url: result.info.secure_url,
          };
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
          }));
          setColorForImage(null);
        }
      }
    );
    widget.open();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      slug:
        name === "name" ? value.toLowerCase().replace(/\s+/g, "-") : prev.slug,
    }));
  };

  const handleModelsChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      models: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const selectedModelsOptions = (form.models || [])
    .map((value) =>
      [...iphoneModels, ...samsungModels].find((opt) => opt.value === value)
    )
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/covers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Cover added successfully!");
    } else {
      console.error(data.error);
      alert("Failed to add cover.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="input w-full"
          required
        />

        {/* PRICE & DISCOUNT */}
        <div className="flex gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="input w-full"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* BRAND */}
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="input w-full"
        />

        {/* MAIN CATEGORY */}
        <select
          name="mainCategory"
          value={form.mainCategory}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="">Select Main Category</option>
          <option value="covers">Covers</option>
          <option value="protectors">Screen Protectors</option>
          <option value="lens-protector">Lens Protector</option>
          <option value="charger">Charger</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* TYPE & GENDER */}
        <div className="flex gap-4">
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={form.type}
            onChange={handleChange}
            className="input w-full"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="Unisex">Unisex</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* SUB CATEGORY */}
        <select
          name="subCategory"
          value={form.subCategory}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="">Select Sub Category</option>
          <option value="iphone">iPhone</option>
          <option value="samsung">Samsung</option>
          <option value="others">Others</option>
        </select>

        {/* MODELS */}
        {form.subCategory === "iphone" && (
          <Select
            options={iphoneModels}
            value={selectedModelsOptions}
            onChange={handleModelsChange}
            isMulti
            className="w-full"
            placeholder="Select iPhone Model(s)"
          />
        )}
        {form.subCategory === "samsung" && (
          <Select
            options={samsungModels}
            value={selectedModelsOptions}
            onChange={handleModelsChange}
            isMulti
            className="w-full"
            placeholder="Select Samsung Model(s)"
          />
        )}

        {/* IMAGE UPLOADS */}
        <div>
          <label className="block mb-1 font-semibold">Images</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {form.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt="Uploaded"
                  className="w-20 h-20 object-cover rounded"
                />
                {img.color && (
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br">
                    {img.color}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={colorForImage?.value || ""}
              onChange={(e) => {
                const selected = basicColors.find(
                  (c) => c.value === e.target.value
                );
                setColorForImage(selected || null);
              }}
              className="input w-full"
            >
              <option value="">Select Color (optional)</option>
              {basicColors.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleImageUpload}
              className="text-blue-600 underline text-sm whitespace-nowrap"
            >
              + Upload Image
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="input h-24 w-full"
        />

        {/* COLORS */}
        <input
          type="text"
          name="colors"
          placeholder="Colors (comma-separated)"
          value={form.colors}
          onChange={handleChange}
          className="input w-full"
        />

        {/* STOCK COUNT */}
        <input
          type="number"
          name="stockCount"
          placeholder="Stock Count"
          value={form.stockCount}
          onChange={handleChange}
          className="input w-full"
        />

        {/* TAG */}
        <input
          type="text"
          name="tag"
          placeholder="Tag (e.g. Limited Edition)"
          value={form.tag}
          onChange={handleChange}
          className="input w-full"
        />

        {/* CHECKBOXES */}
        <div className="flex gap-6 items-center">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />{" "}
            Featured
          </label>
          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />{" "}
            Available
          </label>
        </div>

        {/* SLUG */}
        <input
          type="text"
          name="slug"
          value={form.slug}
          readOnly
          className="input text-gray-400 w-full"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
}
