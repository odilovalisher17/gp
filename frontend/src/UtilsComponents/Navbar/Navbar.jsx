import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-center py-[10px] bg-secondary">
      <div className="flex items-center">
        <img src="/logo.png" className="w-[60px] h-[60px] mr-[10px]" />

        <h1 className="text-primary">
          <span className="text-[rgb(0,135,118)]">Green</span>Plum Cluster
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
