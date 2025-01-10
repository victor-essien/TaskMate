import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeamDetails } from "../firebaseConfig/db";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdInfo } from "react-icons/md";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";

interface TeamType {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;
  task: [];
  members: [];
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
  const { teamId } = useParams<string>();
  const navigate = useNavigate();
  console.log('tem',teamId)
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  if (!teamId) return;
  const handleCreateTask = () => {
    navigate("/create-task", {
      state: { teamId },
    });
  };
  const fetchTeam = async () => {
    const details = await fetchTeamDetails(userId, teamId);
    if (!details) return;
    setTeamDetail(details);
    console.log("details", details);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="flex-1 h-full pt-4  mb-32 lg:px-9 lg:pt-4 ">
      <div className="px-4">
        {/* <ScaleLoader  color="red"/> */}
        <div className="flex text-text justify-between pt-4 ">
        <h1 className="text-text  text-4xl font-bold ">{teamDetail?.teamName}</h1>
        <MdInfo size={40} />
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
        <div className="space-y-4">
        {tasks.map((task, index) => (
          <Link
          to={`/task/{'heeh`}
          >
          <div
            key={index}
            className="p-4 bg-lightgrey rounded-xl mb-3  shadow-md space-y-2"
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
              <span className="text-sm text-gray-400">{task.progress}%</span>
            </div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-[#9CA3AF]">10:00 AM - 6:00 PM</p>
            <p className="text-sm text-[#9CA3AF]"> {task.dueDate}
        {/* Due Date:{" "}
        {task.dueDate
          ? task.dueDate.toDate().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "No due date"} */}
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
          </Link>
        ))}
      </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ViewTeam;
