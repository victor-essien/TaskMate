import React, { useEffect, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { fetchTaskDetails } from "../firebaseConfig/db";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface TaskType {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  status: string;
  category: string;
  taskName: string;
  dueDate: Timestamp | null;
  startDate: Timestamp | null;
}

type TaskColor = "bg-Purple" | "bg-Yellow" | "bg-Gray" | "bg-Green";

const Task: React.FC = () => {
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskType | null>();
  const { taskId } = useParams<string>();
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  if (!taskId) return;
  const fetchTask = async () => {
    const details = await fetchTaskDetails(userId, taskId);

    setTask(details);

    console.log("details", details);
  };
  useEffect(() => {
    fetchTask();
  }, []);

  const goBack = () => {
    navigate(-1); // This will navigate to the previous URL
  };

  const assignedTo = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
  ];

  const attachments = [
    "https://via.placeholder.com/100",
    "https://via.placeholder.com/100",
    "https://via.placeholder.com/100",
  ];

  // Task color variable
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

  return (
    <div className="flex-1 h-full  mb-32 lg:px-9 lg:pt-4   ">
      <div className=" mx-auto  shadow-lg overflow-auto pb-32">
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
                  {task?.startDate
                    ? task?.startDate.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No due date"}
                </span>
              </div>
              <div className="flex flex-row  justify-between">
                <span className="font-semibold">End Date</span>
                <span className="font-bold">
                  {task?.dueDate
                    ? task.dueDate.toDate().toLocaleDateString("en-US", {
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
            <div className="mb-4 text-text border-b border-gray pb-4">
              <h2 className="text-2xl font-semibold">Category:</h2>
              <p className="text-xl font-medium mt-1 ">{task?.category}</p>
            </div>
            <div className="mb-4 text-text border-b border-gray pb-4">
              <h2 className="text-2xl font-semibold">Description:</h2>
              <p className="text-xl font-medium mt-1 ">{task?.description}</p>
            </div>
            <div className="mb-4 border-b border-gray pb-4">
              <h2 className="text-2xl font-medium mb-2">Assigned To:</h2>
              <div className="flex space-x-2 mt-1">
                {assignedTo.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-gray"
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-medium mb-2">Attachments:</h2>
              <div className="flex space-x-2 mt-1">
                {attachments.map((attachment, index) => (
                  <img
                    key={index}
                    src={attachment}
                    alt={`Attachment ${index + 1}`}
                    className="w-20 h-20 rounded-lg border border-gray"
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-medium ">Task Color:</h2>
              <p
                className="mt-1 text-xl font-semibold"
                style={{ color: "#d1c4e9" }}
              >
                {task?.color}
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Task;
