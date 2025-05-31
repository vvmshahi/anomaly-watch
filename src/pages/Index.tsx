
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Anomaly Watch
              </h1>
              <p className="text-slate-600 mt-1 text-lg">Intelligent Time Series Spike Detection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        {csvData.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <FileUpload onUpload={handleFileUpload} />
          </div>
        )}

        {/* Column Selection */}
        {csvData.length > 0 && processedData.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Configure Data Columns</h2>
            </div>
            <p className="text-slate-600 mb-6">
              Our AI has analyzed your dataset. Select the appropriate columns for time series analysis.
            </p>
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
          <div className="space-y-8">
            {/* Enhanced Controls */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Detection Settings</h3>
                    <p className="text-sm text-slate-600">Adjust sensitivity for optimal anomaly detection</p>
                  </div>
                </div>
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
                  className="px-6 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-300 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  Upload New Dataset
                </button>
              </div>
            </div>

            {/* Enhanced Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Time Series Analysis</h2>
              </div>
              <AnomalyChart data={processedData} />
            </div>

            {/* Enhanced Insights */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Intelligence Summary</h2>
              </div>
              <InsightsSummary
                anomalies={anomalies}
                spikes={spikes.slice(0, 2)}
                dips={dips.slice(0, 2)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-slate-800">Anomaly Watch</span>
            </div>
            <p className="text-slate-600 mb-4">Built with ❤️ by Your Name · Detect what matters</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">GitHub</a>
              <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">LinkedIn</a>
              <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
