import React, { useState, useEffect } from "react";
import { Teams } from "../assets/index";
import { getTeams } from "../firebaseConfig/db";
import { Link } from "react-router-dom";
import BottomNavigation from '../components/BottomNavigation';

interface TeamDetails {
  teamName : string;
  members: string[];
  role: string;
  teamId: string;
}
const Team = () => {
  const [teams, setTeams] = useState<TeamDetails[]>([]);
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

    useEffect(() => {
      console.log('teams',teams)
      fetchTeams()
    }, [])
  return (
    <div className="flex-1 h-full pt-4  pb-4  px-5 lg:px-28 overflow-auto">
      <div className="lg:pt-0 pt-5">
        <h1 className=" text-text text-3xl font-bold my-4 ">
          Increase Productivity and Collaborations with Team
        </h1>
        <p className="text-lg font-bold text-gray mt-2">
          Collaborate and conquer tasks with your amazing team.
        </p>
        <Link 
        to={'/create-team'}
        >
        <button
      
        className="bg-[#FCD34D]  my-8 text-xl font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-3 justify-center transition duration-300 mx-auto md:mx-0" >
        Create Team
      </button>
      </Link>
        <div>
          <img
            src={Teams}
            alt="Taking Notes"
            className="w-full max-w-md mx-auto md:max-w-lg transform animate-fade-in hover:scale-105 transition-transform duration-300"
          />
        </div>
        {!teams || teams.length==0 ? (
           <div className="flex flex-col items-center justify-center mt-4 text-center">
           <h1 className="text-4xl font-bold text-gray mb-4">No Team Found</h1>
           <p className="text-lg text-gray mb-6">
             You haven't joined or created a team yet. Start collaborating today
             by creating your own team!
           </p>
           {/* <button className="bg-ascent text-text px-6 py-3 rounded-lg shadow-md font-semibold hover:bg-blue-500 transition">
             Create Team
           </button> */}
         </div>
        ):(

          <div className="space-y-4 ">
            <h1 className="text-text text-3xl text-center font-bold">Teams</h1>
          {teams.map((team, index) => (
            <Link
            to={`/team/${team.teamId}`}
            >
            <div
              key={index}
              className="p-4 bg-lightgrey rounded-xl cursor-pointer shadow-md space-y-2"
            >
              
              <h3 className="text-2xl font-bold text-text">{team.teamName}</h3>
              <p className="text-lg text-[#9CA3AF]">{team.members.length} Members</p>
             
              {/* <p className="text-sm text-[#9CA3AF]">Due Date: {task.dueDate}</p> */}
              <div className="flex -space-x-2">
                {/* {avatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full border-2 border-[#050404]"
                  />
                ))} */}
              </div>
            </div>
            </Link>
          ))}
        </div>
        )
      }
       
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Team;
