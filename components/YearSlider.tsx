"use client";

import React from "react";

interface YearSliderProps {
  value: number;
  onChange: (year: number) => void;
  min?: number;
  max?: number;
}

const YearSlider: React.FC<YearSliderProps> = ({ value, onChange, min = 1900, max = 2024 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (!Number.isNaN(next)) {
      onChange(next);
    }
  };

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="year-slider w-full"
      />
      <div className="mt-3 flex justify-between text-xs text-text-300">
        <span>{min}</span>
        <span>1950</span>
        <span>2000</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default YearSlider;

