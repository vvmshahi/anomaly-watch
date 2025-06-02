
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
          `${payload.anomalyType === 'spike' ? '🔺 Spike' : '🔻 Dip'} (z=${payload.zScore.toFixed(2)})`
        ];
      }
      return [`${value.toFixed(2)}`, 'Value'];
    }
    return [value, name];
  };

  return (
    <div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              fontWeight={500}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12} 
              fontWeight={500}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(value) => `📅 Date: ${new Date(value).toLocaleDateString()}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#F97316"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#F97316', stroke: 'white', strokeWidth: 2 }}
            />
            {anomalies.map((anomaly, index) => (
              <Scatter
                key={index}
                data={[anomaly]}
                fill={anomaly.anomalyType === 'spike' ? '#DC2626' : '#7C2D12'}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Enhanced Legend */}
      <div className="mt-6 flex items-center justify-center space-x-8 text-sm bg-gray-50 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
          <span className="font-medium text-gray-700">Normal Values</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 rounded-full shadow-sm"></div>
          <span className="font-medium text-gray-700">Spike Anomalies</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-900 rounded-full shadow-sm"></div>
          <span className="font-medium text-gray-700">Dip Anomalies</span>
        </div>
      </div>
    </div>
  );
};
