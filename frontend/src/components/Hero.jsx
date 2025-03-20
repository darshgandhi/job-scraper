import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="mb-1 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-12 text-center lg:text-left">
          <div className=" relative flex justify-center h-[300px] sm:h-[400px] lg:h-[500px]">
            <img
              src="gradient-career-cushioning-illustration.png"
              alt="Happy person"
              className="opacity-90 w-full h-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] object-contain"
            />
          </div>
          <div className="relative max-w-[500px] mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-500 mb-6">
              Find Your Dream Job Faster!
            </h1>
            <p className="text-md text-gray-600 mb-8">
              Connect with top companies and discover opportunities that match
              your skills and aspirations.
            </p>
            <Link to="/jobs">
              <button className="shadow-xl cursor-pointer group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-black hover:before:[box-shadow:_20px_20px_20px_30px_#2196f3] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-blue-300 relative bg-neutral-800 h-16 w-64 border-2 border-black text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-blue-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-blue-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
                Explore Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
