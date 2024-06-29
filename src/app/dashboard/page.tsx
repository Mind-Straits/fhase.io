"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import firestore from "@/app/firebase/firebaseFirestoreQueries";
import FileUpload from "./components/fileUpload";
import { useRouter } from "next/navigation";
import firebaseAuth from "@/app/firebase/firebaseAuth";
import withAuth from "@/app/firebase/withAuth";
import DashboardContent from "./components/dashboardContent";
import ProfileContent from "./components/profile";
import TableContent from "./components/tables";
import NotificationPage from "./components/notification";
import AdminPage from "./components/admin";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const router = useRouter();

  // For admin panel access
  const adminUIDs = [
    "wXCemTTspxZWEmLF0fUvE7C8Nfr2",
    "PgBovGrWLYQkRQxFVUnY5comAj02",
    "vMNYFCaePkcXGXVehtR6mFrSLqv2",
  ];

  const isAdmin = adminUIDs.includes(uid);

  //handle aside section indicator
  const [selectedItem, setSelectedItem] = useState("dashboard");
  const handleItemClick = (item: string = "Home") => {
    setSelectedItem(item);
    pageTrack(item);
  };

  // page tracker
  const pageTrack = (x: string): string => {
    return x;
  };
  //handle signout
  const handleLogout = async () => {
    try {
      await firebaseAuth.logout();
      router.push("/sign-in");
    } catch (error) {
      alert(`Error logging out: ${error}`);
    }
  };

  // Firebase handling
  interface UserDoc {
    email: string;
    username: string;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userDoc = await firestore.getDocumentById("user", user.uid);
        if (userDoc) {
          const typedUserDoc = userDoc as UserDoc;
          setUsername(typedUserDoc.username);
          setEmail(typedUserDoc.email);
        }
      } else {
        setUsername("");
        setEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <aside className="bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
        <div className="relative border-b border-white/20">
          <a className="flex items-center gap-4 py-6 px-8" href="#/">
            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
              Welcome Back {username}
            </h6>
          </a>
          <button
            className="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
            type="button"
          >
            <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                aria-hidden="true"
                className="h-5 w-5 text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </span>
          </button>
        </div>
        <div className="m-4">
          <ul className="mb-4 flex flex-col gap-1">
            <li>
              <a aria-current="page" className="active" href="#">
                <button
                  className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                    selectedItem === "dashboard"
                      ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                      : "text-white hover:bg-white/10 active:bg-white/30"
                  } w-full flex items-center gap-4 px-4 capitalize`}
                  type="button"
                  onClick={() => {
                    handleItemClick("dashboard");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                  </svg>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    Dashboard
                  </p>
                </button>
              </a>
            </li>
            <li>
              <a className="" href="#">
                <button
                  className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                    selectedItem === "profile"
                      ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                      : "text-white hover:bg-white/10 active:bg-white/30"
                  } w-full flex items-center gap-4 px-4 capitalize`}
                  type="button"
                  onClick={() => {
                    handleItemClick("profile");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    profile
                  </p>
                </button>
              </a>
            </li>
            <li>
              <button
                className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                  selectedItem === "upload"
                    ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                    : "text-white hover:bg-white/10 active:bg-white/30"
                } w-full flex items-center gap-4 px-4 capitalize`}
                type="button"
                onClick={() => {
                  handleItemClick("upload");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-5 h-5 text-inherit"
                >
                  <path d="M4 16v4a2 2 0 002 2h12a2 2 0 002-2v-4M12 2v14"></path>
                  <polyline points="14 8 12 6 10 8"></polyline>
                  <path d="M12 6v10"></path>
                </svg>
                <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Upload Document
                </p>
              </button>
            </li>
            <li>
              <a className="" href="#">
                <button
                  className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                    selectedItem === "table"
                      ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                      : "text-white hover:bg-white/10 active:bg-white/30"
                  } w-full flex items-center gap-4 px-4 capitalize`}
                  type="button"
                  onClick={() => {
                    handleItemClick("table");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    tables
                  </p>
                </button>
              </a>
            </li>
            <li>
              <a className="" href="#">
                <button
                  className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                    selectedItem === "notification"
                      ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                      : "text-white hover:bg-white/10 active:bg-white/30"
                  } w-full flex items-center gap-4 px-4 capitalize`}
                  type="button"
                  onClick={() => {
                    handleItemClick("notification");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    notifactions
                  </p>
                </button>
              </a>
            </li>
            {isAdmin && (
              <li>
                <a className="" href="#">
                  <button
                    className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                      selectedItem === "admin"
                        ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                        : "text-white hover:bg-white/10 active:bg-white/30"
                    } w-full flex items-center gap-4 px-4 capitalize`}
                    type="button"
                    onClick={() => {
                      handleItemClick("admin");
                    }}
                  >
                    <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 2000 2000"
  fill="currentColor"
  aria-hidden="true"
  className="w-5 h-5 text-inherit"
