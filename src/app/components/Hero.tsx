import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <div className="pb-[80px] h-screen w-[1100px] bg-white flex items-center mx-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
        <div className="w-full lg:w-1/2 mx-8">
          <div className="text-4xl text-[#083B56] font-dark font-extrabold mb-8">
            UNPARALLELED INTELLIGENCE
          </div>
          <p className="text-md font-bold leading-normal mb-8">
            Seamless Integration Explore our upcoming platform, currently in
            development, as it reshapes finance. Get ready for advanced
            financial data analytics, integration, and intelligence that
            empowers your business.
          </p>
        </div>
        <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
          <Image
            src="/hero.png"
            alt="Hero"
            width={350}
            height={300}
            className="w-[350px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
