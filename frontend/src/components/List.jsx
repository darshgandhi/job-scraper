import React, { useState, useEffect } from "react";
import Card from "./Card";
import { supabase } from "../lib/supabase";

const List = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getResults();
  }, []);

  async function getResults() {
    const { data, error } = await supabase.from("jobs").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log(data);
      setData(data);
    }
  }

  return (
    <section className="flex justify-center items-center overflow-y-auto pt-16 sm:pt-12 md:pt-8 pb-16">
      <div className="w-full max-w-7xl px-4 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.length > 0 ? (
            data.map((job) => (
              <div className="w-full" key={job.id}>
                <Card {...job} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-500">
              No jobs found
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default List;