>
  <path
    fill-rule="evenodd"
    d="M754 1141l9 1 5 5 4 9 13 42 10 30 15 49 17 52 11 35 10 30 12 39 10 30 14 45 6 16 1-1 4-20 12-51 16-65 12-52 12-48 3-13-1-7-9-12-10-11-10-14-8-13-3-9-1-5v-28l3-8 6-8 8-5 3-1h143l9 4 7 7 4 8 1 7v17l-2 14-3 9-8 12-12 16-9 10-8 11v7l11 47 11 44 11 48 8 30 18 79h2l5-16 17-54 14-43 11-36 12-36 12-38 14-43 15-49 12-36 7-23 5-6 4-2h7l11 8 14 11 10 7 15 8 16 6 18 4 7 1 29 1 34 3 30 5 23 6 18 6 20 9 24 13 14 10 13 10 10 9 19 19 13 17 10 14 9 16 8 16 9 19 7 20 8 27 7 28 5 33 3 29 2 43v16l-1 15-5 17-7 14-9 11-8 9-14 9-19 9-33 11-52 13-41 8-48 7-77 9-60 5-51 3-77 3-34 1-65 1h-104l-66-1-90-3-56-3-55-4-56-6-63-8-37-6-25-5-56-14-30-10-18-8-13-8-10-9-12-15-7-14-4-15-1-7v-45l3-39 5-37 5-23 9-33 8-24 8-18 12-24 10-17 12-15 8-11 13-13 5-6 8-7 10-8 16-12 21-12 22-11 30-10 26-6 27-4 27-2 29-1 18-3 16-5 13-6 13-7 16-13 9-7z"
    clip-rule="evenodd"
  />
  <path
    fill-rule="evenodd"
    d="M995 299l34 1 35 3 32 5 23 6 31 11 18 8 24 15 14 11 7 7 8 7 9 10 9 12 7 10 9 16 11 24 6 18 6 24 5 29 3 26 2 35 1 33 15 8 13 10 9 10 9 16 6 17 2 11v35l-4 17-6 15-10 18-11 12-8 8-12 9-23 12-10 4h-2l-2 10-10 29-9 21-12 26-9 17-13 21-9 14-12 16-11 14-14 15-22 22-11 9-10 8-13 10-21 13-19 10-18 6-19 4-7 1h-34l-25-5-15-5-16-8-19-11-16-12-13-10-14-12-31-31-11-14-12-15-10-15-12-20-8-14-8-15-15-34-7-19-7-23v-3l-10-3-16-8-12-7-13-11-13-13-10-16-7-16-4-13-2-13v-25l3-17 4-12 10-19 8-10 12-9 17-10h2v-49l3-33 5-33 7-30 7-21 12-25 10-18 20-25 11-11 8-7 14-11 20-12 16-8 15-6 31-10 29-6 34-4z"
    clip-rule="evenodd"
  />
</svg>

                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                      admin
                    </p>
                  </button>
                </a>
              </li>
            )}
          </ul>
          <ul className="mb-4 flex flex-col gap-1">
            <li className="mx-3.5 mt-4 mb-2">
              <p className="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-75">
                Want to log out?
              </p>
            </li>
            <li>
              <a className="" href="#">
                <button
                  className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                    selectedItem === "logout"
                      ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                      : "text-white hover:bg-white/10 active:bg-white/30"
                  } w-full flex items-center gap-4 px-4 capitalize`}
                  type="button"
                  onClick={() => {
                    handleItemClick("logout");
                    handleLogout();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 text-inherit"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 3a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V5H8v14h6v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H8a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h7z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M17.707 8.293a1 1 0 0 0-1.414 1.414L18.586 12H11a1 1 0 1 0 0 2h7.586l-2.293 2.293a1 1 0 1 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414l-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                    Log Out
                  </p>
                </button>
              </a>
            </li>
            <li></li>
          </ul>
        </div>
      </aside>
      <div className="p-4 xl:ml-80">
        <nav className="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
          <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
            <div className="capitalize">
              <nav aria-label="breadcrumb" className="w-max">
                <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
                  <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                    <a href="#">
                      <p className="block antialiased font-sans text-sm leading-normal text-blue-900 font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
                        Home
                      </p>
                    </a>
                    <span className="text-gray-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">
                      /
                    </span>
                  </li>
                  <li className="flex items-center text-blue-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-blue-500">
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                      {pageTrack(selectedItem)}
                    </p>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="mr-auto md:mr-4 md:w-56">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    className="peer w-full h-full bg-transparent text-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"
                    placeholder=" "
                  />
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                    Type here
                  </label>
                </div>
              </div>
              <button
                className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    stroke-width="3"
                    className="h-6 w-6 text-blue-gray-500"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
              <a href="#">
                <button
                  className="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 hidden items-center gap-1 px-4 xl:flex"
                  type="button"
                >
                  SIGNED IN AS: {email}
                </button>
                <button
                  className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                  type="button"
                >
                  <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5 text-blue-gray-500"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
              </a>
              <button
                className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 text-blue-gray-500"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
              <button
                aria-expanded="false"
                aria-haspopup="menu"
                id=":r2:"
                className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 text-blue-gray-500"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </nav>
        <div>
          {selectedItem === "upload" ? (
            <FileUpload uid={uid} />
          ) : (
            <>
              {selectedItem === "dashboard" && <DashboardContent uid={uid} />},
              {selectedItem === "profile" && <ProfileContent />},
              {selectedItem === "table" && <TableContent />},
              {selectedItem === "notification" && <NotificationPage />},
              {selectedItem === "admin" && <AdminPage />},
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
