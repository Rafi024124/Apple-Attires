'use client';

import React, { useState, useEffect } from 'react';
import CoverCard from '../components/CoverCard';

const samsungModels = [
  "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25",
  "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
  "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
  "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
  "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21",
  "Galaxy A74", "Galaxy A73", "Galaxy A72", "Galaxy A71",
  "Galaxy A54", "Galaxy A53", "Galaxy A52", "Galaxy A34", "Galaxy A33",
  "Galaxy A24", "Galaxy A14", "Galaxy Z Fold 5", "Galaxy Z Flip 5",
  "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10",
].map(m => ({ label: m, value: m.toLowerCase().replace(/\s+/g,'-') }));

export default function SamsungCoversPage() {
  const [covers, setCovers] = useState([]);
  const [modelCounts, setModelCounts] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetchCovers();
  }, [selectedModel]);

  const fetchCovers = async () => {
    let url = `/api/covers?mainCategory=covers&subCategory=samsung`;
    if (selectedModel) url += `&model=${selectedModel}`;

    const res = await fetch(url);
    const data = await res.json();

    setCovers(data.covers || []);
    setModelCounts(data.modelCounts || []);
  };

  return (
    <div className="px-4 py-6 md:flex md:gap-6">
      
      {/* Sidebar for desktop / Horizontal list for mobile */}
      <aside className="md:w-60 md:shrink-0">
        <h2 className="font-bold text-lg mb-4 md:block hidden">Samsung Models</h2>

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
          {samsungModels.map(model => {
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
          {samsungModels.map(model => {
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
                  {model.label} <span className="text-orange-400">({count})</span>
                </button>
              </li>
            );
          })}
          
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 md:mt-0">
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
