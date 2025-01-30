import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
import { ScaleLoader } from "react-spinners";
import { IoMdTrash } from "react-icons/io";
import { deleteTask } from "../firebaseConfig/db";

interface TaskType {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  taskName: string;
  dueDate: string;
  startDate: Timestamp | null;
  progress: number | 82;
  status?: string;
}

interface OngoingTasksProps {
  tasks: TaskType[];
  error: boolean;
}
const OngoingTasks: React.FC<OngoingTasksProps> = ({ tasks, error }) => {
  const { user } = useAuth();

  const userId = user?.uid;
  const handleDeleteTask = async (taskId: string) => {
    try {
      if (!userId) return null;
      deleteTask(userId, taskId);
    } catch (error) {
      console.log("Error deleting tasks");
    }
  };

  if (error) {
    return (
      <div className="flex  items-center justify-center gap-2 p-8">
        <h2 className="text-2xl font-bold text-gray">
          Connect to the Internet
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text">Ongoing</h2>
        <button className="text-sm text-gray hover:text-text">See All</button>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-4  rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-text">No Ongoing Task</h2>

            <Link
              to="/add"
              className="mt-4 px-4 py-2 bg-yellow font-bold text-lg rounded-lg hover:bg-blue-600"
            >
              Create New Task
            </Link>
          </div>
        ) : (
          tasks?.map((task, index) => (
            <div key={index}>
              {task.status === "pending" ? (
                <Link to={`/task/${task.taskId}`} key={index}>
                  <div className="p-4 bg-lightgrey rounded-xl shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${
                          task.priority === "High"
                            ? "bg-[#EF4444] text-[#F1F5F9]"
                            : task.priority === "Medium"
                            ? "bg-[#F59E0B] text-[#050404]"
                            : "bg-[#6EE7B7] text-[#050404]"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-sm text-gray-400">
                        {task.progress}%
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{task.taskName}</h3>
                    {/* <p>
           { task.dueDate
              ? `${new Date(task.dueDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "No time specified"}
          </p> */}

                    <p className="text-sm text-[#9CA3AF]">
                      Due Date:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            weekday: "long",

                            month: "long",
                            day: "numeric",
                          })
                        : "No due date"}
                    </p>
                    <p className="text-sm text-[#9CA3AF]">
                      Due Time:{" "}
                      {task.dueDate
                        ? `${new Date(task.dueDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}`
                        : "No time specified"}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4  rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-text">
                    No Ongoing Task
                  </h2>

                  <Link
                    to="/add"
                    className="mt-4 px-4 py-2 bg-yellow font-bold text-lg rounded-lg hover:bg-blue-600"
                  >
                    Create New Task
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text">Completed</h2>
        <button className="text-sm text-gray hover:text-text">See All</button>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="flex justify-center mb-4 ">
            <p className="font-bold text-gray text-xl">
              NO task Completed<span className="font-bold text-2xl">🥲</span>
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div key={index}>
              {task.status === "completed" ? (
                <div
                  className="p-4 bg-lightgrey rounded-xl shadow-md space-y-2"
                  key={index}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-md ${
                        task.priority === "High"
                          ? "bg-[#EF4444] text-[#F1F5F9]"
                          : task.priority === "Medium"
                          ? "bg-[#F59E0B] text-[#050404]"
                          : "bg-[#6EE7B7] text-[#050404]"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className="text-lg font-bold text-texv"
                      onClick={() => handleDeleteTask(task.taskId)}
                    >
                      <IoMdTrash />
                    </span>
                  </div>
                  <Link to={`/task/${task.taskId}`} key={index}>
                    <h3 className="text-lg font-semibold">{task.taskName}</h3>

                    <p className="text-sm text-[#9CA3AF]">
                      Due Date:{" "}
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            weekday: "long",

                            month: "long",
                            day: "numeric",
                          })
                        : "No due date"}
                    </p>
                    <p className="text-sm text-[#9CA3AF]">
                      Due Time:{" "}
                      {task.dueDate
                        ? `${new Date(task.dueDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}`
                        : "No time specified"}
                    </p>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <p className="font-bold text-gray text-xl">
                    NO task Completed
                    <span className="font-bold text-2xl">🥲</span>
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OngoingTasks;
