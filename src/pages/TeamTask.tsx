import React, { useEffect, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { fetchTaskDetails } from "../firebaseConfig/db";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { useLocation } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { ScaleLoader } from "react-spinners";
interface TeamType {
  teamId: string;
  teamName: string;
  tasks: TaskType[];
}

interface MembersTyoe {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}
interface TaskType {
  taskId: string;
  taskName: string;
  category: string;
  selectedMembers: MembersTyoe[];
  priority: string;
  color: string;
  deadline: Timestamp | null;
  status: string;
  taskDescription: string;
}

const TeamTask: React.FC = () => {
  const { taskId } = useParams();
  const location = useLocation();
  const [task, setTask] = useState<TaskType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { teamId } = location.state || {};

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const userName = storedUser ? JSON.parse(storedUser)?.displayName : null;
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;

  useEffect(() => {
    const fetchTeamTask = async () => {
      try {
        if (!userId || !teamId || !taskId) {
          setError("Missing required parameters.");
          return;
        }

        // Fetch the user document
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("User not found");
        }

        // Retrieve user data
        const userData = userDoc.data();

        // Find the team with the specified teamId
        const targetTeam = userData.teams?.find(
          (team: TeamType) => team.teamId === teamId
        );

        if (!targetTeam) {
          throw new Error("Team not found");
        }

        // Find the task with the specified taskId within the team
        const targetTask = targetTeam.task?.find(
          (task: TaskType) => task.taskId === taskId
        );

        if (!targetTask) {
          throw new Error("Task not found");
        }

        setTask(targetTask);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamTask();
  }, [userId, teamId, taskId]);
  const goBack = () => {
    navigate(-1); // This will navigate to the previous URL
  };
  const taskColor: string = "bg-Purple"; // Change this value for testing different colors

  // Determine gradient styles based on taskColor
  let gradientStyle: string;
  switch (taskColor) {
    case "bg-Purple":
      gradientStyle = "linear-gradient(to right, #D8B4FE, #C084FC, #A855F7)";
      break;
    case "bg-Yellow":
      gradientStyle = "linear-gradient(to right, #FDE68A, #FCD34D, #FBBF24)";
      break;
    case "bg-Gray":
      gradientStyle = "linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)";
      break;
    case "bg-Green":
      gradientStyle = "linear-gradient(to right, #A7F3D0, #6EE7B7, #34D399)";
      break;
    default:
      gradientStyle = "linear-gradient(to right, #E5E7EB, #D1D5DB, #9CA3AF)"; // Default fallback
  }

  if (error) return <div className="text-text">Error: {error}</div>;
  return (
    <div className="flex-1 h-full  mb-32 lg:px-28  lg:pt-4   ">
      {loading ? (
        <div className="flex items-center justify-center absolute inset-0 x-10">
          <ScaleLoader color="#36D7B7" />
        </div>
      ) : (
        <div className=" mx-auto  shadow-lg overflow-auto pb-2">
          {/* Top Section with Hex Background */}
          <div
            className="p-6 text-black"
            style={{
              background: gradientStyle,
            }}
          >
            <div className=" flex justify-between text-lg font-extrabold lg:hidden ">
              <IoArrowBackOutline size={32} onClick={goBack} />
              <CiEdit size={34} />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold my-5 text-center">
                {task?.taskName}
              </h1>
              <div className="flex flex-col gap-4 text-xl px-3">
                <div className="flex flex-row  justify-between">
                  <span className="font-semibold">Start Date</span>
                  <span className="font-bold">
                    {" "}
                    {task?.deadline
                      ? task?.deadline.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No due date"}
                  </span>
                </div>

                <div className="flex flex-row  justify-between">
                  <span className="font-semibold">Time</span>
                  <span className="font-bold">10 AM - 6 PM</span>
                </div>
                <div className="flex flex-row  justify-between">
                  <span className="font-semibold">Priority</span>
                  <span
                    className={`px-2 py-1 text-lg font-semibold rounded-md ${
                      task?.priority === "High"
                        ? "bg-[#EF4444] text-[#F1F5F9]"
                        : task?.priority === "Medium"
                        ? "bg-[#F59E0B] text-[#050404]"
                        : "bg-[#6EE7B7] text-[#050404]"
                    }`}
                  >
                    {task?.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section with Dark Background */}
          <div className="  text-text p-6">
            <div className="bg-bgColor">
              {/* <div className="mb-4 text-text border-b border-gray pb-4">
              <h2 className="text-2xl font-semibold">Category:</h2>
              <p className="text-xl font-medium mt-1 ">{task?.category}</p>
            </div> */}
              <div className="mb-4 text-text border-b border-gray pb-4">
                <h2 className="text-2xl font-semibold">Description:</h2>
                <p className="text-xl font-medium mt-1 ">
                  {task?.taskDescription}
                </p>
              </div>
              <div className="mb-4 border-b border-gray pb-4">
                <h2 className="text-2xl font-medium mb-2">Assigned To:</h2>
                <div className="flex space-x-2 mt-1">
                  {task?.selectedMembers.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar.photoURL}
                      alt={`Avatar ${index + 1}`}
                      className="w-12 h-12 rounded-full "
                    />
                  ))}
                </div>
              </div>
              <div className="">
                <h2 className="text-2xl font-medium ">Comments:</h2>
              </div>
            </div>
            <CommentSection
              teamId={teamId || ""}
              taskId={task?.taskId || ""}
              userName={userName || ""}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTask;
