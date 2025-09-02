"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

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
].map(model => ({ value: model.toLowerCase().replace(/\s+/g, "-"), label: model }));

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
].map(model => ({ value: model.toLowerCase().replace(/\s+/g, "-"), label: model }));

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
  "Silicone","Transparent","MagSafe","Leather","Metal","Hybrid","Bumper",
  "Flip","Wallet","Rugged","Glitter","Matte","Carbon Fiber",
].map(t => ({ value: t.toLowerCase(), label: t }));

export default function ProductForm({ initialData = {}, onClose }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: initialData.name || "",
    price: initialData.price || "",
    discount: initialData.discount || "",
    discountEnd: initialData.discountEnd || "",
    brand: initialData.brand || "",
    mainCategory: initialData.mainCategory || "",
    subCategory: initialData.subCategory || "",
    type: initialData.type || "",
    gender: initialData.gender || "Unisex",
    description: initialData.description || "",
    stock: initialData.stock || "",
    models: initialData.models || [],
    images: initialData.images || [],
    tag: initialData.tag || "",
    slug: initialData.slug || "",
  });

  const [colorForImage, setColorForImage] = useState(null);
  const [tempModels, setTempModels] = useState(initialData.models || []);

  // IMAGE UPLOAD
  const handleImageUpload = async () => {
    if (!window.cloudinary) {
      alert("Cloudinary widget script not loaded yet.");
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
          setForm(prev => ({ ...prev, images: [...prev.images, newImage] }));
          setColorForImage(null);
        }
      }
    );
    widget.open();
  };

  const removeImage = index => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      slug: name === "name" ? value.toLowerCase().replace(/\s+/g, "-") : prev.slug,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Required validation
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

    const payload = { ...form, models: tempModels };

    updateMutation.mutate(payload);
  };

  const updateMutation = useMutation({
    mutationFn: async updatedData => {
      const res = await axios.patch(`/api/covers/${initialData._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-products"]);
      onClose();
    },
  });

  const selectedModelsOptions = tempModels
    .map(value => [...iphoneModels, ...samsungModels].find(opt => opt.value === value))
    .filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* NAME */}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 rounded bg-gray-800 text-white" />

      {/* PRICE & DISCOUNT */}
      <div className="grid grid-cols-2 gap-4">
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="p-2 rounded bg-gray-800 text-white" />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="Discount (%)" className="p-2 rounded bg-gray-800 text-white" />
      </div>

      {/* DISCOUNT END */}
      <input type="datetime-local" name="discountEnd" value={form.discountEnd} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Discount End" />

      {/* BRAND */}
      <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full p-2 rounded bg-gray-800 text-white" />

      {/* MAIN CATEGORY */}
      <select name="mainCategory" value={form.mainCategory} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
        <option value="">Select Main Category</option>
        <option value="covers">Covers</option>
        <option value="protectors">Screen Protectors</option>
        <option value="lens-protector">Lens Protector</option>
        <option value="charger">Charger</option>
        <option value="accessories">Accessories</option>
      </select>

      {/* SUB CATEGORY */}
      <select name="subCategory" value={form.subCategory} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white">
        <option value="">Select Sub Category</option>
        <option value="iphone">iPhone</option>
        <option value="samsung">Samsung</option>
        <option value="others">Others</option>
      </select>

      {/* COVER TYPE */}
      <Select
        options={coverTypes}
        value={coverTypes.find(opt => opt.value === form.type) || null}
        onChange={selected => setForm(prev => ({ ...prev, type: selected?.value || "" }))}
        placeholder="Choose Cover Type"
        className="w-full"
      />

      {/* MODELS */}
      {(form.subCategory === "iphone" || form.subCategory === "samsung") && (
        <div className="p-4 border rounded-lg max-h-64 overflow-y-auto">
          <p className="mb-2 text-gray-200">Select Models:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(form.subCategory === "iphone" ? iphoneModels : samsungModels).map(model => (
              <label key={model.value} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700 text-gray-100">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                  checked={tempModels.includes(model.value)}
                  onChange={e => {
                    if (e.target.checked) setTempModels(prev => [...prev, model.value]);
                    else setTempModels(prev => prev.filter(v => v !== model.value));
                  }}
                />
                {model.label}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, models: tempModels }))}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Selected Models
          </button>
          {form.models.length > 0 && <p className="mt-2 text-sm text-gray-400">Selected Models: {form.models.join(", ")}</p>}
        </div>
      )}

      {/* IMAGES */}
      <div>
        <p className="mb-2 text-gray-200">Images</p>
        <div className="flex gap-3 flex-wrap mb-3">
          {form.images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img.url} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg" />
              {img.color && (
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tr-md">
                  {img.color}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={colorForImage?.value || ""}
            onChange={e => {
              const selected = basicColors.find(c => c.value === e.target.value);
              setColorForImage(selected || null);
            }}
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="">Select Color (optional)</option>
            {basicColors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <button type="button" onClick={handleImageUpload} className="px-4 py-2 bg-blue-600 text-white rounded">
            + Upload
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-gray-800 text-white h-28" />

      {/* STOCK */}
      <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Overall Stock" className="w-full p-2 rounded bg-gray-800 text-white" />

      {/* TAG */}
      <Select
        options={predefinedTags}
        value={predefinedTags.find(opt => opt.value === form.tag) || null}
        onChange={selected => setForm(prev => ({ ...prev, tag: selected?.value || "" }))}
        className="w-full"
        placeholder="Select a Tag"
      />

      {/* SLUG */}
      <input name="slug" value={form.slug} readOnly className="w-full p-2 rounded bg-gray-700 text-gray-400" />

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={updateMutation.isLoading}
        className="w-full px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
      >
        {updateMutation.isLoading ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
