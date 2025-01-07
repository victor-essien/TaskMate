import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeamDetails } from "../firebaseConfig/db";

interface TeamType {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;
  members: [];
}

const ViewTeam: React.FC = () => {
  const [teamDetail, setTeamDetail] = useState<TeamType>();
  const { teamId } = useParams<string>();
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)?.uid : null;
  if (!teamId) return;
  const fetchTeam = async () => {
    const details = await fetchTeamDetails(userId, teamId);
    if (!details) return;
    setTeamDetail(details);
    console.log("details", details);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="flex-1 h-full  mb-32 lg:px-9 lg:pt-4 ">
      <div>
        <h1></h1>
      </div>
    </div>
  );
};

export default ViewTeam;
