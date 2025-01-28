import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  arrayRemove,
  addDoc,
  arrayUnion,
  updateDoc,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContex";

interface adminType {
  displayName: string;
  photoURL: string;
  uid: string;
  email: string;
}

interface Team {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;
  members: [];
  teamAdmin: adminType;
  task: [];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string;
  timestamp: Date;
  read: boolean;
}

interface Task {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  status: string;
  category: string;
  taskName: string;
  dueDate: string ;
  startDate: Timestamp | null;
}

// Saving User comfiguration
export const saveUserToFirestore = async (user: any) => {
  const userData = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    profilePicture: user.photoURL || "",
  };

  console.log("Data being saved to Firestore:", userData);
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
  }
};

export const addTask = async (
  userId: string,
  taskName: string,
  category: string,
  priority: string,
  taskColor: string,
  startDate: Date | null,
  endDate: string | null,
  taskDescription: string
) => {
  try {
    const task = {
      taskId: uuidv4(), // Generate unique ID for the task
      taskName,
      category,
      priority,
      color: taskColor,
      dueDate: endDate || null, // If there's no end date, save as null
      startDate: startDate || null,
      status: "pending",
      description: taskDescription,
    };

    const userRef = doc(db, "users", userId); // Reference to the user's document
    await updateDoc(userRef, {
      tasks: arrayUnion(task), // Add task to the user's tasks array
    });

    alert("Task added successfully!");
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Function for getting tasks
export const getTasks = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);

    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().tasks || [];
    } else {
      console.log("User is not vailid");
    }
  } catch (error) {
    console.log("Error retrieving tasks:", error);
  }
};

export const getTeams = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      // so newer task appear first
      return (userSnap.data().teams || []).reverse();
    }
  } catch (error) {
    console.log("Error retrieving Teams:", error);
  }
};

export const fetchTeamDetails = async (userId: string, teamId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document not found.");
      return null;
    }
    const userData = userDoc.data();
    const teams: Team[] = userData?.teams || [];

    // Find the specific team by uid
    const team = teams.find((team) => team.teamId === teamId);

    if (!team) {
      console.log("Team not found.");
      return null;
    }

    return team;
  } catch (error) {
    console.log("Error fetching Team:", error);
  }
};

export const fetchTaskDetails = async (userId: string, taskId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("User document not found.");
      return null;
    }
    const userData = userDoc.data();
    const tasks: Task[] = userData?.tasks || [];

    // Find the specific team by uid
    const task = tasks.find((team) => team.taskId === taskId);

    if (!task) {
      console.log("Task not found.");
      return null;
    }

    return task;
  } catch (error) {
    console.log("Error fetching task details:", error);
  }
};

export const fetchComments = async (teamId: string, taskId: string) => {
  const commentsRef = collection(
    db,
    `teams/${teamId}/tasks/${taskId}/comments`
  );
  const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(commentsQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      text: data.text || "", // Default to empty string if missing
      author: data.author || "Anonymous", // Default to "Anonymous" if missing
      timestamp: data.timestamp?.toDate() || new Date(), // Convert Firestore Timestamp to JS Date
    };
  });
};

export const addComment = async (
  teamId: string,
  taskId: string,
  text: string,
  author: string
) => {
  const commentsRef = collection(
    db,
    `teams/${teamId}/tasks/${taskId}/comments`
  );
  await addDoc(commentsRef, {
    text,
    author,
    timestamp: Timestamp.now(),
  });
};

export const addNotification = async (
  userId: string,
  title: string,
  link: string,
  message: string
) => {
  try {
    const notification = {
      id: uuidv4(), //Unique ID for the notification
      title,
      link,
      message,
      timestamp: new Date(),
      read: false, //Mark as unread by default
    };

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      notifications: arrayUnion(notification), // Add the notification to the array
    });
    // console.log("Notification added successfully!");
  } catch (error) {
    console.log("Error adding notification:", error);
  }
};

export const fetchNotifications = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("fromdn", userData.notifications);
      return (userData.notifications || []).reverse(); // Return notifications array or an empty array
    } else {
      console.log("No user document found!");
      return [];
    }
  } catch (error) {
    console.log("Error fetching notifications:", error);
  }
};

export const markNotificationsAsRead = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const updatedNotifications: Notification[] = userData.notifications.map(
        (notification: Notification) => ({
          ...notification,
          read: true, // Mark all notifications as read
        })
      );

      await updateDoc(userRef, {
        notifications: updatedNotifications,
      });

      // console.log("All notifications marked as read!");
    } else {
      console.log("No user document found!");
    }
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

export const completeTask = async (userId: string, taskId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const tasks: Task[] = userData?.tasks || [];

    // find task by id
    const taskIndex = tasks.findIndex((tsk) => tsk.taskId === taskId);

    if (taskIndex !== -1) {
      //update task's status
      tasks[taskIndex].status = "completed";
      // Update the user's tasks array in Firestore
      await updateDoc(userRef, {
        tasks: tasks,
      });
    } else {
      console.log("Task not found");
    }
  } catch (error) {
    console.log("Error completing task", error);
  }
};

export const deleteTask = async (userId: string, taskId: string) => {
  try {
    const userRef = doc(db, "users", userId);

    // Retrieve the user's tasks to find the task to remove
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userTasks = userSnap.data().tasks || [];
      const taskToRemove = userTasks.find(
        (task: Task) => task.taskId === taskId
      );

      if (taskToRemove) {
        await updateDoc(userRef, {
          tasks: arrayRemove(taskToRemove),
        });

        // console.log("Task deleted successfully!");
      } else {
        console.log("Task not found!");
      }
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const checkTaskDeadlines = async () => {
  try {
    const { user } = useAuth();
    if (!user) return; // Ensure the user is logged in
    const userId = user.uid;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const tasks = userData.tasks || [];

      // Find tasks with deadlines matching today
      const dueToday = tasks.filter(
        (task: { dueDate: string }) => task.dueDate?.split("T")[0] === today
      );

      // Send notifications for each task
      //"It's time! The deadline for '{taskName}' is today. How's it going? 🚀"
      for (const task of dueToday) {
        const message = `Your task '${task.taskName}' is due today! How's it going?`;
        const link = `/task/${task.taskId}`;
        const title = "Deadline❗";
        await addNotification(userId, message, link, title); // "/tasks" could be a link to the task list
      }
    } else {
      console.log("No user document found!");
    }
  } catch (error) {
    console.error("Error checking task deadlines:", error);
  }
};

// const handleDeleteTask = async (taskId: string) => {
//   if (!auth.currentUser) return;
//   const userId = auth.currentUser.uid;

//   await deleteTask(userId, taskId);
//   // Optionally refresh tasks after deletion
// };
