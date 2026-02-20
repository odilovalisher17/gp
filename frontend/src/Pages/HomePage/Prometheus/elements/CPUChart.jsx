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
      const promqlQuery =
        '100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)';
      const url = `http://10.8.8.108:9090/api/v1/query_range?query=${encodeURIComponent(
        promqlQuery,
      )}&start=${oneHourAgo}&end=${now}&step=60`;

      const res = await fetch(url);
      const json = await res.json();
      console.log(json);
      const transformed = transformPrometheusData(json);
      setData(transformed);
    };

    fetchCPU();

    const interval = setInterval(fetchCPU, 10000);
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
            <YAxis tick={{ fill: "#047857", fontSize: 12 }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#8884d8"
              isAnimationActive={false} // instant update
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

function transformPrometheusData(promData) {
  if (!promData.data?.result?.length) return [];
  const values = promData.data.result[0].values;
  return values.map(([ts, val]) => {
    const date = new Date(ts * 1000);
    return {
      time: date.toLocaleTimeString("en-GB"), // HH:mm:ss
      cpu: parseFloat(val),
    };
  });
}

export default CPUChart;
