"use client";

import { useState, useRef, useEffect } from "react";

interface PriceSliderProps {
  min?: number;
  max?: number;
  defaultMin?: number;
  defaultMax?: number;
  onChange?: (min: number, max: number) => void;
}

export default function PriceSlider({
  min = 0,
  max = 1000,
  defaultMin = 0,
  defaultMax = 1000,
  onChange,
}: PriceSliderProps) {
  const [minVal, setMinVal] = useState(defaultMin);
  const [maxVal, setMaxVal] = useState(defaultMax);
  const rangeRef = useRef<HTMLDivElement>(null);

  const updateRange = (newMin: number, newMax: number) => {
    if (rangeRef.current) {
      const minPercent = ((newMin - min) / (max - min)) * 100;
      const maxPercent = ((newMax - min) / (max - min)) * 100;
      rangeRef.current.style.left = minPercent + "%";
      rangeRef.current.style.width = maxPercent - minPercent + "%";
    }
    onChange?.(newMin, newMax);
  };

  useEffect(() => {
    updateRange(minVal, maxVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minVal, maxVal]);

  const handleMinChange = (val: number) => {
    const v = Math.min(val, maxVal);
    setMinVal(v);
  };

  const handleMaxChange = (val: number) => {
    const v = Math.max(val, minVal);
    setMaxVal(v);
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-2xl lg:text-3xl font-medium">Filter by price</h4>
      <div className="relative pt-2">
        <div className="slider-track">
          <div className="slider-range" ref={rangeRef} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          className="slider slider-min"
          onChange={(e) => handleMinChange(Number(e.target.value))}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          className="slider slider-max"
          onChange={(e) => handleMaxChange(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:justify-end">
        <div className="flex flex-col gap-1">
          <input
            type="number"
            value={minVal}
            className="border border-[#403c39] p-2.5 w-24 lg:w-20 text-sm"
            onChange={(e) => handleMinChange(Number(e.target.value))}
          />
          <label className="text-xs lg:text-sm">Min Price</label>
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="number"
            value={maxVal}
            className="border border-[#403c39] p-2.5 w-24 lg:w-20 text-sm"
            onChange={(e) => handleMaxChange(Number(e.target.value))}
          />
          <label className="text-xs lg:text-sm">Max Price</label>
        </div>
      </div>
    </div>
  );
}
