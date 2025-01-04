
import { auth, provider } from "../firebaseConfig/firebase";
import React, {createContext, useState, useEffect, useContext, ReactNode} from 'react'
import { onAuthStateChanged, signOut } from "firebase/auth";

interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

interface AuthContextType {
    user: User | null;
    login:(user:User) => void;
    logout:() => void;
}



const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(() => {
        // Retrieve user from localStorage on initial load
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      });
    // const [user, setUser] = useState<any>(null);
    console.log('fromauth', user)
    const login = (user: User) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
      };
    const logout = () => {
        console.log('Lofouueue')
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
  };
// Sync user state with Firebase auth state changes
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Update localStorage
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);
    // const login = (user:any) => setUser(user);
    // const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
}

export const useAuth = ()  => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };