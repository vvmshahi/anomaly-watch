
import { useRef } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      onUpload(file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      onUpload(file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <FileSpreadsheet className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Upload Your Time Series Data</h2>
      </div>
      
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        Transform your raw data into actionable insights. Our intelligent system will automatically detect patterns, anomalies, and trends in your time series.
      </p>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-2xl p-12 hover:bg-orange-50/50 transition-all duration-300 cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-10 w-10 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">
              Drop your CSV file here or click to browse
            </h3>
            <p className="text-slate-600">
              Supports CSV files with datetime and numeric columns
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 text-left max-w-lg mx-auto border border-orange-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-slate-800">Expected Format:</p>
            </div>
            <div className="font-mono text-sm text-slate-700 space-y-1 bg-white rounded-lg p-4 border">
              <div className="text-orange-600 font-medium">date,temperature,humidity,pressure</div>
              <div>2023-01-01,23.5,65.2,1013.2</div>
              <div>2023-01-02,24.1,67.8,1012.8</div>
              <div>2023-01-03,22.9,64.5,1014.1</div>
            </div>
          </div>

          <button className="mt-6 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
            Select Your Dataset
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span>Automatic column detection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
          <span>Smart anomaly detection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
          <span>Interactive visualizations</span>
        </div>
      </div>
    </div>
  );
};
