// src/components/Auth.tsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig/firebase";
import { useAuth } from "../context/AuthContex";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { saveUserToFirestore } from "../firebaseConfig/db";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSignIn = async () => {
    // e.preventDefault()

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
      saveUserToFirestore(user);
      login({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      navigate("/home");

      //   <Navigate to={'/home'} />

      // Save user info in the database if needed
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };


  return (
    <div>
      <button
        onClick={handleSignIn}
        className="bg-[#3B82F6] hover:bg-[#2563EB] text-text text-lg font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-3 justify-center transition duration-300 mx-auto md:mx-0"
      >
        <FcGoogle className="text-2xl text-white text-left" />
        Sign in with Google
      </button>
      {/* <button
        onClick={handleSignOut}
        className="bg-red-500 text-white py-2 px-4 rounded mt-4"
      >
        Sign Out
      </button> */}
    </div>
  );
};

export default Auth;
