import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase"; // Ensure Firebase is initialized
import { ScaleLoader } from "react-spinners";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContex";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import BottomNavigation from "../components/BottomNavigation";

//Styled component for our Calendar from react-calendar
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  max-width: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: ;
  padding: 10px;

  border-radius: 3px;

  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;
    background-color: black;

    .react-calendar__navigation__label {
      font-weight: bold;
      display: none;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
      display: none;
    }
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  /* ~~~ button styles ~~~ */
  button {
    margin: 3px;
    background-color: #6f876f;
    border: 0;
    border-radius: 3px;
    font-weight: 700;
    font-size: 1rem;
    color: white;
    padding: 5px 0;

    &:hover {
      background-color: #556b55;
    }

    &:active {
      background-color: #a5c1a5;
    }
  }

  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
      padding: 0.75rem;
      border-radius: 0.373rem;
    }

    .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px black;
      background-color: black;
    }
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
    border-radius: 60px;
    visibility: hidden;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #dfdfdf;
  }

  /* ~~~ other view styles ~~~ */
  .react-calendar__year-view__months,
  .react-calendar__decade-view__years,
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;

    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;

interface Task {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  status: string;
  category: string;
  taskName: string;
  dueDate: any; //Firebase Timestamp
  startDate: string;
}

const CalendarWithTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [taskColor, setTaskColor] = useState<string>("bg-Purple"); //setting our colors for task
  const [activeMonth, setActiveMonth] = useState(
    format(new Date(), "MMMM yyyy")
  );
  const [value, setValue] = useState(new Date());

  const handleSetColor = (color: string) => {
    setTaskColor(color);
  };
  console.log("taskCplor", taskColor);
  let gradientStyle: string;
  switch (taskColor) {
    case "bg-Purple":
      gradientStyle = "#A855F7";
      break;
    case "bg-Yellow":
      gradientStyle = "#FBBF24";
      break;
    case "bg-Gray":
      gradientStyle = "#6B7280";
      break;
    case "bg-Green":
      gradientStyle = "#34D399";
      break;
    default:
      gradientStyle = "#9CA3AF"; // Default fallback
  }


  
 // useEffect to handle task color
  useEffect(() => {
    tasks.forEach((task) => {
      handleSetColor(task.color);
    });
  }, [tasks]);
  let dayNumber: string | null;
  const fetchTasks = async () => {
    if (!user) return; // Ensure the user is authenticated

    setLoading(true);
    try {
      // Get the user's document
      const userDocRef = doc(db, "users", user.uid); 
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userTasks = userData?.tasks || []; // Assuming tasks are stored in `tasks` under the user document
        console.log("UserTas", userTasks);
        // Filter tasks based on the selected date
        console.log("selec", selectedDate);
        dayNumber = selectedDate.split("-").pop() || null;
        console.log("dayNumber", dayNumber);
        const tasksForDate = userTasks.filter((task: Task) => {
          const taskDate = task.dueDate.toDate(); // Convert Firestore Timestamp to JavaScript Date
          const formattedTaskDate = format(taskDate, "yyyy-MM-dd"); // Format the date as 'YYYY-MM-DD'
          console.log("taskdate", formattedTaskDate);
          return formattedTaskDate === selectedDate; // Compare with selectedDate
        });

        setTasks(tasksForDate);
        console.log("tasg", tasks);
      } else {
        console.warn("User document does not exist!");
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate, user]);

 

  return (
    <div className="flex-1 h-full pt-4 pb-4 px-5 lg:px-28 overflow-auto">
      <div className="p-4   ">
        <div className="border-b border-gray ">
          <CalendarContainer>
            <Calendar
              onChange={(date: Date) =>
                setSelectedDate(format(date, "yyyy-MM-dd"))
              }
              value={new Date(selectedDate)}
            />
          </CalendarContainer>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <ScaleLoader color="#36D7B7" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-2xl text-text font-bold mt-4 text-center">
            No tasks found for this date.
          </p>
        ) : (
          <div className="w-full mt-4 space-y-3">
            <h1 className="text-text font-bold text-xl text-center">Tasks</h1>
            {tasks.map((task, index) => (
              <div key={task?.taskId} className="flex items-start gap-2">
                {/* Rounded span for the date */}
                {index === 0 && (
                  <span className="bg-[#0f0f0f] border-gray text-gray px-4 py-4 text-base font-bold rounded-full flex items-center justify-center">
                    {selectedDate.split("-").pop()}
                  </span>
                )}
                {/* Task container taking remaining width */}
                <div
                  className="flex-grow p-4 rounded-lg shadow-md"
                  style={{
                    background: gradientStyle,
                  }}
                >
                  <h3 className="text-2xl text-bgColor font-bold">
                    {task.taskName}
                  </h3>
                  <p className="text-lg text-text font-semibold">
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CalendarWithTasks;
