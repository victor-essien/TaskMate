import React, { useEffect, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { completeTask, fetchTaskDetails } from "../firebaseConfig/db";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContex";

interface TaskType {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  status: string;
  category: string;
  taskName: string;
  dueDate: string;
  startDate: Timestamp | null;
}

type TaskColor = "bg-Purple" | "bg-Yellow" | "bg-Gray" | "bg-Green";

const motivationalMessages = [
  "You're doing amazing! Keep it up! 🚀",
  "Another task crushed! You're unstoppable! 👏",
  "You're a productivity champion! 🏆",
  "Every step counts—fantastic work! 💪",
  "Great job! Keep shining bright! 🌟",
  "You’ve got this! Keep the streak alive! 🎯",
];

const Task: React.FC = () => {
  const navigate = useNavigate();
  const [showCongrats, setShowCongrats] = useState(false);
  const [task, setTask] = useState<TaskType | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const { taskId } = useParams<string>();
  const storedUser = localStorage.getItem("user");
  const { user } = useAuth();
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  if (!taskId) return;

  const fetchTask = async () => {
    try {
      setLoading(true);
      const details = await fetchTaskDetails(userId, taskId);

      setTask(details);
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTask();
  }, []);

  const goBack = () => {
    navigate(-1); // This will navigate to the previous URL
  };

  const handleTaskComplete = (taskId: string) => {
    try {
      if (!taskId) return null;
      completeTask(userId, taskId);
    } catch (error) {
      console.log("error", error);
    }
    // Randomize motivatonal message
    const randomMessage =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];
    setMessage(randomMessage);
    // Simulate task completion and show animation
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
    }, 6000); // Hide animation after 5 seconds
  };

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
      {loading ? (
        <div className="flex items-center justify-center absolute inset-0 x-10">
          <ScaleLoader color="#36D7B7" />
        </div>
      ) : (
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
                      ? new Date(task?.dueDate).toLocaleDateString("en-US", {
                          weekday: "long",

                          month: "long",
                          day: "numeric",
                        })
                      : "No due date"}
                  </span>
                </div>
                <div className="flex flex-row  justify-between">
                  <span className="font-semibold">Due Time</span>
                  <span className="font-bold">
                    {" "}
                    {task?.dueDate
                      ? `${new Date(task?.dueDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "No time specified"}
                  </span>
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

              <div className="mt-4">
                <h2 className="text-2xl font-medium ">Task Color:</h2>
                <p
                  className="mt-1 text-xl font-semibold"
                  style={{ color: "#d1c4e9" }}
                >
                  {task?.color}
                </p>
              </div>
              <div className="flex justify-center">
                {task?.status != "completed" && (
                  <button
                    onClick={() =>
                      task?.taskId && handleTaskComplete(task.taskId)
                    }
                    className="mt-4 px-4 text-gray py-2 bg-lightgrey font-bold text-lg rounded-lg hover:bg-blue-600"
                  >
                    Mark As Complete
                  </button>
                )}
              </div>

              {/* Animation and Motivational Message */}
              {showCongrats && (
                <>
                  <Confetti
                    width={window.innerWidth}
                    height={750}
                    numberOfPieces={300}
                    colors={["#FF5733", "#33FF57", "#3357FF", "#FFC300"]}
                  />

                  {/* Motivational Message */}
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="absolute top-0 left-0 w-full text-center bg-bgColor p-4 shadow-lg rounded-b-lg z-50"
                  >
                    <h2 className="text-2xl font-bold text-texv">
                      Let's Goooo! 🚀🚀💪💪 🎉
                    </h2>
                    <p className="text-gray text-xl font-bold mt-2">
                      {message}
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Task;
