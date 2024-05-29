"use client";

import React, { useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="py-3 antialiased text-gray-900 bg-white sticky top-0 z-50 w-full">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-2 ">
        {/* Logo */}
        <div className="flex items-center justify-start w-1/4">
          <a href="#">
            <span className="sr-only">Home</span>
            <span className="text-2xl font-semibold">
              <span className="ml-24 text-[#083b56]">Fhase</span>.io
            </span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="inline-flex items-center justify-center text-gray-400 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-controls="mobile-menu"
          aria-expanded={isNavOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>

          {/* Menu icon */}
          {!isNavOpen ? (
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>

        <div className="ml-5 items-center justify-center hidden w-1/2 lg:flex"></div>

        <div className="mr-24 items-center justify-end hidden w-1/4 space-x-2 lg:flex">
          <a
            href="#"
            className="px-2 py-2 text-sm font-bold text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            HOME
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm font-bold text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            ABOUT
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm font-bold text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            FAQ
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm font-bold text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            NEWS
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm font-bold text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            CONTACT
          </a>
          <a
            href="#"
            className="px-2 py-2 text-sm font-bold text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            MORE
          </a>
          <button
            className="flex justify-center text-sm font-normal text-white bg-[#27c2ff] py-2 px-7 uppercase rounded-md"
            onClick={() => (window.location.href = "/sign-in")}
          >
            Log In 
            <Image
              className="h-[21px]"
              src="/usericon.png"
              alt=""
              width={21}
              height={21}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isNavOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col items-center space-y-3 lg:hidden"
          onClick={() => setIsNavOpen(false)}
        >
          <a
            href="#"
            className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            Home
          </a>
          <a
            href="#"
            className="px-4 py-2 text-base font-medium text-gray-900 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            ABOUT
          </a>
          <a
            href="#"
            className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            FAQ
          </a>
          <a
            href="#"
            className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            NEWS
          </a>
          <a
            href="#"
            className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            CONTACT
          </a>
          <a
            href="#"
            className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            MORE
          </a>
          <a
            href="/sign-in"
            className="px-4 py-2 text-base font-medium text-gray-400 transition-colors rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
