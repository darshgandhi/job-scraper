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
        let allData = [];
        let from = 0;
        while (true) {
          const { data, error } = await supabase
            .from("jobs")
            .select("*")
            .range(from, from + 999);

          if (error) {
            console.log(error);
            break;
          }

          if (!data.length) break;

          allData.push(...data);
          from += 1000;
        }
        console.log(allData.length);
        allData.sort(() => Math.random() - 0.5);
        setData(allData);
        setFilteredData(allData);
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
        filtered = filtered.filter(
          (job) =>
            job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurrentPage(1);
      }

      if (filters.location) {
        filtered = filtered.filter((job) => {
          if (!job.location) return false;
          return job.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase());
        });
        setCurrentPage(1);
      }

      if (filters.type && filters.type !== "all") {
        filtered = filtered.filter((job) => {
          return job.type.toLowerCase().includes(filters.type.toLowerCase());
        });
        setCurrentPage(1);
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
