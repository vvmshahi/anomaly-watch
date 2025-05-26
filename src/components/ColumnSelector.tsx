
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
  const canProcess = selectedDateColumn && selectedValueColumn;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Column
          </label>
          <select
            value={selectedDateColumn}
            onChange={(e) => onDateColumnChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select date column...</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Column
          </label>
          <select
            value={selectedValueColumn}
            onChange={(e) => onValueColumnChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select value column...</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={!canProcess}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          canProcess
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Analyze Data
      </button>
    </div>
  );
};
