import React from "react";
import { Notes } from "../assets/index";
import Auth from "./Auth";

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen bg-bgColor flex items-center justify-center px-4">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-10">
        {/* Left Section: Text and Button */}
        {/* Logo Section */}
        <div className="absolute top-6 left-6">
          <h1 className="text-3xl font-extrabold font-playfair text-text dark:text-gray-100">
            Tazkly
          </h1>
        </div>
        <div className="flex-1 text-center md:text-left animate-fade-in">
          {/* <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
          TaskMate
        </h1> */}
          <h1 className="font-bold text-text text-5xl font-playfair lg:my-6 my-9">
            Manage your Daily Activity
          </h1>
          <p className="text-xl text-text font-playfair font-bold mb-6 mt-8 ">
            Simplify your tasks and maximize your productivity with TaskMate,
            your ultimate task organizer.
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
