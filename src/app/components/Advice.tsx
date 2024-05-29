import React from "react";

function Advice() {
  return (
    <div className="h-screen w-[1100px] mx-auto bg-white flex items-center">
      <div className="container flex items-center justify-center px-5 text-gray-700">
        <div className="text-center">
          <div className="text-4xl text-[#083B56] font-dark font-extrabold mb-8">
            {" "}
            &quot;Money is a terrible master but an excellent <br />{" "}
            servant.&quot;
          </div>
          <p className="text-md font-bold leading-normal mb-8">-P.T. Barnum</p>
        </div>
      </div>
    </div>
  );
}

export default Advice;
