
interface DataPoint {
  date: Date;
  value: number;
  isAnomaly: boolean;
  anomalyType: 'spike' | 'dip' | null;
  zScore: number;
}

export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });
      
      resolve(data);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const detectAnomalies = (
  data: any[],
  dateColumn: string,
  valueColumn: string,
  threshold: number = 2.5
): DataPoint[] => {
  // Parse and sort data
  const parsedData = data
    .map(row => ({
      date: new Date(row[dateColumn]),
      value: parseFloat(row[valueColumn])
    }))
    .filter(row => !isNaN(row.date.getTime()) && !isNaN(row.value))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate mean and standard deviation
  const values = parsedData.map(d => d.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  console.log(`Mean: ${mean.toFixed(2)}, StdDev: ${stdDev.toFixed(2)}, Threshold: ${threshold}`);

  // Detect anomalies using Z-score
  return parsedData.map(point => {
    const zScore = (point.value - mean) / stdDev;
    const isAnomaly = Math.abs(zScore) > threshold;
    
    return {
      ...point,
      isAnomaly,
      anomalyType: isAnomaly ? (zScore > 0 ? 'spike' : 'dip') : null,
      zScore
    };
  });
};
