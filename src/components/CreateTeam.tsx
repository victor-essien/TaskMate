import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  getDoc,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { AuthProvider, useAuth } from "../context/AuthContex";
import { db } from "../firebaseConfig/firebase";

interface TeamMember {
  uid: string;
  email: string;
  name: string;
  profilePicture: string;
}

interface Team {
  teamName: string;
  teamAdmin: string;
  teamAdminName: string;
  members: TeamMember;
}
interface Userr {
  uid: string;
  email: string;
  displayName: string;
}
interface TeamAdmin {
  displayName: string;
  photoURL: string;
  uid: string;
  email: string;
}

const CreateTeam = () => {
  const [teamName, setTeamName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [info, setInfo] = useState<string>("");
  const userString = localStorage.getItem("user");

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
      const adminDetails = {
        name: user.displayName, // Assumes the user object has a `name` field
        profilePicture: user.photoURL, // Assumes the user object has a `profilePicture` field
        uid: user.uid,
        email: user.email,
      };
      console.log("admindetails", adminDetails);
      const teamDocRef = await addDoc(collection(db, "teams"), {
        teamName,
        teamAdmin: adminDetails,
        teamAdminName: user.displayName,
        members: [],
      });

      let allMembersValid = true; // Flag to check if all members are valid
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
        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0]; // Get the first matching document
          const adminDoc = adminSnapshot.docs[0];
          const userRef = userDoc.ref; // Extract the DocumentReference
          const adminRef = adminDoc.ref;
          const userData = userDoc.data() as {
            uid: string;
            email: string;
            name: string;
            profilePicture: string;
          };

          await updateDoc(userRef, {
            teams: arrayUnion({
              teamId: teamDocRef.id,
              teamName,
              role: "Member",
              members: members,
            }),
          });

          await updateDoc(adminRef, {
            teams: arrayUnion({
              teamId: teamDocRef.id,
              teamName,
              role: "Admin",
              members: members,
            }),
          });
          // Add the user to the team's members array
          await updateDoc(teamDocRef, {
            members: arrayUnion({
              uid: userData.uid,
              email: userData.email,
              name: userData.name,
              profilePicture: userData.profilePicture,
            }),
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
  return (
    <div className="flex-1 h-full pt-4 pb-4 px-5  lg:px-28 ">
      <div className="flex gap-9  text-text font-bold my-4 justify-between">
        <h2 className="text-2xl font-semibold mb-6 text-text">Create Team</h2>
        <MdClose size={30} className="font-bold" />
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
    </div>
  );
};

export default CreateTeam;
