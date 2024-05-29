import React from "react";
import Image from "next/image";

function Footer() {
  return (
    <footer className="relative bg-[#ECF0F2] pt-8 pb-6">
      <div className="flex justify-center gap-10 pb-12">
        <div className="text-[#083B56] px-4">
          <h4 className="text-3xl fonat-semibold text-blueGray-700">
            Fhase Analytics
          </h4>
          <h5 className="text-lg mt-0 mb-2 text-blueGray-600">
            hello@fhase.io
          </h5>
          <div className="mt-3 lg:mb-0 mb-6">
            <button
              className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
              type="button"
            >
              <Image src="/fb.png" alt="bg-white" width={24} height={24} />
            </button>
          </div>
        </div>
        <div className="text-[#083B56] px-4 pt-2">
          <div className="flex flex-wrap items-top mb-6">
            <div className="w-full lg:w-4/12 px-4 ml-auto">
              <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                Fhase.io
              </span>
            </div>
          </div>
        </div>
        <hr className="my-6 bg-[#083B56] border-blueGray-300" />
      </div>
      <div className="py-8 flex flex-wrap bg-[#083B56] items-center md:justify-between justify-center">
        <div className="w-full md:w-6/12 px-4 mx-auto text-center">
          <div className="text-sm text-blueGray-500 font-semibold py-1">
            ©2023 by Fhase Analytics. All rights reserved | Terms | Cookies
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
