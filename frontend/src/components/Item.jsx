import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  MapPin,
  BriefcaseBusiness,
  CircleDollarSign,
  Users,
  Calendar,
} from "lucide-react";

const Item = ({
  id,
  title,
  company,
  location,
  type,
  department,
  salary,
  description,
  url,
  posted_at,
}) => {
  return (
    <Card
      key={id}
      className="flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <CardHeader className="pb-2">
        <div className="min-h-[4.8em]">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          <CardDescription className="text-blue-600 font-medium">
            {company || "Company Name"}
          </CardDescription>
        </div>
        {description && (
          <p className="text-gray-600 mt-2 line-clamp-3">{description}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 text-sm flex-grow">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {location || "Location not specified"}
          </span>
        </div>

        {department && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{department}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-600">
          <BriefcaseBusiness className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {type || "Job Type not specified"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <CircleDollarSign className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {salary || "Salary not disclosed"}
          </span>
        </div>

        {posted_at && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{posted_at}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="cursor-pointer w-full gap-1">
            Apply Now
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default Item;
