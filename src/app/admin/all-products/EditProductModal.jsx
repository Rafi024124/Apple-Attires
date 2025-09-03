"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";

// Simple modal wrapper
function SimpleModal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}

// Basic color options for images
const basicColors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "orange", label: "Orange" },
  { value: "gray", label: "Gray" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
];

// Predefined models
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
].map((model) => ({ value: model.toLowerCase().replace(/\s+/g, "-"), label: model }));

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
].map((model) => ({ value: model.toLowerCase().replace(/\s+/g, "-"), label: model }));

// Predefined tag options
const tagOptions = [
  { value: "limited-edition", label: "Limited Edition" },
  { value: "new-arrival", label: "New Arrival" },
  { value: "bestseller", label: "Best Seller" },
  { value: "exclusive", label: "Exclusive" },
];

export default function EditProductModal({ open, onClose, product, onUpdated }) {
  const [form, setForm] = useState({
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
    tag: null,
    isFeatured: false,
    isAvailable: true,
    slug: "",
  });

  const [colorForImage, setColorForImage] = useState(null);
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    if (product) {
      const loadedForm = {
        name: product.name || "",
        price: product.price || "",
        discount: product.discount || "",
        discountEnd: product.discountEnd ? new Date(product.discountEnd).toISOString().slice(0, 10) : "",
        brand: product.brand || "",
        mainCategory: product.mainCategory || "",
        subCategory: product.subCategory || "",
        models: product.models || [],
        type: product.type || "",
        gender: product.gender || "Unisex",
        images: product.images || [],
        description: product.description || "",
        stock: product.stock || "",
        tag: product.tag ? { value: product.tag, label: product.tag } : null,
        isFeatured: product.isFeatured || false,
        isAvailable: product.isAvailable ?? true,
        slug: product.slug || "",
      };
      setForm(loadedForm);
      setInitialForm(loadedForm);
      setColorForImage(null);
    }
  }, [product, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      slug: name === "name" ? value.toLowerCase().replace(/\s+/g, "-") : prev.slug,
    }));
  };

  const handleModelsChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      models: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleTagChange = (selectedOption) => {
    setForm((prev) => ({ ...prev, tag: selectedOption }));
  };

  const getModelsOptions = () => {
    let options = [];
    if (form.subCategory === "iphone") options = iphoneModels;
    else if (form.subCategory === "samsung") options = samsungModels;
    return options.filter((opt) => !form.models.includes(opt.value));
  };

  const selectedModels = (() => {
    const options = form.subCategory === "iphone" ? iphoneModels : form.subCategory === "samsung" ? samsungModels : [];
    return form.models.map((value) => options.find((opt) => opt.value === value)).filter(Boolean);
  })();

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleImageUpload = () => {
    if (!window.cloudinary) {
      alert("Cloudinary widget not loaded.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const newImage = { color: colorForImage?.value || null, url: result.info.secure_url };
          setForm((prev) => ({ ...prev, images: [...prev.images, newImage] }));
          setColorForImage(null);
        }
      }
    );
    widget.open();
  };

  const handleCancel = () => {
    if (initialForm) setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/covers/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tag: form.tag?.value || "" }),
      });
      const updatedProduct = await res.json();
      if (res.ok) {
        if (onUpdated) onUpdated(updatedProduct);
        onClose();
      } else {
        alert(updatedProduct.error || "Failed to update product.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  return (
    <SimpleModal 
    
    open={open} onClose={handleCancel} title="Edit Product">
      <form onSubmit={handleSubmit} className="space-y-4 text-black bg-white">

        {/* NAME */}
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " required />

        {/* PRICE & DISCOUNT */}
        <div className="flex gap-4 bg-white">
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " required />
          <input type="number" name="discount" placeholder="Discount (%)" value={form.discount} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " />
          <input type="date" name="discountEnd" placeholder="Discount End Date" value={form.discountEnd} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " />
        </div>

        {/* BRAND */}
        <input type="text" name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " />

        {/* MAIN CATEGORY */}
        <select name="mainCategory" value={form.mainCategory} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 ">
          <option value="">Select Main Category</option>
          <option value="covers">Covers</option>
          <option value="protectors">Screen Protectors</option>
          <option value="lens-protector">Lens Protector</option>
          <option value="charger">Charger</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* TYPE & GENDER */}
        <div className="flex gap-4 ">
          <input type="text" name="type" placeholder="Type" value={form.type} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " />
          <select name="gender" value={form.gender} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 ">
            <option value="Unisex">Unisex</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* SUB CATEGORY */}
        <select name="subCategory" value={form.subCategory} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 ">
          <option value="">Select Sub Category</option>
          <option value="iphone">iPhone</option>
          <option value="samsung">Samsung</option>
          <option value="others">Others</option>
        </select>

        {/* MODELS */}
        {(form.subCategory === "iphone" || form.subCategory === "samsung") && (
          <Select
            isMulti
            options={getModelsOptions()}
            value={selectedModels}
            onChange={handleModelsChange}
            className="w-full bg-white border-orange-400 border-2 "
            placeholder="Select model(s)..."
            closeMenuOnSelect={false}
          />
        )}

        {/* IMAGE UPLOADS */}
        <div>
          <label className="block mb-1 font-semibold">Images</label>
          <div className="flex gap-2 flex-wrap mb-2 max-h-40 overflow-auto">
            {form.images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.url} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
                {img.color && <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br">{img.color}</div>}
                <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 rounded-full text-white w-5 h-5">
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <select value={colorForImage?.value || ""} onChange={(e) => setColorForImage(basicColors.find(c => c.value === e.target.value) || null)} className="input w-full bg-white border-orange-400 border-2 ">
              <option value="">Select Color (optional)</option>
              {basicColors.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="button" onClick={handleImageUpload} className="p-2 rounded-2xl text-white bg-blue-500 border-2  underline text-sm">+ Upload Image</button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input h-24 w-full bg-white border-orange-400 border-2 " />

        {/* STOCK */}
        <input type="number" name="stock" placeholder="Overall Stock" value={form.stock} onChange={handleChange} className="input w-full bg-white border-orange-400 border-2 " />

        {/* TAG */}
        <Select
          options={tagOptions}
          value={form.tag}
          onChange={handleTagChange}
          className="w-full bg-white border-orange-400 border-2 "
          placeholder="Select Tag"
        />

        {/* CHECKBOXES */}
        <div className="flex gap-6 items-center">
          <label>
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured
          </label>
          <label>
            <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} /> Available
          </label>
        </div>

        {/* SLUG */}
        <input type="text" name="slug" value={form.slug} readOnly className="input text-gray-400 w-full bg-white border-orange-400 border-2 " />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={handleCancel} className="px-4 bg-red-600 py-2 rounded border border-gray-300">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Product</button>
        </div>
      </form>
    </SimpleModal>
  );
}
