import React from "react";
import Header from "./Header";
import meshblur from "../assets/images/meshblur.png";
const Hero = () => {
  return (
    <div className="Hero-container w-full h-screen border-2 border-fuchsia-500 bg-white">
      <div className="hero-blur-bg">
        <img
          src={meshblur}
          alt="blur.png "
          className="w-full h-screen relative z-1 top-0 -right-5 opacity-60"
        />
      </div>
      <div className="hero-text">
        <div className="hero-title">
          <p>Let's create an interesting financial management experience</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
