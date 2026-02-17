import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-center py-[10px] bg-secondary">
      <div className="flex items-center">
        <img src="/logo.png" className="w-[50px] h-[50px] mr-[10px]" />

        <div className="text-primary text-[30px]">
          <span className="text-[rgb(0,135,118)] text-[30px]">Green</span>Plum
          Cluster
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
