import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CPUChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCPU = async () => {
      const now = Math.floor(Date.now() / 1000);
      const oneHourAgo = now - 3600;
      // const promqlQuery =
      //   '100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)';
      // const promqlQuery =
      //   '100 * (1 - sum by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) / sum by(instance)(rate(node_cpu_seconds_total[5m])))';
      const promqlQuery =
        '100 * (1 - sum by(instance)(irate(node_cpu_seconds_total{mode="idle"}[5m])) / sum by(instance)(irate(node_cpu_seconds_total[5m])))';
      const url = `http://10.8.8.108:9090/api/v1/query_range?query=${encodeURIComponent(
        promqlQuery,
      )}&start=${oneHourAgo}&end=${now}&step=60`;

      const res = await fetch(url);
      const json = await res.json();
      const transformed = transformPrometheusData(json);
      setData(transformed);
    };

    fetchCPU();

    const interval = setInterval(fetchCPU, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>CPU Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fill: "#1e3a8a", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#047857", fontSize: 12 }}
              domain={[0, 100]}
              unit="%"
            />
            <Legend />
            {data[0] &&
              Object.keys(data[0])
                .filter((key) => key !== "time")
                .map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={["#8884d8", "#82ca9d", "#ff7300"][idx % 3]}
                    isAnimationActive={false}
                  />
                ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

function transformPrometheusData(promData) {
  if (!promData.data?.result?.length) return [];

  // Collect all timestamps first
  const timestamps = promData.data.result[0].values.map(([ts]) => ts);

  // Create a map of time -> values for each instance
  const data = timestamps.map((ts, i) => {
    const point = { time: new Date(ts * 1000).toLocaleTimeString("en-GB") };

    promData.data.result.forEach((series) => {
      // Use instance label as key
      const instanceName = series.metric.instance || "unknown";
      point[instanceName] = parseFloat(series.values[i][1]);
    });

    return point;
  });

  return data;
}

export default CPUChart;
