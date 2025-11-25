import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  description: string;
  colorClass: string;
}

const SliderControl: React.FC<SliderControlProps> = ({ 
  label, 
  value, 
  onChange, 
  description,
  colorClass 
}) => {
  return (
    <div className="mb-5 group">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-200">{label}</label>
        <span className={`text-sm font-bold ${colorClass}`}>{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:bg-gray-600 transition-colors"
      />
      <p className="text-xs text-gray-500 mt-1 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {description}
      </p>
    </div>
  );
};

export default SliderControl;