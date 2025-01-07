import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import BottomNavigation from "./BottomNavigation";
import { Timestamp } from "firebase/firestore";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
interface TeamAdmin extends User {}

interface TeamMember extends User {}

interface TaskType {
  priority: string;
  color: string;
  description: string;
  taskId: string;
  status: string;
  category: string;
  taskName: string;
  dueDate: Timestamp | null;
  startDate: Timestamp | null;
}

interface Team {
  teamId: string;
  teamName: string;
  teamAdmin: TeamAdmin;
  teamDescription: string;
  role: "Admin" | "Member";
  task: TaskType[]; // Define the task structure if needed
  members: TeamMember[];
  createdAt: any;
}
// interface Team {
//   teamName: string;
//   teamAdmin: string;
//   teamAdminName: string;
//   members: TeamMember;
// }
interface Userr {
  uid: string;
  email: string;
  displayName: string;
}
// interface TeamAdmin {
//   displayName: string;
//   photoURL: string;
//   uid: string;
//   email: string;
// }

const CreateTeam = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [teamDescription, setTeamDescription] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [info, setInfo] = useState<string>("");
  const userString = localStorage.getItem("user");
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This will navigate to the previous URL
  };
  // Check if userString is null
  if (!userString) {
    throw new Error("User is not logged in.");
  }

  // Parse userString to a User object

  const handleAdd = () => {
    if (value.trim()) {
      // Add the input value as a new keyword if it's not empty
      setMembers((prevKeywords) => [...prevKeywords, value.trim()]);
      setValue(""); // Reset input field
    }
  };
  const handleRemoveMember = (index: number) => {
    setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      alert("Team name cannot be empty.");
      return;
    }

    try {
      const user: TeamAdmin = JSON.parse(userString);
      console.log(user);

      const adminDetails: TeamAdmin = {
        displayName: user.displayName, // Assumes the user object has a `name` field
        photoURL: user.photoURL, // Assumes the user object has a `profilePicture` field
        uid: user.uid,
        email: user.email,
      };
      console.log("admindetails", adminDetails);
      const teamDocRef = await addDoc(collection(db, "teams"), {
        teamName,
        teamAdmin: adminDetails,
        teamDescription,
        teamAdminName: user.displayName,
        task: [],
        members: [],
        createdAt: serverTimestamp(),
      });

      let allMembersValid = true; // Flag to check if all members are valid
      const membersDetails: TeamMember[] = [];
      const memberPromises = members.map(async (email) => {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        ); //Reference the user document by email
        const adminQuery = query(
          collection(db, "users"),
          where("email", "==", adminDetails.email)
        ); // //Reference the admin document by email
        const userSnapshot = await getDocs(userQuery);
        const adminSnapshot = await getDocs(adminQuery);
        console.log("usersnap", userSnapshot);
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0]; // Get the first matching document
          const adminDoc = adminSnapshot.docs[0];
          const userRef = userDoc.ref; // Extract the DocumentReference
          const adminRef = adminDoc.ref;
          userSnapshot.forEach((doc) => {
            const userData = doc.data() as {
              uid: string;
              email: string;
              name: string;
              profilePicture: string;
            };

            // Create the member details object
            const memberDetails: TeamMember = {
              uid: userData.uid,
              email: userData.email,
              displayName: userData.name,
              photoURL: userData.profilePicture,
            };

            // Add to the membersDetails array
            membersDetails.push(memberDetails);
          });
          // update the team in the user structure
          await updateDoc(userRef, {
            teams: arrayUnion({
              teamId: teamDocRef.id,
              teamName,
              teamAdmin: adminDetails,
              teamDescription,
              role: email === adminDetails.email ? "Admin" : "Member",
              task: [],
              members: membersDetails,
              createdAt: Date.now(),
            }),
          });
          // update it to the admin i.e user creating the team
          await updateDoc(adminRef, {
            teams: arrayUnion({
              teamId: teamDocRef.id,
              teamName,
              teamAdmin: adminDetails,
              teamDescription: teamDescription,
              task: [],
              role: "Admin",
              members: membersDetails, ///we are reciving an array here so and array of object of member details
              createdAt: Date.now(),
            }),
          });
          //           // Step 2: Retrieve the updated teams array and find the new team
          // const userDdoc = await getDoc(adminRef);
          // const userData = userDdoc.data();

          // if (userData && userData.teams) {
          //   const updatedTeams = userData.teams.map((team: any) =>
          //     team.teamId === teamDocRef.id
          //       ? { ...team, createdAt: serverTimestamp() }
          //       : team
          //   );

          //   // Step 3: Update the teams array with createdAt added to the specific team
          //   await updateDoc(adminRef, {
          //     teams: updatedTeams,
          //     })}

          // Add the user to the team's members array
          await updateDoc(teamDocRef, {
            members: arrayUnion(...membersDetails),
          });
          await Promise.all(memberPromises);
        } else {
          allMembersValid = false;

          alert(`User with email ${email} is not registered.`);
        }
      });

      // Check if all members are valid before alerting success
      if (allMembersValid) {
        alert("Team created successfully!");
        setTeamName(""); // Reset team name
        setMembers([]); // Reset members
      } else {
        alert(
          "Some users were not registered or there were errors. Please review and try again."
        );
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  console.log(
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(1736227524140))
  );
  return (
    <div className="flex-1 h-full pt-4 pb-4 px-5  lg:px-28 ">
      <div className="flex gap-9  text-text font-bold my-4 justify-between">
        <h2 className="text-2xl font-semibold mb-6 text-text">Create Team</h2>
        <MdClose size={30} className="font-bold" onClick={goBack} />
      </div>

      <div className=" flex flex-col gap-3 2xl:gap-6  ">
        <div className="mb-4 border-b border-text">
          <label className="block text-lg font-semibold mb-2 text-gray">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-3 bg-bgColor text-text text-lg  outline-none "
          />
        </div>
        <div className="mb-4 border-b border-text">
          <label className="block text-lg font-semibold mb-2 text-gray">
            Team Description
          </label>
          <input
            type="text"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            className="w-full p-3 bg-bgColor text-text text-lg  outline-none "
          />
        </div>

        <div className="mb-4 ">
          <div className="border-b border-text mb-5">
            <label className="block text-lg font-semibold mb-2 text-gray">
              Add Team Members
            </label>
            <div className="flex flex-row mb-2">
              <input
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 bg-bgColor text-text text-lg  outline-none "
              />
              <button
                className="bg-ascent text-lg px-3 py-1 rounded-md font-semibold"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
          <p className="font-bold text-text ">{info}</p>
          <div className="flex flex-col gap-2 mt-2 ">
            {members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between font-bold text-lg gap-3 bg-gray p-3 rounded"
              >
                <span>{member}</span>
                <button
                  className="text-lightgrey font-semibold"
                  onClick={() => handleRemoveMember(index)}
                >
                  <MdClose size={30} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className="w-full px-4 my-4 py-2 bg-[#6EE7B7] text-lightgrey font-bold text-xl rounded-md shadow hover:bg-[#34D399]"
          onClick={handleCreateTeam}
        >
          Create Team
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CreateTeam;
