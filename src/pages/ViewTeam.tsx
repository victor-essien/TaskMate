import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeamDetails } from "../firebaseConfig/db";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdClose, MdInfo } from "react-icons/md";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";


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
    
  const tasks = [
    {
      priority: "High",
      title: "Salon App Wireframe",
      time: "10:00 AM - 6:00 PM",
      dueDate: "August 25",
      progress: 82,
      avatars: [
        "https://via.placeholder.com/24", // Avatar placeholder
        "https://via.placeholder.com/24",
      ],
    },
    {
        priority: "High",
        title: "Salon App Wireframe",
        time: "10:00 AM - 6:00 PM",
        dueDate: "August 25",
        progress: 82,
        avatars: [
          "https://via.placeholder.com/24", // Avatar placeholder
          "https://via.placeholder.com/24",
        ],
      },
    {
      priority: "Medium",
      title: "Marketing Website",
      time: "12:00 PM - 4:00 PM",
      dueDate: "August 27",
      progress: 64,
      avatars: [],
    },
  ];
  avatars: [
    "https://via.placeholder.com/24", // Avatar placeholder
    "https://via.placeholder.com/24",
  ]
  const [teamDetail, setTeamDetail] = useState<TeamType>();
  const [showDescription, setShowDescription] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { teamId } = useParams<string>();
  const navigate = useNavigate();
  console.log('tem',teamId)
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
      console.log("details", details);
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
    <div className="flex-1 h-full pt-4  mb-32 lg:px-9 lg:pt-4 ">
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
        <MdInfo size={40} onClick={handleOpen} />
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
      <div className="pt-12 text-center mb-4">
      {teamDetail?.role == 'Admin' ?
        (
            <span className="text-text text-3xl font-playfair  "> Available Tasks </span>
        ):(
            <span className="text-text"> </span>
        )
    }
        </div>
         {/* Description Modal */}
      {showDescription && (
        <div className="fixed inset-0 bg-bgColor bg-opacity-50  text-text   w-full  z-50">
          <div className=" p-6 rounded-lg shadow-lg">
            <div className="mb-5"><MdClose size={36} onClick={handleClose}/></div>
            <p className="text-gray text-xl font-semibold mb-4">Team Name</p>

            <h2 className="text-3xl font-bold mb-5  pb-3">{teamDetail?.teamName}</h2>
            <p className="text-gray text-xl font-semibold mb-4">Team Description</p>
            <p className="text-2xl font-bold mb-8">
                {teamDetail?.teamDescription}
            </p>
            <div className="flex justify-between">
            <p className="text-gray text-xl font-semibold mb-4">Members</p>
            <p className="text-gray text-xl font-semibold mb-4">{teamDetail?.members.length}</p>
            </div>
            {teamDetail?.members.map((member) => (
                <div
                  key={member?.uid}
                  className="flex flex-row gap-3 mb-4 items-center cursor-pointer hover:bg-gray p-2 rounded-lg"
                  
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
               <p className="text-gray text-xl font-semibold mb-4">Admin</p>
               <div
                  
                  className="flex flex-row gap-3 mb-4 items-center cursor-pointer hover:bg-gray p-2 rounded-lg"
                  
                >
                  <img
                    src={teamDetail?.teamAdmin.photoURL}
                    alt={teamDetail?.teamAdmin.displayName}
                    className="w-12 h-12 rounded-full object-cover mb-2"
                  />
                  <p className="text-lg font-bold text-gray">
                    {teamDetail?.teamAdmin.displayName}
                  </p>
                </div>
           
          </div>
        </div>
      )}
        <div className="space-y-4">
        {teamDetail?.task.map((task, index) => (
         
          <div
            key={index}
            className="p-4 bg-lightgrey rounded-xl mb-3  shadow-md space-y-2
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
                    ? new Date(task?.deadline).toLocaleDateString("en-US", {
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
