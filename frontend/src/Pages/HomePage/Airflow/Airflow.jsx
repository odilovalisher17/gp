import React from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const Airflow = () => {
  return (
    <div className="w-[80%] m-auto">
      <div className="w-full flex items-center text-[21px]">
        <img src="apache-airflow.png" className="w-[40px] mr-[10px]" />
        <h2 className="text-primary">Airflow</h2>
      </div>

      <NavLink to={"/dags/new"}>
        <Button className="py-[5px] px-[20px]" variant="outline">
          Add a new DAG
        </Button>
      </NavLink>
    </div>
  );
};

export default Airflow;
