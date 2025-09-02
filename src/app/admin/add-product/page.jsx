"use client";
import ProtectedRoute from "@/app/components/protectedRoute/page";
import React, { useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa"; // ❌ icon

const iphoneModels = [
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
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
  "Galaxy S25 Ultra","Galaxy S25+","Galaxy S25",
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

const basicColors = [
  { value: "red", label: "Red" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "gold", label: "Golden" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
    { value: "brown", label: "Brown" },
  { value: "gray", label: "Gray" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
   { value: "purple", label: "Purple" },
];

const predefinedTags = [
  { value: "new-arrival", label: "New Arrival" },
  { value: "best-seller", label: "Best Seller" },
  { value: "limited-edition", label: "Limited Edition" },
  { value: "trending", label: "Trending" },
  { value: "hot-deal", label: "Hot Deal" },
  { value: "premium", label: "Premium" },
  { value: "budget-friendly", label: "Budget Friendly" },
  { value: "shockproof", label: "Shockproof" },
  { value: "waterproof", label: "Waterproof" },
  { value: "magsafe-compatible", label: "Magsafe Compatible" },
];

const coverTypes = [
  "Silicone",
  "Transparent",
  "MagSafe",
  "Leather",
  "Metal",
  "Hybrid",
  "Bumper",
  "Flip",
  "Wallet",
  "Rugged",
  "Glitter",
  "Matte",
  "Carbon Fiber",
].map((t) => ({ value: t.toLowerCase(), label: t }));

export default function Page() {
  const initialForm = {
    name: "",
    price: "",
    discount: "",
      discountEnd: "",
    brand: "",
    mainCategory: "",
    subCategory: "",
    models: [],
    type: "",
    gender: "Unisex",
    images: [],
    description: "",
    stock: "",
    tag: "",
    slug: "",
  };

  const [form, setForm] = useState(initialForm);
  const [colorForImage, setColorForImage] = useState(null);
 const [tempModels, setTempModels] = useState([]);

  const handleImageUpload = async () => {
    if (!window.cloudinary) {
      alert("Cloudinary widget script not loaded yet. Please try again.");
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
            color: colorForImage ? colorForImage.value : "default",
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

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      slug: name === "name" ? value.toLowerCase().replace(/\s+/g, "-") : prev.slug,
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

    // Required field validation
    if (!form.name || !form.price || !form.mainCategory || !form.subCategory || !form.stock || form.images.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill all required fields and upload at least one image.",
        background: "#000",
        color: "#FF4D4D",
      });
      return;
    }

    const formData = { ...form };

    const res = await fetch("/api/covers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Product added successfully.",
        timer: 2000,
        showConfirmButton: false,
        background: "#000",
        color: "#FFB74D",
      });

      // ✅ Reset form after success
      setForm(initialForm);
    } else {
      console.error(data.error);
      alert("Failed to add cover.");
    }
  };

  return (
  <ProtectedRoute>
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* PRICE & DISCOUNT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* DISCOUNT END */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount End
            </label>
            <input
              type="datetime-local"
              name="discountEnd"
              value={form.discountEnd}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Optional"
            />
          </div>

          {/* BRAND */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand (optional)
            </label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Spigen, Apple"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* MAIN CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Category <span className="text-red-500">*</span>
            </label>
            <select
              name="mainCategory"
              value={form.mainCategory}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select Main Category</option>
              <option value="covers">Covers</option>
              <option value="protectors">Screen Protectors</option>
              <option value="lens-protector">Lens Protector</option>
              <option value="charger">Charger</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* COVER TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Type
            </label>
            <Select
              options={coverTypes}
              value={coverTypes.find((opt) => opt.value === form.type) || null}
              onChange={(selected) =>
                setForm((prev) => ({ ...prev, type: selected?.value || "" }))
              }
              className="w-full"
              placeholder="Choose type (Silicone, Transparent, MagSafe, etc.)"
            />
          </div>

          {/* SUB CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select Sub Category</option>
              <option value="iphone">iPhone</option>
              <option value="samsung">Samsung</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* MODELS */}
          {/* MODELS */}
{(form.subCategory === "iphone" || form.subCategory === "samsung") && (
  <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg mb-4">
    <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
      Select Models:
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
      {(form.subCategory === "iphone" ? iphoneModels : samsungModels).map((model) => (
        <label
          key={model.value}
          className="flex items-center gap-2 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer transition"
        >
          <input
            type="checkbox"
            checked={tempModels.includes(model.value)}
            onChange={(e) => {
              if (e.target.checked) {
                setTempModels((prev) => [...prev, model.value]);
              } else {
                setTempModels((prev) => prev.filter((v) => v !== model.value));
              }
            }}
            className="accent-blue-500"
          />
          {model.label}
        </label>
      ))}
    </div>

    <button
      type="button"
      onClick={() => setForm((prev) => ({ ...prev, models: tempModels }))}
      className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Add Selected Models
    </button>

    {form.models.length > 0 && (
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Selected Models: {form.models.join(", ")}
      </p>
    )}
  </div>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Images <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 flex-wrap mb-3">
              {form.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.url}
                    alt="Uploaded"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                  />
                  {img.color && (
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-md">
                      {img.color}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={colorForImage?.value || ""}
                onChange={(e) => {
                  const selected = basicColors.find(
                    (c) => c.value === e.target.value
                  );
                  setColorForImage(selected || null);
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                + Upload
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product details..."
              className="w-full h-28 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overall Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tag (optional)
            </label>
            <Select
              options={predefinedTags}
              value={predefinedTags.find((opt) => opt.value === form.tag) || null}
              onChange={(selected) =>
                setForm((prev) => ({ ...prev, tag: selected?.value || "" }))
              }
              className="w-full"
              placeholder="Select a Tag"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
          </div>

          {/* SUBMIT */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition"
            >
              Submit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  </ProtectedRoute>
);

}
