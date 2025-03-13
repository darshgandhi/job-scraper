import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-10">
        <ul className="m-0 p-0 list-none overflow-hidden sticky top-0 drop-shadow-md bg-white py-2 px-4 flex items-center space-x-6">
          <li>
            <a href="/" className="flex items-center space-x-2">
              <img
                className="w-9 h-9"
                src="job-user-svgrepo-com.svg"
                alt="Job Search Icon"
              />
              <span className="pl-1 text-orange-500 text-2xl font-bold">
                Job Hub
              </span>
            </a>
          </li>
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 font-medium"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-orange-500 font-medium"
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
