
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
      <h3 className="text-lg font-semibold mb-4">Anomaly Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{anomalies.length}</div>
          <div className="text-sm text-gray-600">Anomalies Detected</div>
          {anomalies.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {spikes.length} spikes, {dips.length} dips
            </div>
          )}
        </div>

        {/* Top Spikes */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Highest Spikes</h4>
          {spikes.length > 0 ? (
            <div className="space-y-2">
              {spikes.map((spike, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-red-700">
                    {spike.date.toLocaleDateString()}
                  </div>
                  <div className="text-red-600">
                    {spike.value.toFixed(2)} ({calculatePercentChange(spike, baseline)})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No spikes detected</div>
          )}
        </div>

        {/* Top Dips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Largest Dips</h4>
          {dips.length > 0 ? (
            <div className="space-y-2">
              {dips.map((dip, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-blue-700">
                    {dip.date.toLocaleDateString()}
                  </div>
                  <div className="text-blue-600">
                    {dip.value.toFixed(2)} ({calculatePercentChange(dip, baseline)})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No dips detected</div>
          )}
        </div>
      </div>

      {/* Summary Text */}
      {anomalies.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            <strong>{anomalies.length} anomalies found.</strong>
            {spikes.length > 0 && (
              <span> Highest spike on {spikes[0].date.toLocaleDateString()} ({calculatePercentChange(spikes[0], baseline)}).</span>
            )}
            {dips.length > 0 && (
              <span> Largest drop on {dips[0].date.toLocaleDateString()} ({calculatePercentChange(dips[0], baseline)}).</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
