import React from "react";
import DBMonitoring from "./DBMonitoring/DBMonitoring";
import Airflow from "./Airflow/Airflow";

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary">
      <DBMonitoring />
      <Airflow />
    </div>
  );
};

export default HomePage;
