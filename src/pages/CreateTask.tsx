import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addTask } from "../firebaseConfig/db";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContex";

const CreateTask: React.FC = () => {
  const { logout } = useAuth();
  const [taskName, setTaskName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Personal");
  const [priority, setPriority] = useState<string>("High");
  const [taskColor, setTaskColor] = useState<string>("purple");
  console.log("startDte", startDate);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;

  const handleSave = async () => {
    console.log("clickdf");
    await addTask(
      userId,
      taskName,
      category,
      priority,
      taskColor,
      startDate,
      endDate,
      taskDescription
    );

    // Optionally reset form fields after saving
    setTaskName("");
    setStartDate(null);
    setEndDate(null);
    setTaskDescription("");
    setCategory("Personal");
    setPriority("High");
    setTaskColor("purple");
  };

  return (
    // <IoMdClose onClick={() =>logout()} size={32} className='font-bold'  />

    <div className="flex-1 h-full pt-4 pb-4  px-5 lg:px-28 overflow-auto">
      <div className="flex gap-9  text-text font-bold my-4">
        <IoMdClose onClick={() => logout()} size={32} className="font-bold" />
        <h2 className="text-3xl font-semibold mb-6 text-text">
          Create New Task
        </h2>
      </div>

      <div className="mb-4 border-b border-text">
        <label className="block text-lg font-semibold mb-2 text-gray">
          Task Name
        </label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-3 bg-bgColor text-text text-lg  outline-none "
        />
      </div>
      <div className="mb-4 border-b border-text">
        <label className="block text-lg font-semibold mb-2 text-gray">
          Start Date
        </label>
        <div className="relative w-full">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full p-3 bg-bgColor text-text text-lg   outline-none"
          />

          <FaCalendarAlt
            className="absolute top-3 right-3 text-gray"
            onClick={() =>
              document
                .querySelector<HTMLInputElement>(
                  ".react-datepicker__input-container input"
                )
                ?.focus()
            }
          />
        </div>
      </div>

      <div className="mb-4 border-b border-text">
        <label className="block text-lg font-semibold mb-2 text-gray">
          End Date
        </label>
        <div className="relative">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full p-3 bg-bgColor text-text text-lg   outline-none"
          />
          <FaCalendarAlt
            className="absolute top-3 right-3 text-gray"
            onClick={() =>
              document
                .querySelectorAll<HTMLInputElement>(
                  ".react-datepicker__input-container input"
                )[1]
                ?.focus()
            }
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 border-b border-text">
        <label className="block text-lg font-semibold text-gray mb-2">
          Description
        </label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          rows={2}
          className="w-full  bg-bgColor text-text text-lg    outline-none"
        ></textarea>
      </div>
      {/* Category Dropdown */}
      <div className="mb-4 border-b border-text">
        <label className="block text-lg text-gray font-semibold mb-2 text-gray-300">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 bg-bgColor text-text  outline-none"
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="School">School</option>
        </select>
      </div>
      {/* Priority Dropdown */}
      <div className="mb-4 border-b border-text">
        <label className="block text-lg text-gray font-semibold mb-2 text-gray-300">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 bg-bgColor text-text  outline-none"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2 text-gray">
          Pick Task Color
        </label>
        <div className="flex items-center space-x-4">
          {["bg-purple", "bg-yellow", "bg-gray", "bg-green"].map((color) => (
            <button
              key={color}
              onClick={() => setTaskColor(color)}
              className={`w-8 h-8 rounded-full ${color} ${
                taskColor === color ? "ring-4 ring-yellow" : ""
              }`}
            />
          ))}
        </div>
      </div>
      {/* Submit Button */}
      <div className="px-0 py-0 lg:px-24 lg:py-12">
        <button
          onClick={handleSave}
          className="w-full  p-3 bg-ascent text-text text-lg font-bold rounded-lg hover:bg-yellow-400"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
