import React from "react";
import ClusterStructure from "../Airflow/elements/ClusterStructure";

const Prometheus = () => {
  return (
    <div className="w-[80%] min-h-[30vh] m-auto text-primary">
      <div className="flex items-center mb-[10px]">
        <img src="/prometheus.png" className="w-[40px] h-[40px] mr-[15px]" />
        <div className="text-[21px]">
          <span className="text-[rgb(217,78,49)]">Prometheus</span> Metrics
        </div>
      </div>

      <div className="flex">
        <ClusterStructure />
      </div>
    </div>
  );
};

export default Prometheus;
