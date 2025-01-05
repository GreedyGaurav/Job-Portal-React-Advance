/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob);
  const { loading: loadingSavedJob, fn: fnSavedJob } = useFetch(saveJob);

  const handleSaveJob = async () => {
    try {
      const response = await fnSavedJob({ user_id: user.id, job_id: job.id });
      if (response?.success) {
        setSaved(true);
        onJobAction(); // Refresh the job list
      } else {
        console.error("Failed to save the job:", response?.message);
      }
    } catch (error) {
      console.error("Error saving the job:", error);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const response = await fnDeleteJob({ job_id: job.id });
      if (response?.success) {
        onJobAction(); // Refresh the job list
      } else {
        console.error("Failed to delete the job:", response?.message);
      }
    } catch (error) {
      console.error("Error deleting the job:", error);
    }
  };

  useEffect(() => {
    // Sync saved state if response is available
    setSaved(savedInit);
  }, [savedInit]);

  return (
    <Card className="flex flex-col">
      {(loadingDeleteJob || loadingSavedJob) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} alt="Company Logo" className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}.
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? <Heart size={20} fill="red" stroke="red" /> : <Heart size={20} />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
