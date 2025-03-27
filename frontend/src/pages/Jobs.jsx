import React, { useContext } from "react";
import { JobContext } from "@/context/JobContext";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import happyImage from "/happy-1184894.png";
import Item from "@/components/Item";
import FilterSearch from "@/components/FilterSearch";

const Jobs = () => {
  const {
    filteredData,
    loading,
    totalPages,
    displayedJobs,
    setCurrentPage,
    currentPage,
  } = useContext(JobContext);

  return (
    <div className="w-full bg-white">
      {/* Main content container */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center mb-6">
          <img src={happyImage} className="w-16 h-16 mr-4" />
          <h1 className="text-5xl font-bold text-gray-800">
            Find Your Next Job
          </h1>
        </div>

        <FilterSearch />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(1)}
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              >
                First
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              >
                <ChevronLeft />
              </Button>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-600">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-xs text-gray-500">
                Total Results: {filteredData.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              >
                <ChevronRight />
              </Button>
              <Button
                onClick={() => setCurrentPage(totalPages)}
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none:"
                    : ""
                }
              >
                End
              </Button>
            </div>
          </div>
        )}

        {/* Job Items grid */}
        <div className="overflow-visible pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : displayedJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedJobs.map((job) => (
                <Item
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company_name}
                  location={job.location}
                  department={job.department}
                  type={job.type}
                  salary={job.salary}
                  description={job.description}
                  url={job.url}
                  posted_at={job.posted_at}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Show total number of jobs */}
        {displayedJobs.length > 0 && (
          <div className="text-center text-sm text-gray-500 mb-8">
            Showing {displayedJobs.length} job
            {displayedJobs.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(1)}
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              >
                First
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                className={
                  currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                }
              >
                <ChevronLeft />
              </Button>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-600">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-xs text-gray-500">
                Total Results: {filteredData.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              >
                <ChevronRight />
              </Button>
              <Button
                onClick={() => setCurrentPage(totalPages)}
                className={
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              >
                End
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
