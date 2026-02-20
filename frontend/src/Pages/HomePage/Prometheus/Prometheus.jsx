import React from "react";
import CPUChart from "./elements/CPUChart";

const Prometheus = () => {
  return (
    <div className="w-[80%] min-h-[30vh] m-auto text-primary">
      <div className="flex items-center">
        <img src="/prometheus.png" className="w-[40px] h-[40px] mr-[15px]" />
        <div className="text-[21px]">
          <span className="text-[rgb(217,78,49)]">Prometheus</span> Metrics
        </div>
      </div>

      <div className="my-[20px]">
        <CPUChart />
      </div>
    </div>
  );
};

export default Prometheus;
