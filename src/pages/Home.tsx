import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNavigation from "../components/BottomNavigation";
import TaskOverview from "../components/TaskOverview";
import { RiNotification3Line } from "react-icons/ri";
import OngoingTasks from "../components/OngoingTasks";
import {useDispatch, useSelector} from 'react-redux'
import { fetchAndSetTasks } from "../redux/taskSlice";
import { useState, useEffect } from "react";
import {auth} from '../firebaseConfig/firebase'
import { getTasks } from "../firebaseConfig/db";
import { Timestamp } from "firebase/firestore";
import { AppDispatch, RootState } from "../redux/taskSlice";

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

const Home = () => {
  const tasks = useSelector((state:RootState) => state.tasks);
const dispatch = useDispatch<AppDispatch>();

console.log('tasks', tasks)
  const storedUser = localStorage.getItem("user")
  const usern = storedUser ? JSON.parse(storedUser)?.displayName : null;
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  const username: string = usern?.split(" ")[0] || "User";
  console.log('fromhomhde', username)

  // const [tasks, setTasks] = useState<TaskType[]>([])

  useEffect(() => {
    console.log('callelee')
    const fetchTasks = async () => {
      if(!storedUser) return;
      
      console.log('userIdfromongon', userId)
      const userTasks = await getTasks(userId)
      console.log("userTasks", userTasks)
      dispatch(fetchAndSetTasks(userTasks)); // Dispatch tasks to Redux store
    }
    console.log('homeee')
     fetchTasks()
  }, [dispatch])


  console.log('taskkkdk', tasks)
  return (
    
      
   

  
     <div className="flex-1 h-full pt-4 mb-32 lg:px-12 ">
      {/* Header */}
      <div className="flex  justify-between items-center px-4">
        <div>
          <h1 className="text-lg font-semibold my-6 text-abstract">
            Hello <span className="text-text">{username}</span> 👋
          </h1>
          <h2 className="text-5xl font-playfair text-text font-semibold">
            Manage Your Daily Task
          </h2>
        </div>
        <button className="p-2 bg-gray-800 rounded-full">
          <RiNotification3Line size={24} />
        </button>
      </div>
      <OngoingTasks tasks={tasks} />
      <TaskOverview />

      <BottomNavigation />
    </div>
 
   
  );
};

export default Home;
