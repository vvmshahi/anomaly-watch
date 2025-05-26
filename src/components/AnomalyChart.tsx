
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart } from 'recharts';

interface DataPoint {
  date: Date;
  value: number;
  isAnomaly: boolean;
  anomalyType: 'spike' | 'dip' | null;
  zScore: number;
}

interface AnomalyChartProps {
  data: DataPoint[];
}

export const AnomalyChart = ({ data }: AnomalyChartProps) => {
  const chartData = data.map((point) => ({
    date: point.date.toISOString().split('T')[0],
    value: point.value,
    isAnomaly: point.isAnomaly,
    anomalyType: point.anomalyType,
    zScore: point.zScore,
  }));

  const anomalies = chartData.filter(d => d.isAnomaly);

  const formatTooltip = (value: any, name: string, props: any) => {
    if (name === 'value') {
      const { payload } = props;
      if (payload.isAnomaly) {
        return [
          `${value.toFixed(2)}`,
          `${payload.anomalyType === 'spike' ? 'Spike' : 'Dip'} (z=${payload.zScore.toFixed(2)})`
        ];
      }
      return [`${value.toFixed(2)}`, 'Value'];
    }
    return [value, name];
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Time Series with Anomalies</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#2563eb' }}
            />
            {anomalies.map((anomaly, index) => (
              <Scatter
                key={index}
                data={[anomaly]}
                fill={anomaly.anomalyType === 'spike' ? '#ef4444' : '#dc2626'}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Anomaly markers overlay */}
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span>Normal Values</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Anomalies</span>
        </div>
      </div>
    </div>
  );
};
