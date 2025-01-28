import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeamDetails } from "../firebaseConfig/db";
import {  MdInfo } from "react-icons/md";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import TeamDescription from "./TeamDescription";


interface adminType {
  displayName: string;
  photoURL: string;
  uid: string;
  email: string;
}

interface TeamMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
interface TaskType {
  taskId: string;
  taskName: string;
  taskDescription: string;
  taskColor: string | null;
  deadline:Date | null;
  priority: string;
  selectedMembers: TeamMember[];
}

interface TeamType {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;
  task: TaskType[];
  members: TeamMember[];
  teamAdmin: adminType;
}

const ViewTeam: React.FC = () => {
    
 
  const [teamDetail, setTeamDetail] = useState<TeamType>();
  const [showDescription, setShowDescription] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { teamId } = useParams<string>();
  const navigate = useNavigate();
 
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  if (!teamId) return;

  //  Handle Create Task
  const handleCreateTask = () => {
    navigate("/create-task", {
      state: { teamId },
    });
  };
  const handleViewTask = (taskId: string) => {
    navigate(`/team-task/${taskId}`, {
      state: { teamId },
    });
  };

      // Fetch Team
  const fetchTeam = async () => {
    try {
      setLoading(true)
      const details = await fetchTeamDetails(userId, teamId);
      if (!details) return;
      setTeamDetail(details);
      
    } catch (error) {
      console.log("Error", error)
    }finally{
      setLoading(false)
    }
   
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpen = () => {
    setShowDescription(true);
  };

  const handleClose = () => {
    setShowDescription(false);
  };

  return (
    <div className="flex-1 h-full pt-4  mb-32 lg:px-28 lg:pt-4 ">
      {loading? (
        <div className="flex items-center justify-center absolute inset-0 x-10">
        <ScaleLoader color="#36D7B7" />
      </div>
      ) : (
        <div>
           <div className="px-4">
        {/* <ScaleLoader  color="red"/> */}
        <div className="flex text-text justify-between pt-4 ">
        <h1 className="text-text  text-4xl font-bold ">{teamDetail?.teamName}</h1>
        <MdInfo size={40} onClick={handleOpen}  className="cursor-pointer"/>
      </div>
      {teamDetail?.role == 'Admin' ?
        (

            <button
      
            className="bg-[#FCD34D]  my-8 text-xl font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-3 justify-center transition duration-300 mx-auto md:mx-0" onClick={handleCreateTask} >
            Create New Task
          </button>
          
        ):(
            <span className="text-text"> </span>
        )
    }
   
      {teamDetail?.task.length == 0 && (
        <div className="flex justify-center items-center pt-12  ">
        <span className="text-texv text-3xl font-bold">No Task Available</span>
        </div>
      )}
    
      
         {/* Description Modal */}
        
      {showDescription && (
        <TeamDescription showDescription={showDescription} handleClose ={handleClose} teamDetail ={teamDetail} />
      )}
        <div className="space-y-4">
        {teamDetail?.task.map((task, index) => (
         
          <div
            key={index}
            className="p-4 bg-lightgrey rounded-xl mb-3 cursor-pointer  shadow-md space-y-2
            "
            onClick={ () => handleViewTask(task.taskId)}
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
              <span className="text-sm text-gray-400">66%</span>
            </div>
            <h3 className="text-lg font-semibold">{task.taskName}</h3>
            <p className="text-sm text-[#9CA3AF]">10:00 AM - 6:00 PM</p>
            <p className="text-sm= text-[#9CA3AF]"> 
        Due Date:{" "}
        {task?.deadline
                    ? task?.deadline.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No due date"}
        
         
      </p>
            {/* <p className="text-sm text-[#9CA3AF]">Due Date: {task.dueDate}</p> */}
            <div className="flex -space-x-2">
              {/* {avatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full border-2 border-[#050404]"
                />
              ))} */}
            </div>
          </div>
          
        ))}
      </div>
      </div>
        </div>
      )}
     
      <BottomNavigation />
    </div>
  );
};

export default ViewTeam;
