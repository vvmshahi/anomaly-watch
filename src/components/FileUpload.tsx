
import { useRef } from "react";
import { Upload } from "lucide-react";

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
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Upload Time Series Data</h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-gray-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Upload your CSV file</p>
        <p className="text-gray-600 mb-4">
          Upload a time series CSV with a datetime column and a numeric value column
        </p>
        <div className="bg-gray-50 rounded-md p-4 text-sm text-left max-w-md mx-auto">
          <p className="font-medium mb-2">Expected format:</p>
          <div className="font-mono text-xs">
            <div>date,value</div>
            <div>2023-01-01,100.5</div>
            <div>2023-01-02,102.1</div>
            <div>2023-01-03,98.7</div>
          </div>
        </div>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Choose File
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
