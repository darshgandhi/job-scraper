import React from "react";
import { Button } from "@/components/ui/button";

const JobCard = ({ title, company, url, type, location, salary }) => {
  return (
    <div className="bg-white w-full max-w-xs sm:w-72 p-4 sm:p-6 shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Job Icon and Title Section */}
      <div className="flex items-start mb-4">
        <div className="p-2 bg-blue-50 rounded-lg mr-3">
          <span className="material-icons text-blue-600 text-2xl">work</span>
        </div>
        <div>
          <h3 className="font-bold text-[12px] text-gray-800 line-clamp-2">
            {title || "Software Engineer"}
          </h3>
          <p className="text-gray-600 text-[10px]">
            {company || "Tech Solutions Inc."}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4 grow">
        {[
          { icon: "schedule", text: type || "Full-time" },
          { icon: "location_on", text: location || "Remote" },
          salary && { icon: "payments", text: salary },
        ]
          .filter(Boolean)
          .map(({ icon, text }, index) => (
            <div key={index} className="flex items-center text-sm">
              <span className="material-icons text-gray-500 mr-2 text-base">
                {icon}
              </span>
              <span className="text-sm text-gray-600">{text}</span>
            </div>
          ))}
      </div>

      <a href={url || "#"} target="_blank" rel="noopener noreferrer">
        <Button>Apply Now</Button>
      </a>
    </div>
  );
};

export default JobCard;
