import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContex";

import { db } from "../firebaseConfig/firebase";

interface adminType {
  displayName: string;
  photoURL: string;
  uid: string;
  email: string;
}
interface TeamType {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;
  task: [];
  members: TeamMember[];
  teamAdmin: adminType;
}

interface TeamMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
interface MemberType {
  email: string;
}
interface TaskType {
  taskId: string;
  taskName: string;
  taskDescription: string;
  taskColor: string | null;
  deadline: Date | null;
  priority: string;
  selectedMembers: TeamMember[];
}

const assignedTo = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/women/4.jpg",
];

const CreateTeamTask: React.FC = () => {
  const { logout } = useAuth();
  const [taskName, setTaskName] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [team, setTeam] = useState<TeamType | null>(null);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [adminDetails, setAdminDetails] = useState<adminType | null>(null);
  const [category, setCategory] = useState<string>("Personal");
  const [showModal, setShowModal] = useState(false);
  const [priority, setPriority] = useState<string>("High");
  const [taskColor, setTaskColor] = useState<string>("purple");
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const location = useLocation();
  const { teamId } = location.state || {};
  console.log("team", teamId);
  console.log("startDte", deadline);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;

  useEffect(() => {
    if (!teamId) return;
    const fetchTeam = async () => {
      const teamDoc = await getDoc(doc(db, "teams", teamId));
      if (teamDoc.exists()) {
        const team = teamDoc.data() as TeamType;
        console.log("teaminform", team);
        setTeam(team);
        const memberEmails = team?.members?.map((member) => member.email) || [];

        setMembers(memberEmails);
        setAdminDetails(team?.teamAdmin);
      } else {
        console.log("Team not found");
      }
    };

    fetchTeam();

    // const fetchTeam = async () => {
    //   const details = await fetchTeamDetails(userId, teamId);
    //   if (!details) return;
    //   setTeamDetail(details);
    //   console.log("details", details);
    // };
  }, [teamId]);
  console.log("temam", team?.members);

  const removeMember = (uid: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.uid !== uid));
  };

  const handleMemberSelect = (member: TeamMember) => {
    if (!selectedMembers.find((m) => m.uid === member.uid)) {
      setSelectedMembers((prev) => [...prev, member]);
    }
  };
  console.log("selceted", selectedMembers);
  console.log("members", members);
  const saveTask = async (task: TaskType) => {
    try {
      if (!members || members.length === 0) {
        console.log("No members provided.");
        return;
      }

      // Iterate over each member's email
      const updatePromises = members.map(async (email) => {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userRef = doc(db, "users", userDoc.id);
          const userData = userDoc.data();

          // Check if the user has teams
          const teams = userData?.teams || [];

          // Find the target team
          const targetTeamIndex = teams.findIndex(
            (team: any) => team.teamId === teamId
          );

          if (targetTeamIndex === -1) {
            console.error(`Team not found for user ${email}.`);
            return;
          }

          // Add the new task to the team's task array
          teams[targetTeamIndex].task = [
            ...(teams[targetTeamIndex].task || []),
            task,
          ];

          // Update the user document
          await updateDoc(userRef, { teams });
          console.log(`Task added successfully for user ${email}!`);
        } else {
          console.error(`No user found with email ${email}.`);
        }
      });

      // Execute all promises
      await Promise.all(updatePromises);
      try {
        if (!adminDetails?.uid) {
          return;
        }
        // Fetch the user document
        const userRef = doc(db, "users", adminDetails?.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          // Check if the user has teams
          const teams = userData?.teams || [];

          // Find the target team
          const targetTeamIndex = teams.findIndex(
            (team: any) => team.teamId === teamId
          );

          if (targetTeamIndex === -1) {
            throw console.log("Team not found for admin");
          }

          // Add the new task to the team's task array
          teams[targetTeamIndex].task = [
            ...(teams[targetTeamIndex].task || []),
            task,
          ];

          // Update the user document
          await updateDoc(userRef, { teams });

          alert("Task added successfully!");
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
      console.log("All tasks added successfully.");
    } catch (error) {
      console.error("Error adding tasks:", error);
    }
  };

  const createTask = async () => {
    const taskId = uuidv4();
    const task: TaskType = {
      taskId,
      taskName,
      taskDescription,
      priority,
      taskColor,
      deadline,
      selectedMembers,
    };
    console.log("taskfromteam", task);
    await saveTask(task);
    setTaskName("");
    setDeadline(null);

    setTaskDescription("");
    setCategory("Personal");
    setPriority("High");
    setTaskColor("purple");
    setSelectedMembers([]);
  };
  // const handleSave = async() => {
  //     await addTask(
  //         userId,
  //         taskName,
  //         category,
  //         priority,
  //         taskColor,
  //         deadline,
  //         endDate,
  //         taskDescription
  //       );

  //       // Optionally reset form fields after saving
  //       setTaskName("");
  //       setDeadline(null);
  //       setEndDate(null);
  //       setTaskDescription("");
  //       setCategory("Personal");
  //       setPriority("High")
  //       setTaskColor("purple");
  // }

  return (
    // <IoMdClose onClick={() =>logout()} size={32} className='font-bold'  />

    <div className="flex-1 h-full pt-4 pb-4  px-5 lg:px-28 overflow-auto">
      <div className="flex gap-9  text-text font-bold my-4">
        {/* onClick={() =>logout()} */}
        <IoMdClose size={32} className="font-bold" />
        <h2 className="text-3xl font-semibold mb-6 text-text">
          Create New Task
        </h2>
      </div>

      <div className="mb-4 border-b border-text">
        <label className="block text-lg font-semibold mb-2 text-gray">
          Task Title
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
          Deadline
        </label>
        <div className="relative w-full">
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
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

      {/* Description */}
      <div className="mb-4 border-b border-text">
        <label className="block text-lg font-semibold text-gray mb-2">
          Task Description
        </label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          rows={2}
          className="w-full  bg-bgColor text-text text-lg    outline-none"
        ></textarea>
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

      <div className="mb-4 text-text">
        <label className="block font-medium mb-2">Assigned Members:</label>
        <div className="flex gap-4 flex-wrap">
          {selectedMembers.map((member) => (
            <div
              key={member.uid}
              className="relative w-16 h-16 group cursor-pointer"
            >
              <img
                src={member.photoURL}
                alt={member.displayName}
                className="w-full h-full rounded-full object-cover"
              />
              <button
                className="absolute top-0 right-0 bg-[red] text-text rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                onClick={() => removeMember(member.uid)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
        >
          Add Members
        </button>
      </div>

      {/* Modal for Selecting Members */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-sidebar rounded-lg shadow-lg w-3/4 max-w-xl p-6 overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 text-text">
              Select Members
            </h2>
            <div className="flex flex-col gap-2">
              {team?.members.map((member) => (
                <div
                  key={member.uid}
                  className="flex flex-row gap-3 items-center cursor-pointer hover:bg-gray p-2 rounded-lg"
                  onClick={() => handleMemberSelect(member)}
                >
                  <img
                    src={member.photoURL}
                    alt={member.displayName}
                    className="w-12 h-12 rounded-full object-cover mb-2"
                  />
                  <p className="text-lg font-bold text-gray">
                    {member.displayName}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray text-text rounded-lg mr-2 hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-[#007bff]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
          onClick={createTask}
          className="w-full  p-3 bg-ascent text-text text-lg font-bold rounded-lg hover:bg-yellow-400"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default CreateTeamTask;
