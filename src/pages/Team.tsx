import React, { useState, useEffect } from "react";
import { Teams } from "../assets/index";
import { getTeams } from "../firebaseConfig/db";
import { Link } from "react-router-dom";
import BottomNavigation from '../components/BottomNavigation';
import {ScaleLoader} from 'react-spinners';
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
  const [loading, setLoading] = useState<boolean>(false)
  const fetchTeams = async () => {
    try {
      setLoading(true)
      const userTeam = await getTeams(userId);
      setTeams(userTeam);
      console.log('from here',userTeam)
    } catch (error) {
      console.log("Error Fetching", error);
    } finally {
      setLoading(false)
    }
  };

    useEffect(() => {
      console.log('teams',teams)
      fetchTeams()
    }, [])
  return (
    <div className="flex-1 h-full pt-4 pb-4 px-5 lg:px-28 overflow-auto">
    <div className="lg:pt-0 pt-5 mb-14">
      {/* Header Section */}
      <h1 className="text-text text-3xl font-bold my-4">
        Increase Productivity and Collaborations with Team
      </h1>
      <p className="text-lg font-bold text-gray mt-2">
        Collaborate and conquer tasks with your amazing team.
      </p>
      <Link to="/create-team">
        <button
          className="bg-[#FCD34D] my-8 text-xl font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-3 justify-center transition-transform duration-300 mx-auto md:mx-0 hover:scale-105"
        >
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
  
      {/* Teams Section */}
      {!teams || teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-4 text-center">
          <h1 className="text-4xl font-bold text-gray mb-4">No Team Found</h1>
          <p className="text-lg text-gray mb-6">
            You haven't joined or created a team yet. Start collaborating today
            by creating your own team!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-text text-3xl text-center my-7 font-bold">Teams</h1>
          {loading ? (
            <div className="flex items-center justify-center">
              <ScaleLoader color="#36D7B7" />
            </div>
          ) : (
            <div>
              {teams.map((team, index) => (
                <div key={index}>
                  <Link to={`/team/${team.teamId}`}>
                    <div className="p-4 bg-lightgrey rounded-xl cursor-pointer shadow-md mb-3 space-y-2 hover:shadow-lg transition-shadow">
                      <h3 className="text-2xl font-bold text-text">
                        {team.teamName}
                      </h3>
                      <p className="text-lg text-[#9CA3AF]">
                        {team.members.length} Members
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  
    {/* Bottom Navigation */}
    <BottomNavigation />
  </div>
  
  );
};

export default Team;
