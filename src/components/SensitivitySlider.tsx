
interface SensitivitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const SensitivitySlider = ({ value, onChange }: SensitivitySliderProps) => {
  const getSensitivityLabel = (val: number) => {
    if (val <= 2.0) return "Very High";
    if (val <= 2.5) return "High";
    if (val <= 3.0) return "Medium";
    return "Low";
  };

  const getSensitivityColor = (val: number) => {
    if (val <= 2.0) return "text-red-600";
    if (val <= 2.5) return "text-orange-600";
    if (val <= 3.0) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="flex items-center space-x-6 bg-white/80 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
        <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          Sensitivity
        </label>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-xs text-slate-500 font-medium">High</span>
        <div className="relative">
          <input
            type="range"
            min="1.5"
            max="3.5"
            step="0.1"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-32 h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                #fecaca 0%, 
                #fed7aa 33%, 
                #fef3c7 66%, 
                #bbf7d0 100%)`
            }}
          />
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: linear-gradient(45deg, #8b5cf6, #a855f7);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .slider::-moz-range-thumb {
              height: 18px;
              width: 18px;
              border-radius: 50%;
              background: linear-gradient(45deg, #8b5cf6, #a855f7);
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
          `}</style>
        </div>
        <span className="text-xs text-slate-500 font-medium">Low</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">
          |z| &gt; {value}
        </span>
        <span className={`text-sm font-semibold ${getSensitivityColor(value)}`}>
          {getSensitivityLabel(value)}
        </span>
      </div>
    </div>
  );
};
