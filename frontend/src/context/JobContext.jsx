import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const JobContext = createContext();
const ITEMS_PER_PAGE = 36;

export const JobProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedJobs = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("jobs").select("*");
        if (error) {
          throw error;
        }
        data.sort(() => Math.random() - 0.5);
        setData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterResults = () => {
      let filtered = data;

      if (searchTerm) {
        filtered = filtered.filter((job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.location) {
        filtered = filtered.filter((job) =>
          job.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.type && filters.type !== "all") {
        filtered = filtered.filter((job) => {
          if (!job.location) return false;
          job.type?.toLowerCase().includes(filters.type.toLowerCase());
        });
      }

      if (filters.salary) {
        filtered = filtered.filter((job) =>
          job.salary?.toLowerCase().includes(filters.salary.toLowerCase())
        );
      }

      setFilteredData(filtered);
    };

    filterResults();
  }, [searchTerm, filters, data]);

  return (
    <JobContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        data,
        setData,
        loading,
        setLoading,
        totalPages,
        displayedJobs,
        setCurrentPage,
        currentPage,
        filteredData,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
