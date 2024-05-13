import React from "react";

function AboutUs() {
  return (
    <div className="py-3 h-screen w-[1100px] mx-auto bg-white flex items-center">
      <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
        <div className="w-full lg:w-1/2 mx-8">
          <div className="text-4xl text-[#083B56] font-dark font-extrabold mb-8">
            {" "}
            ABOUT US
          </div>
          <p className="text-md font-bold leading-normal mb-8">
            Comprising a team of visionary entrepreneurs and financial
            professionals, we at Fhase Analytics are dedicated to shaping the
            future. Our platform, currently in development, will offer
            innovative financial data analytics, integration, and intelligence
            solutions tailored to businesses of all sizes. We take pride in our
            commitment to delivering exceptional service. At Fhase Analytics, we
            firmly believe that precise insights and cutting-edge technology are
            essential for a prosperous future. Please contact us today to learn
            more and stay updated on our progress
          </p>
        </div>
        <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
          <img src="/aboutus.png" alt="Hero" className="w-[400px]" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
