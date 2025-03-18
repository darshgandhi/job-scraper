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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedJobs = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getResults = async () => {
    setLoading(true);
    let query = supabase.from("jobs").select("*");

    if (searchTerm) {
      query = query.ilike("title", `*%${searchTerm}%*`);
    }

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.type && filters.type !== "all") {
      query = query.ilike("type", `%${filters.type}%`);
    }

    if (filters.salary) {
      query = query.ilike("salary", `%${filters.salary}%`);
    }

    if (!searchTerm && !filters.location && !filters.type) {
      query = query.limit(400);
    }

    const { data, error } = await query;
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getResults();
  }, [searchTerm, filters]);

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
        getResults,
        totalPages,
        displayedJobs,
        setCurrentPage,
        currentPage,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
