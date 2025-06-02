
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
    <div className="flex items-center space-x-6 bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
        <label className="text-lg font-bold text-gray-800 whitespace-nowrap">
          Detection Sensitivity
        </label>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 font-semibold">High</span>
        <div className="relative">
          <input
            type="range"
            min="1.5"
            max="3.5"
            step="0.1"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-40 h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right,
                #fecaca 0%,
                #fed7aa 33%,
                #fef3c7 66%,
                #bbf7d0 100%)`
            }}
          />
          <style>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: linear-gradient(45deg, #F97316, #DC2626);
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: linear-gradient(45deg, #F97316, #DC2626);
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
          `}</style>
        </div>
        <span className="text-sm text-gray-600 font-semibold">Low</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-700 font-mono">
            |z| &gt; {value}
          </span>
        </div>
        <span className={`text-lg font-bold ${getSensitivityColor(value)} bg-white/80 px-3 py-1 rounded-lg border border-current/20`}>
          {getSensitivityLabel(value)}
        </span>
      </div>
    </div>
  );
};
