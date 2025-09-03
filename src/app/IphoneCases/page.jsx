'use client';

import React, { useState, useEffect } from 'react';
import CoverCard from '../components/CoverCard';

const iphoneModels = [
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
  "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13 Mini", "iPhone 13",
  "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12 Mini", "iPhone 12",
  "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
  "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
  "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7",
  "iPhone 6s Plus", "iPhone 6s", "iPhone SE (2022)", "iPhone SE (2020)"
].map(m => ({ label: m, value: m.toLowerCase().replace(/\s+/g,'-') }));

export default function IphoneCoversPage() {
  const [covers, setCovers] = useState([]);
  const [modelCounts, setModelCounts] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetchCovers();
  }, [selectedModel]);

  const fetchCovers = async () => {
    let url = `/api/covers?mainCategory=covers&subCategory=iphone`;
    if (selectedModel) url += `&model=${selectedModel}`;

    const res = await fetch(url);
    const data = await res.json();

    setCovers(data.covers || []);
    setModelCounts(data.modelCounts || []);
  };

  return (
    <div className="px-4 py-6 md:flex md:gap-6">
      
      {/* Sidebar for desktop / Horizontal list for mobile */}
      <aside className="md:w-60 md:shrink-0 bg-gray-100 text-black">
        <h2 className="font-bold text-lg mb-4 md:block hidden">iPhone Models</h2>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden overflow-x-auto pb-3 gap-2">
           <button
            className={`
              whitespace-nowrap px-4 py-2 rounded-full border 
              ${selectedModel === '' 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
            `}
            onClick={() => setSelectedModel('')}
          >
            All
          </button>
          {iphoneModels.map(model => {
            const countObj = modelCounts.find(m => m.model === model.value);
            const count = countObj ? countObj.count : 0;
            return (
              <button
                key={model.value}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-full border 
                  ${selectedModel === model.value 
                    ? 'bg-orange-500 text-white border-orange-500' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
                `}
                onClick={() => setSelectedModel(model.value)}
              >
                {model.label} ({count})
              </button>
            );
          })}
         
        </div>

        {/* Desktop: vertical list */}
        <ul className="space-y-2 hidden md:block">
          <li>
            <button
              className={`
                text-left w-full px-3 py-1 rounded hover:bg-gray-200
                ${selectedModel === '' ? 'bg-gray-300 font-semibold' : ''}
              `}
              onClick={() => setSelectedModel('')}
            >
              All Models
            </button>
          </li>
          {iphoneModels.map(model => {
            const countObj = modelCounts.find(m => m.model === model.value);
            const count = countObj ? countObj.count : 0;
            return (
              <li key={model.value}>
                <button
                  className={`
                    text-left w-full px-3 py-1 rounded hover:bg-orange-500
                    ${selectedModel === model.value 
                      ? 'bg-orange-500 text-white font-semibold' 
                      : ''}
                  `}
                  onClick={() => setSelectedModel(model.value)}
                >
                  {model.label} <span>({count})</span>
                </button>
              </li>
            );
          })}
          
        </ul>
      </aside>

      {/* Main Section */}
     <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 self-start">

        {covers.map(item => (
          <CoverCard key={item._id} item={item} />
        ))}
        {covers.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No covers found for this model.
          </p>
        )}
      </main>
    </div>
  );
}
