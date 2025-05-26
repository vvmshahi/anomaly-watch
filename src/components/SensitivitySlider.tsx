
interface SensitivitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const SensitivitySlider = ({ value, onChange }: SensitivitySliderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sensitivity
      </label>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">High</span>
        <input
          type="range"
          min="1.5"
          max="3.5"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-gray-500">Low</span>
      </div>
      <span className="text-sm text-gray-600 font-mono">|z| > {value}</span>
    </div>
  );
};
