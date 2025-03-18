import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  MapPin,
  BriefcaseBusiness,
  CircleDollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const List = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getResults();
  }, []);

  async function getResults() {
    const { data, error } = await supabase.from("jobs").select("*");
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log(data);
      setData(data);
    }
  }

  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.length > 0 ? (
          data.map((job) => (
            <Card
              key={job.id}
              className="flex flex-col justify-around relative transition-transform duration-300 ease-in-out hover:-translate-y-2 shadow-md hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.job_type || "Remote"}</CardDescription>
              </CardHeader>
              <div className="flex flex-col gap-5">
                <CardContent className="flex flex-col gap-2 text-sm">
                  <a className="flex gap-2">
                    <MapPin />
                    {job.location || "Unknown"}
                  </a>
                  <a className="flex gap-2">
                    <BriefcaseBusiness />
                    {job.type || "Full-time"}
                  </a>
                  {job.salary && (
                    <a className="flex gap-2">
                      <CircleDollarSign />
                      {job.salary}
                    </a>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <a href={job.url || "#"} target="_blank">
                    <Button>
                      Apply
                      <ExternalLink />
                    </Button>
                  </a>
                </CardFooter>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center w-full h-full">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default List;
