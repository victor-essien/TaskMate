import React, { useState } from "react";
import { Teams } from "../assets/index";
import { getTeams } from "../firebaseConfig/db";

const Team = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  const fetchTeams = async () => {
    try {
      const userTeam = await getTeams(userId);
      setTeams(userTeam);
    } catch (error) {
      console.log("Error Fetching", error);
    }
  };
  return (
    <div className="flex-1 h-full pt-4  pb-4  px-5 lg:px-28 overflow-auto">
      <div className="lg:pt-0 pt-5">
        <h1 className=" text-text text-3xl font-bold my-4 ">
          Increase Productivity and Collaborations with Team
        </h1>
        <p className="text-lg font-bold text-gray mt-2">
          Collaborate and conquer tasks with your amazing team.
        </p>

        <div>
          <img
            src={Teams}
            alt="Taking Notes"
            className="w-full max-w-md mx-auto md:max-w-lg transform animate-fade-in hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col items-center justify-center mt-4 text-center">
          <h1 className="text-4xl font-bold text-gray mb-4">No Team Found</h1>
          <p className="text-lg text-gray mb-6">
            You haven't joined or created a team yet. Start collaborating today
            by creating your own team!
          </p>
          <button className="bg-ascent text-text px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-blue-500 transition">
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
