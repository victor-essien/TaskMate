import React from 'react';
import {Notes} from '../assets/index'
import { FcGoogle } from "react-icons/fc";
import Auth from './Auth';

const SignIn: React.FC = () => {
  return (
    // <div className="min-h-screen bg-bgColor flex flex-col items-center justify-center px-4">
    //   {/* Logo Section */}
    //   <div className="absolute top-6 left-6">
    //     <h1 className="text-3xl font-extrabold font-playfair text-text dark:text-gray-100">TaskMate</h1>
    //   </div>

    //   {/* Main Content */}
    //   <div className="max-w-3xl text-center lg:flex flex-row">
    //     {/* Header Text */}
    //     <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium mb-10">
    //       Simplify your tasks and maximize your productivity with TaskMate, your ultimate task organizer.
    //     </p>
    //     <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-2 px-6 rounded-lg shadow-lg flex items-center mx-auto gap-3 justify-center transition duration-300">
    //       {/* Google Icon */}
    //       <img
    //         src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
    //         alt="Google"
    //         className="w-5 h-5"
    //       />
    //       Sign in with Google
    //     </button>
    //     {/* Vector Image */}
    //     <div className="mb-10">
    //       <img
    //         src={Notes}
    //         alt="Taking Notes"
    //         className="w-full max-w-md mx-auto"
    //       />
    //     </div>

    //     {/* Google Sign-In Button */}
       
    //   </div>
    // </div>
    <div className="min-h-screen bg-bgColor flex items-center justify-center px-4">
    <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-10">
      {/* Left Section: Text and Button */}
       {/* Logo Section */}
      <div className="absolute top-6 left-6">
        <h1 className="text-3xl font-extrabold font-playfair text-text dark:text-gray-100">TaskMate</h1>
      </div>
      <div className="flex-1 text-center md:text-left animate-fade-in">
        {/* <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          TaskMate
        </h1> */}
        <h1 className='font-bold text-text text-5xl font-playfair lg:my-6 my-9'>Manage your Daily Activity</h1>
        <p className="text-xl text-text font-playfair font-bold mb-6 mt-8 ">
          Simplify your tasks and maximize your productivity with TaskMate, your ultimate task organizer.
        </p>
       <Auth />
      </div>

      {/* Right Section: Image */}
      <div className="flex-1">
        <img
          src={Notes}
          alt="Taking Notes"
          className="w-full max-w-md mx-auto md:max-w-lg transform animate-fade-in hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  </div>
  );
};

export default SignIn;



