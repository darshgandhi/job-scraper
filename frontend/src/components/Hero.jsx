import React from "react";

const Hero = () => {
  return (
    <section className="mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-12 text-center lg:text-left">
          <div className="relative flex justify-center h-[300px] sm:h-[400px] lg:h-[500px]">
            <img
              src="happy-1184894.png"
              alt="Happy person"
              className="w-full h-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] object-contain"
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
            <div className="bg-slate-200 rounded-lg shadow-lg py-4 px-3">
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="w-full sm:flex-1">
                  <input
                    type="text"
                    placeholder="Job title"
                    className="text-sm bg-slate-50 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <div className="w-full sm:flex-1">
                  <input
                    type="text"
                    placeholder="Location"
                    className="text-sm bg-slate-50 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <button className="w-full sm:w-auto bg-blue-600 text-sm text-white px-6 py-2 font-medium hover:bg-red-500 transition-colors whitespace-nowrap cursor-pointer rounded-lg">
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
