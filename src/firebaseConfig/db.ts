
import {doc, setDoc, getDoc, arrayUnion, updateDoc} from 'firebase/firestore';
import {db} from './firebase'
import { v4 as uuidv4 } from "uuid"; 
import { useRef } from 'react';

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
  
      console.log("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };


  export const getTasks = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId)
      console.log("userRef", userRef)
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
  