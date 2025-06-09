import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnomalyChart } from "@/components/AnomalyChart";
import { InsightsSummary } from "@/components/InsightsSummary";
import { ColumnSelector } from "@/components/ColumnSelector";
import { SensitivitySlider } from "@/components/SensitivitySlider";
import { parseCSV, detectAnomalies } from "@/utils/dataProcessing";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Anomaly Watch</span>
              <span className="text-sm text-gray-500 font-medium">AI Intelligence Suite</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">Home</a>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">About</button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>About DataPulse</DialogTitle>
                  </DialogHeader>
                  <p className="text-gray-600 leading-relaxed">
                    DataPulse is designed to make data exploration fast, intelligent, and accessible. Upload your CSVs and watch as AI instantly breaks down patterns, distributions, and key correlations — no coding required. With built-in visualizations and GPT-powered insights, DataPulse helps analysts and business teams make smarter decisions, faster.
                  </p>
                </DialogContent>
              </Dialog>
              <a href="https://github.com/vvmshahi" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">GitHub</a>
              <a href="https://www.linkedin.com/in/vvmshahin" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">LinkedIn</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {csvData.length === 0 && (
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-red-500 bg-clip-text text-transparent leading-tight">
                Intelligent Anomaly Detection
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Harness the power of AI to detect patterns, spikes, and anomalies in your time series data with precision and speed.
              </p>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8 max-w-2xl mx-auto">
                <FileUpload onUpload={handleFileUpload} />
              </div>
            </div>
          </div>
          
          {/* Background decorations */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        </section>
      )}

      {/* How It Works Section */}
      {csvData.length === 0 && (
        <section className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Three simple steps to unlock insights from your data</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Upload Your Data</h3>
                <p className="text-gray-600 text-center">Simply drag and drop your CSV file containing time series data</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">AI Configuration</h3>
                <p className="text-gray-600 text-center">Our AI suggests optimal column mappings and sensitivity settings</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Get Insights</h3>
                <p className="text-gray-600 text-center">View interactive charts and detailed anomaly analysis instantly</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Column Selection */}
        {csvData.length > 0 && processedData.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Configure Data Columns</h2>
                <p className="text-gray-600 text-lg mt-1">Our AI has analyzed your dataset and suggests optimal mappings</p>
              </div>
            </div>
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Detection Settings</h3>
                    <p className="text-gray-600">Fine-tune sensitivity for optimal anomaly detection</p>
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
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 transform hover:scale-105"
                >
                  Upload New Dataset
                </button>
              </div>
            </div>

            {/* Enhanced Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Time Series Analysis</h2>
                  <p className="text-gray-600 text-lg">Interactive visualization of your data with anomaly detection</p>
                </div>
              </div>
              <AnomalyChart data={processedData} />
            </div>

            {/* Enhanced Insights */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Intelligence Summary</h2>
                  <p className="text-gray-600 text-lg">AI-powered insights and anomaly breakdown</p>
                </div>
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
      <footer className="bg-white border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Anomaly Watch</span>
            </div>
            <p className="text-gray-600 mb-6 text-lg">
              Part of the AI Intelligence Suite · Created with ❤️ by{' '}
              <a 
                href="https://www.shahin.studio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-orange-500 hover:text-orange-600 transition-colors font-medium hover:underline"
              >
                Shahin
              </a>
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <a 
                href="https://github.com/vvmshahi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-orange-500 transition-colors font-medium hover:underline"
              >
                GitHub
              </a>
              <a 
                href="https://www.linkedin.com/in/vvmshahin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-orange-500 transition-colors font-medium hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
