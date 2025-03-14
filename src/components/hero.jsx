import React from "react";
import meshblur from "../assets/images/meshblur.png";
import element1 from "../assets/images/element1.svg";

const Hero = () => {
  return (
    <div className="hero-section w-full h-screen border-2 border-fuchsia-500 bg-white relative -z-10 flex items-center">
      <div className="hero-blur-bg">
        <img
          src={meshblur}
          alt="blur.png "
          className="w-full h-screen absolute -z-9 top-0 -right-0 opacity-60"
        />
      </div>
      <div className="hero-eContainer flex flex-warp w-full mx-40 justify-between">
        <div className="hero-textAction flex flex-col items-center my-5">
          <h1 className="text-black text-5xl w-[586px]">
            Let's create an interesting financial management experience
          </h1>
          <p>Get your experience here!</p>
          <a href="../pages/aboutus.html"></a>
        </div>
        <div className="hero-art">
          <img src={element1} alt="illustration" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
