
interface DataPoint {
  date: Date;
  value: number;
  isAnomaly: boolean;
  anomalyType: 'spike' | 'dip' | null;
  zScore: number;
}

interface InsightsSummaryProps {
  anomalies: DataPoint[];
  spikes: DataPoint[];
  dips: DataPoint[];
}

export const InsightsSummary = ({ anomalies, spikes, dips }: InsightsSummaryProps) => {
  const calculatePercentChange = (point: DataPoint, baseline: number) => {
    const change = ((point.value - baseline) / baseline) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Calculate baseline (median of all values)
  const allValues = anomalies.map(a => a.value);
  const baseline = allValues.length > 0 ? 
    allValues.sort((a, b) => a - b)[Math.floor(allValues.length / 2)] : 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Summary Stats */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">{anomalies.length}</div>
              <div className="text-sm font-medium text-gray-700">Anomalies Detected</div>
            </div>
          </div>
          {anomalies.length > 0 && (
            <div className="text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
              🔺 {spikes.length} spikes • 🔻 {dips.length} dips
            </div>
          )}
        </div>

        {/* Top Spikes */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="font-bold text-red-800 text-lg">Highest Spikes</h4>
          </div>
          {spikes.length > 0 ? (
            <div className="space-y-3">
              {spikes.map((spike, index) => (
                <div key={index} className="bg-white/70 rounded-lg p-3 border border-red-200/30">
                  <div className="font-semibold text-red-700 text-sm">
                    📅 {spike.date.toLocaleDateString()}
                  </div>
                  <div className="text-red-600 font-bold">
                    {spike.value.toFixed(2)} ({calculatePercentChange(spike, baseline)})
                  </div>
                  <div className="text-xs text-red-500">
                    Z-Score: {spike.zScore.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-white/70 rounded-lg p-3">No spikes detected</div>
          )}
        </div>

        {/* Top Dips */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <h4 className="font-bold text-blue-800 text-lg">Largest Dips</h4>
          </div>
          {dips.length > 0 ? (
            <div className="space-y-3">
              {dips.map((dip, index) => (
                <div key={index} className="bg-white/70 rounded-lg p-3 border border-blue-200/30">
                  <div className="font-semibold text-blue-700 text-sm">
                    📅 {dip.date.toLocaleDateString()}
                  </div>
                  <div className="text-blue-600 font-bold">
                    {dip.value.toFixed(2)} ({calculatePercentChange(dip, baseline)})
                  </div>
                  <div className="text-xs text-blue-500">
                    Z-Score: {dip.zScore.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-white/70 rounded-lg p-3">No dips detected</div>
          )}
        </div>
      </div>

      {/* AI Summary Text */}
      {anomalies.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">🤖 AI Analysis</h4>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-orange-600">{anomalies.length} anomalies detected</strong> in your time series data.
                {spikes.length > 0 && (
                  <span className="text-red-600"> The most significant spike occurred on <strong>{spikes[0].date.toLocaleDateString()}</strong> with a {calculatePercentChange(spikes[0], baseline)} deviation from baseline.</span>
                )}
                {dips.length > 0 && (
                  <span className="text-blue-600"> The largest drop was observed on <strong>{dips[0].date.toLocaleDateString()}</strong> showing a {calculatePercentChange(dips[0], baseline)} decrease.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
