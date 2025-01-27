import React from "react";
import { Link } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import OfflinePage from "../components/OfflinePage";
import { useTheme } from "../context/ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import TaskOverview from "../components/TaskOverview";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsMoon, BsSunFill } from "react-icons/bs";
import OngoingTasks from "../components/OngoingTasks";
import { useDispatch, useSelector } from "react-redux";
import { fetchAndSetTasks } from "../redux/taskSlice";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContex";

import {
  fetchNotifications,
  markNotificationsAsRead,
} from "../firebaseConfig/db";

import { ScaleLoader } from "react-spinners";
import { AppDispatch, RootState } from "../redux/taskSlice";

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string;
  timestamp: Date;
  read: boolean;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const { theme, toggleTheme } = useTheme(); // Access theme context here

  const [hasUnread, setHasUnread] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState<boolean>(false);
  const storedUser = localStorage.getItem("user");
  const usern = storedUser ? JSON.parse(storedUser)?.displayName : null;
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  const username: string = usern?.split(" ")[0] || "User";
  const [loading, setLoading] = useState<boolean>(true);

  // const [tasks, setTasks] = useState<TaskType[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!storedUser) return;

        const userRef = doc(db, "users", userId);

        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userTasks = userSnap.data().tasks || [];

          dispatch(fetchAndSetTasks(userTasks)); // Dispatch tasks to Redux store
        } else {
          console.log("E NO DEY");
        }
      } catch (error) {
        setError(true);
        console.log("Error retrieving tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserNotifications = async () => {
      const userId = user?.uid ?? null;
      if (userId) {
        const userNotifications = await fetchNotifications(userId);
        if (userNotifications) {
          setNotifications(userNotifications);
          setHasUnread(
            userNotifications.some((notif: Notification) => !notif.read)
          );
        }
      }
    };

    fetchUserNotifications();

    fetchTasks();
  }, [dispatch, notifications]);

  const handleMarkAsRead = async () => {
    if (!user) return;
    const userId = user.uid;

    await markNotificationsAsRead(userId);
    setHasUnread(false);
  };

  if (error) {
    return <OfflinePage />;
  }
  return (
    <div className="flex-1 h-full pt-4 mb-32 lg:px-28 ">
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
        <div className="flex gap-6">
          {/* <button className="p-2 bg-gray rounded-full">
          <RiNotification3Line size={24} />
        </button> */}
          <Link to={"/notifications"}>
            <button
              onClick={handleMarkAsRead}
              className="relative p-2 bg-gray rounded-full"
            >
              <IoNotificationsOutline size={28} className="font-bold" />
              {/* Red Dot for Unread Notifications */}
              {hasUnread && (
                <span className="absolute bottom-8 right-0 w-5 h-5 bg-[#e91e1e] rounded-full"></span>
              )}
            </button>
          </Link>
          <button onClick={toggleTheme} className="text-text">
            {theme === "dark" ? <BsMoon size={24} /> : <BsSunFill size={24} />}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-20">
          <ScaleLoader color="#36D7B7" />
        </div>
      ) : (
        <OngoingTasks tasks={tasks} error={error} />
      )}

      <TaskOverview />

      <BottomNavigation />
    </div>
  );
};

export default Home;
