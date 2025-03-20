import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobContext } from "@/context/JobContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterSearch = () => {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"];

  const { searchTerm, filters, setSearchTerm, setFilters } =
    useContext(JobContext);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search job titles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-40">
            <Input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-40">
            <Select
              value={filters.type || undefined}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Filter className="h-4 w-4" />
          <span>Active filters:</span>
          {filters.location && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
              Location: {filters.location}
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, location: "" }))
                }
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.type && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
              Type: {filters.type === "all" ? "All Types" : filters.type}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, type: "" }))}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {!filters.location && !filters.type && <span>None</span>}
        </div>

        {(filters.location || filters.type) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ location: "", type: "" })}
            className="text-sm"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterSearch;
