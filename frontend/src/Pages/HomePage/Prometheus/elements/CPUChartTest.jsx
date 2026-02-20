import React, { useEffect, useRef } from "react";
import uPlot from "uplot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CPUChart() {
  const chartRef = useRef(null);
  const plotInstance = useRef(null);

  useEffect(() => {
    setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const oneHourAgo = now - 3600;

      const promqlQuery =
        '100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)';
      const url = `http://10.8.8.108:9090/api/v1/query_range?query=${encodeURIComponent(promqlQuery)}&start=${oneHourAgo}&end=${now}&step=60`;

      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "success") {
            const timestampSet = new Set();
            result.data.result.forEach((series) => {
              series.values.forEach(([timestamp]) => {
                timestampSet.add(timestamp);
              });
            });

            const timestamps = Array.from(timestampSet).sort((a, b) => a - b);
            const data = [timestamps];
            const seriesConfig = [{ label: "Time" }];

            const colors = [
              "#e74c3c",
              "#3498db",
              "#2ecc71",
              "#f39c12",
              "#9b59b6",
            ];

            result.data.result.forEach((series, index) => {
              const instance = series.metric.instance;

              const values = timestamps.map((ts) => {
                const point = series.values.find(
                  ([timestamp]) => timestamp === ts,
                );
                return point ? parseFloat(point[1]) : null;
              });

              data.push(values);
              seriesConfig.push({
                label: instance,
                stroke: colors[index % colors.length],
                width: 2,
              });
            });

            const opts = {
              title: "CPU Usage - All Servers",
              width: 1000,
              height: 400,
              series: seriesConfig,
              axes: [
                {
                  space: 60,
                  values: (self, ticks) =>
                    ticks.map((rawValue) =>
                      new Date(rawValue * 1000).toLocaleTimeString("en-US", {
                        timeZone: "Asia/Tashkent",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    ),
                },
                {
                  label: "CPU %",
                  size: 50,
                },
              ],
              scales: {
                y: {
                  // Auto-scale: uPlot will calculate min/max from data
                  auto: true,
                  // Or with padding around the data:
                  // range: (self, dataMin, dataMax) => [
                  //   Math.floor(dataMin - 5),
                  //   Math.ceil(dataMax + 5)
                  // ]
                },
              },
            };

            if (plotInstance.current) {
              plotInstance.current.setData(data);
            } else {
              plotInstance.current = new uPlot(opts, data, chartRef.current);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching from Prometheus:", error);
        });
    }, 1000);

    return () => {
      if (plotInstance.current) {
        plotInstance.current.destroy();
        plotInstance.current = null;
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}></div>
      </CardContent>
    </Card>
  );
}

export default CPUChart;
