
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnomalyChart } from "@/components/AnomalyChart";
import { InsightsSummary } from "@/components/InsightsSummary";
import { ColumnSelector } from "@/components/ColumnSelector";
import { SensitivitySlider } from "@/components/SensitivitySlider";
import { parseCSV, detectAnomalies } from "@/utils/dataProcessing";

interface DataPoint {
  date: Date;
  value: number;
  isAnomaly: boolean;
  anomalyType: 'spike' | 'dip' | null;
  zScore: number;
}

const Index = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedDateColumn, setSelectedDateColumn] = useState<string>("");
  const [selectedValueColumn, setSelectedValueColumn] = useState<string>("");
  const [processedData, setProcessedData] = useState<DataPoint[]>([]);
  const [sensitivity, setSensitivity] = useState(2.5);

  const handleFileUpload = (file: File) => {
    parseCSV(file).then((data) => {
      setCsvData(data);
      setColumns(Object.keys(data[0] || {}));
      console.log("CSV parsed:", data);
    });
  };

  const handleProcessData = () => {
    if (csvData.length > 0 && selectedDateColumn && selectedValueColumn) {
      const processed = detectAnomalies(csvData, selectedDateColumn, selectedValueColumn, sensitivity);
      setProcessedData(processed);
      console.log("Anomalies detected:", processed.filter(d => d.isAnomaly));
    }
  };

  const anomalies = processedData.filter(d => d.isAnomaly);
  const spikes = anomalies.filter(a => a.anomalyType === 'spike').sort((a, b) => b.zScore - a.zScore);
  const dips = anomalies.filter(a => a.anomalyType === 'dip').sort((a, b) => a.zScore - b.zScore);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Anomaly Watch</h1>
          <p className="text-gray-600 mt-1">Time Series Spike Detector</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        {csvData.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <FileUpload onUpload={handleFileUpload} />
          </div>
        )}

        {/* Column Selection */}
        {csvData.length > 0 && processedData.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Columns</h2>
            <ColumnSelector
              columns={columns}
              selectedDateColumn={selectedDateColumn}
              selectedValueColumn={selectedValueColumn}
              onDateColumnChange={setSelectedDateColumn}
              onValueColumnChange={setSelectedValueColumn}
              onProcess={handleProcessData}
            />
          </div>
        )}

        {/* Main Analysis View */}
        {processedData.length > 0 && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <SensitivitySlider
                  value={sensitivity}
                  onChange={(value) => {
                    setSensitivity(value);
                    handleProcessData();
                  }}
                />
                <button
                  onClick={() => {
                    setCsvData([]);
                    setProcessedData([]);
                    setColumns([]);
                    setSelectedDateColumn("");
                    setSelectedValueColumn("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Upload New File
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <AnomalyChart data={processedData} />
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <InsightsSummary
                anomalies={anomalies}
                spikes={spikes.slice(0, 2)}
                dips={dips.slice(0, 2)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built by Your Name · Detect what matters</p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="#" className="hover:text-gray-800 transition-colors">GitHub</a>
              <a href="#" className="hover:text-gray-800 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
