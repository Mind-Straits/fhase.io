import React from "react";
import Image from "next/image";

export const Banner: React.FC = () => {
  return (
    <div className="py-3 h-screen w-[1100px] mx-auto bg-white flex items-center">
      <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
        <div className="w-full lg:w-1/2 mx-8">
          <div className="text-4xl text-[#083B56] font-dark font-extrabold mb-4">
            INTRODUCING <br /> FHASE <br /> ANALYTICS
          </div>
          <p className="text-md font-bold leading-normal mb-8">
            Finance Intelligence Hub
          </p>
          <p className="mt-[100px] text-md font-bold leading-normal">
            fhase.io group
          </p>
          <p className="text-sm text-[#A5B1B8] font-bold leading-normal mb-2">
            Public: 2 members
          </p>
          <button className="text-md font-bold text-white bg-cyan-400 py-2 px-10">
            JOIN
          </button>
        </div>
        <div className="w-full lg:justify-end mx-5 my-12">
          <Image src="/landingxyz.png" alt="Hero" width={600} height={500} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
