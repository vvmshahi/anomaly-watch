
import { useState, useEffect } from "react";
import { Brain, Calendar, TrendingUp } from "lucide-react";

interface ColumnSelectorProps {
  columns: string[];
  selectedDateColumn: string;
  selectedValueColumn: string;
  onDateColumnChange: (column: string) => void;
  onValueColumnChange: (column: string) => void;
  onProcess: () => void;
}

export const ColumnSelector = ({
  columns,
  selectedDateColumn,
  selectedValueColumn,
  onDateColumnChange,
  onValueColumnChange,
  onProcess,
}: ColumnSelectorProps) => {
  const [aiSuggestions, setAiSuggestions] = useState<{
    dateColumn: string;
    valueColumn: string;
    confidence: number;
  } | null>(null);

  // AI-powered column suggestion logic
  useEffect(() => {
    if (columns.length > 0) {
      const dateKeywords = ['date', 'time', 'timestamp', 'datetime', 'created', 'updated', 'day', 'month', 'year'];
      const valueKeywords = ['value', 'amount', 'price', 'cost', 'revenue', 'temperature', 'pressure', 'humidity', 'speed', 'count', 'total', 'sum', 'avg', 'mean'];
      
      // Find best date column
      let bestDateColumn = '';
      let dateScore = 0;
      
      columns.forEach(col => {
        const colLower = col.toLowerCase();
        const score = dateKeywords.reduce((acc, keyword) => {
          return acc + (colLower.includes(keyword) ? keyword.length : 0);
        }, 0);
        
        if (score > dateScore) {
          dateScore = score;
          bestDateColumn = col;
        }
      });
      
      // Find best value column
      let bestValueColumn = '';
      let valueScore = 0;
      
      columns.forEach(col => {
        if (col === bestDateColumn) return; // Skip date column
        
        const colLower = col.toLowerCase();
        const score = valueKeywords.reduce((acc, keyword) => {
          return acc + (colLower.includes(keyword) ? keyword.length : 0);
        }, 0);
        
        if (score > valueScore) {
          valueScore = score;
          bestValueColumn = col;
        }
      });
      
      // If no keyword matches, use heuristics
      if (!bestDateColumn && columns.length > 0) {
        bestDateColumn = columns[0]; // First column often contains dates
      }
      
      if (!bestValueColumn && columns.length > 1) {
        bestValueColumn = columns.find(col => col !== bestDateColumn) || columns[1];
      }
      
      const confidence = Math.min(95, (dateScore + valueScore) * 10 + 50);
      
      setAiSuggestions({
        dateColumn: bestDateColumn,
        valueColumn: bestValueColumn,
        confidence
      });
      
      // Auto-select if confidence is high
      if (confidence > 70) {
        if (bestDateColumn && !selectedDateColumn) {
          onDateColumnChange(bestDateColumn);
        }
        if (bestValueColumn && !selectedValueColumn) {
          onValueColumnChange(bestValueColumn);
        }
      }
    }
  }, [columns, selectedDateColumn, selectedValueColumn, onDateColumnChange, onValueColumnChange]);

  const canProcess = selectedDateColumn && selectedValueColumn;

  const applySuggestions = () => {
    if (aiSuggestions) {
      onDateColumnChange(aiSuggestions.dateColumn);
      onValueColumnChange(aiSuggestions.valueColumn);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions Card */}
      {aiSuggestions && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-slate-800">AI Column Suggestions</h3>
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {aiSuggestions.confidence}% confident
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                Our AI analyzed your dataset and suggests the following column mapping for optimal results:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-slate-800">Date Column</span>
                  </div>
                  <span className="text-purple-700 font-mono bg-purple-100 px-2 py-1 rounded">
                    {aiSuggestions.dateColumn}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-slate-800">Value Column</span>
                  </div>
                  <span className="text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">
                    {aiSuggestions.valueColumn}
                  </span>
                </div>
              </div>
              <button
                onClick={applySuggestions}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
              >
                Apply AI Suggestions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <label className="text-base font-semibold text-slate-800">
              Date/Time Column
            </label>
          </div>
          <select
            value={selectedDateColumn}
            onChange={(e) => onDateColumnChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-800 font-medium"
          >
            <option value="">Choose your date column...</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          {selectedDateColumn && (
            <p className="text-sm text-green-600 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Date column selected</span>
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <label className="text-base font-semibold text-slate-800">
              Numeric Value Column
            </label>
          </div>
          <select
            value={selectedValueColumn}
            onChange={(e) => onValueColumnChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-800 font-medium"
          >
            <option value="">Choose your value column...</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          {selectedValueColumn && (
            <p className="text-sm text-green-600 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Value column selected</span>
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onProcess}
          disabled={!canProcess}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            canProcess
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {canProcess ? "🚀 Start Anomaly Analysis" : "Select Both Columns to Continue"}
        </button>
      </div>
    </div>
  );
};
