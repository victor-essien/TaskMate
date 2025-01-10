
import {doc, setDoc, getDoc, arrayUnion, updateDoc} from 'firebase/firestore';
import {db} from './firebase'
import { v4 as uuidv4 } from "uuid"; 
import { useRef } from 'react';
import { Timestamp } from "firebase/firestore";


interface Team {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;
    members: [];
  task: []
}

interface Task {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  status: string,
  category: string
  taskName: string;
  dueDate: Timestamp | null;
  startDate: Timestamp | null;
 
}

export const saveUserToFirestore = async (user: any) => {
    const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL || '',
        tasks: [],
      };
    
      console.log('Data being saved to Firestore:', userData);
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, userData, { merge: true });
        console.log('User successfully saved to Firestore');
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
    endDate: Date | null,
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


  export const getTasks = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId)
      console.log("userRefgg", userRef)
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()) {
        return userSnap.data().tasks || []
      } else{
        console.log("E NO DEY")
      }
    } catch (error) {
      console.log("Error retrieving tasks:", error)
    }
  }
   
  export const getTeams = async(userId:string) => {
    try{
      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)
      if(userSnap.exists()) {
        return userSnap.data().teams || []
      }
    } catch (error){
      console.log("Error retrieving Teams:", error)
    }
  }

  export const fetchTeamDetails = async(userId:string, teamId: string) => {

    try {
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

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
      console.log('Error fetching Team:' , error)
    }
  }

  export const fetchTaskDetails = async(userId:string, taskId:string) => {
    try {
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        console.error("User document not found.");
        return null;
      }
      const userData = userDoc.data();
      const tasks: Task[] = userData?.tasks || [];
  
      // Find the specific team by uid
      const task = tasks.find((team) => team.taskId === taskId);
  
      if (!task) {
        console.log("Team not found.");
        return null;
      }
  
      return task;
    } catch (error) {
      
    }
  }
  // export const deleteTask = async (userId: string, taskId: string) => {
  //   try {
  //     const userRef = doc(db, "users", userId);
  
  //     // Retrieve the user's tasks to find the task to remove
  //     const userSnap = await getDoc(userRef);
  //     if (userSnap.exists()) {
  //       const userTasks = userSnap.data().tasks || [];
  //       const taskToRemove = userTasks.find((task) => task.taskId === taskId);
  
  //       if (taskToRemove) {
  //         await updateDoc(userRef, {
  //           tasks: arrayRemove(taskToRemove),
  //         });
  
  //         console.log("Task deleted successfully!");
  //       } else {
  //         console.log("Task not found!");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error deleting task:", error);
  //   }
  // };
  // const handleDeleteTask = async (taskId: string) => {
  //   if (!auth.currentUser) return;
  //   const userId = auth.currentUser.uid;
  
  //   await deleteTask(userId, taskId);
  //   // Optionally refresh tasks after deletion
  // };
  