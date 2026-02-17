import React from "react";
import Prometheus from "./Prometheus/Prometheus";
import Airflow from "./Airflow/Airflow";

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary">
      <Prometheus />
      <Airflow />
    </div>
  );
};

export default HomePage;
