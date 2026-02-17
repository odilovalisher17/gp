import React from "react";
import { DagForm } from "./DagForm";

const NewDagPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-secondary pb-[40px]">
      <div className="w-[80%] m-auto">
        <DagForm />
      </div>
    </div>
  );
};

export default NewDagPage;
