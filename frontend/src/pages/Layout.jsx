import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-10">
        <ul className="m-0 p-0 list-none justify-between overflow-hidden sticky top-0 drop-shadow-md bg-white py-2 px-4 flex items-center space-x-6">
          <li>
            <a href="/" className="flex items-center space-x-2">
              <img
                className="w-9 h-9"
                src="human-resources-search-svgrepo-com.svg"
                alt="Job Search Icon"
              />
              <span className="pl-1 text-blue-500 text-2xl font-semibold hover:font-extrabold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
                Job Hub
              </span>
            </a>
          </li>
          <li className="flex gap-4 pr-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-500 hover:font-bold font-medium relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-500 hover:font-bold font-medium relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Jobs
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
