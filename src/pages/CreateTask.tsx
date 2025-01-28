import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {  addTask } from "../firebaseConfig/db";
import {  useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { ScaleLoader } from "react-spinners";
const CreateTask: React.FC = () => {
  
  const [taskName, setTaskName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();
  const [endDate, setEndDate] = useState<string | null>(null);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Personal");
  const [priority, setPriority] = useState<string>("High");
  const [taskColor, setTaskColor] = useState<string>("purple");
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This will navigate to the previous URL
  };
  const handleSave = async () => {
    setLoading(true);
    try {
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
    } catch (error: any) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full pt-4 pb-4  px-5 lg:px-36 overflow-auto">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0  bg-opacity-10 flex items-center justify-center z-10">
            <ScaleLoader color="#36D7B7" />
          </div>
        )}
        <div className="flex gap-9  text-form font-bold my-4">
          <IoMdClose onClick={goBack} size={32} className="font-bold" />
          <h2 className="text-3xl font-semibold mb-6 text-form">
            Create New Task
          </h2>
        </div>

        <div className="mb-4 border-b border-text ">
          <label className="block text-lg font-bold mb-2 text-form">
            Task Name
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-3 bg-bgColor text-form text-lg  outline-none "
          />

          {/* <input
        type="datetime-local"
        /> */}
        </div>
        <div className="mb-4 border-b border-gray">
          <label className="block text-lg font-bold mb-2 text-form">
            Start Date
          </label>
          <div className="relative w-full">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full p-3 bg-bgColor text-form text-lg   outline-none"
              required
            />

            <FaCalendarAlt
              className="absolute top-3 right-3 text-form"
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

        <div className="mb-4 border-b border-text ">
          <label className="block text-lg font-bold mb-2 text-form">
            End Date
          </label>
          <div className="relative text-text">
            <input
              type="datetime-local"
              value={endDate || "No date"}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 bg-bgColor   text-form text-lg  outline-none "
              required
              style={{
                colorScheme: `${theme}`, // Ensures native elements adapt to dark theme
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 border-b border-text">
          <label className="block text-lg font-bold text-form mb-2">
            Description
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={2}
            className="w-full  bg-bgColor text-form text-lg    outline-none"
          ></textarea>
        </div>
        {/* Category Dropdown */}
        <div className="mb-4 border-b border-text">
          <label className="block text-lg  font-bold mb-2 text-form">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-bgColor text-form font-bold outline-none"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="School">School</option>
          </select>
        </div>
        {/* Priority Dropdown */}
        <div className="mb-4 border-b border-text">
          <label className="block text-lg text-form font-bold mb-2 ">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 bg-bgColor text-form font-bold  outline-none"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-form">
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
    </div>
  );
};

export default CreateTask;
