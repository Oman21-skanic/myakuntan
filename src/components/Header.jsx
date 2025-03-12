import React from "react";
import Logo from "../assets/images/Logo.svg";
import idFlag from "../assets/images/id.png";

const Header = () => {
  return (
    <div className="header w-full flex bg-white h-[70px]">
      <div className="header-comp  w-full flex justify-between mx-42 items-center">
        <div className="logo flex items-center hover:cursor-pointer">
          <img src={Logo} alt="logo.svg" />
          <span className="text-base text-black pl-2 font-semibold">
            MyAkuntan
          </span>
        </div>
        <div className="lang flex hover:cursor-pointer">
          <img
            src={idFlag}
            alt="IndonesiaFlag"
            className="w-[30px] h-[20px] border-1 border-black "
          />
          <span className="text-base text-black pl-2 font-semibold">ID</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
