
import { Timestamp } from "firebase/firestore";
import {Link} from 'react-router-dom'
import { ScaleLoader } from "react-spinners";

interface TaskType  {
  priority: string;
  color: string;
  description:string;
  taskId: string;
  taskName:string;
  dueDate: Timestamp | null;
  startDate: Timestamp | null;
  progress:number | 82 
}

interface OngoingTasksProps {
  tasks: TaskType[];
}
const OngoingTasks: React.FC<OngoingTasksProps> = ({tasks}) => {

 

  const taskss = [
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
 

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text">Ongoing</h2>
        <button className="text-sm text-gray hover:text-text">See All</button>
      </div>
      <div className="space-y-4">
  {tasks.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-2 p-6  rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-text">No Task Found</h2>
      
      <Link
        to="/add"
        className="mt-4 px-4 py-2 bg-yellow font-bold text-lg rounded-lg hover:bg-blue-600"
      >
        Create New Task
      </Link>
    </div>
  ) : (
    tasks.map((task, index) => (
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
            <span className="text-sm text-gray-400">{task.progress}%</span>
          </div>
          <h3 className="text-lg font-semibold">{task.taskName}</h3>
          <p className="text-sm text-[#9CA3AF]">10:00 AM - 6:00 PM</p>
          <p className="text-sm text-[#9CA3AF]">
            Due Date: {" "}
            {task.dueDate
              ? task.dueDate.toDate().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "No due date"}
          </p>
        </div>
      </Link>
    ))
  )}
</div>

    </div>
  );
};

export default OngoingTasks;
