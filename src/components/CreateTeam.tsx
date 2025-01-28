import { useState } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
import {
  addDoc,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { addNotification } from "../firebaseConfig/db";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
interface TeamAdmin extends User {}

interface TeamMember extends User {}



// interface Team {
//   teamName: string;
//   teamAdmin: string;
//   teamAdminName: string;
//   members: TeamMember;
// }

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
  const { user } = useAuth();
  const userIde = user?.uid ?? null;
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

  const handleNotification = async (
    userId: string,
    title: string,
    link: string,
    message: string
  ) => {
    if (userIde) {
      await addNotification(userId, title, link, message);
    } else {
      console.error("User ID is null");
    }
  };
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

      //   const userQuery = query(
      //     collection(db, "users"),
      //     where("email", "==", email)
      //   ); //Reference the user document by email
      //   const adminQuery = query(
      //     collection(db, "users"),
      //     where("email", "==", adminDetails.email)
      //   ); // //Reference the admin document by email
      //   const userSnapshot = await getDocs(userQuery);
      //   const adminSnapshot = await getDocs(adminQuery);
      //   console.log("usersnap", userSnapshot);
      //   if (!userSnapshot.empty) {
      //     const userDoc = userSnapshot.docs[0]; // Get the first matching document
      //     const adminDoc = adminSnapshot.docs[0];
      //     const userRef = userDoc.ref; // Extract the DocumentReference
      //     const adminRef = adminDoc.ref;
      //     userSnapshot.forEach((doc) => {
      //       const userData = doc.data() as {
      //         uid: string;
      //         email: string;
      //         name: string;
      //         profilePicture: string;
      //       };

      //       // Create the member details object
      //       const memberDetails: TeamMember = {
      //         uid: userData.uid,
      //         email: userData.email,
      //         displayName: userData.name,
      //         photoURL: userData.profilePicture,
      //       };

      //       // Add to the membersDetails array
      //       membersDetails.push(memberDetails);
      //     });
      //     console.log('memsberDetails', membersDetails)
      //     console.log('userRef', userRef)
      //     // update the team in the user structure
      //     await updateDoc(userRef, {
      //       teams: arrayUnion({
      //         teamId: teamDocRef.id,
      //         teamName,
      //         teamAdmin: adminDetails,
      //         teamDescription,
      //         role: "Member",
      //         task: [],
      //         members: membersDetails,
      //         createdAt: Date.now(),
      //       }),
      //     });
      //     // update it to the admin i.e user creating the team
      //     await updateDoc(adminRef, {
      //       teams: arrayUnion({
      //         teamId: teamDocRef.id,
      //         teamName,
      //         teamAdmin: adminDetails,
      //         teamDescription: teamDescription,
      //         task: [],
      //         role: "Admin",
      //         members: membersDetails, ///we are reciving an array here so and array of object of member details
      //         createdAt: Date.now(),
      //       }),
      //     });

      //     // Add the user to the team's members array
      //     await updateDoc(teamDocRef, {
      //       members: arrayUnion(...membersDetails),
      //     });
      //     await Promise.all(memberPromises);
      //   } else {
      //     allMembersValid = false;

      //     alert(`User with email ${email} is not registered.`);
      //   }
      // });
      const memberPromises = members.map(async (email) => {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data() as {
            uid: string;
            email: string;
            name: string;
            profilePicture: string;
          };

          //create member details object
          const memberDetails: TeamMember = {
            uid: userData.uid,
            email: userData.email,
            displayName: userData.name,
            photoURL: userData.profilePicture,
          };
          // Add to membersDetails array
          membersDetails.push(memberDetails);
        } else {
          allMembersValid = false;
          alert(`User with email ${email} is not registered.`);
        }
      });
      await Promise.all(memberPromises);

      // If all members are valid, perform the updates
      if (allMembersValid) {
        const updatePromises = members.map(async (email) => {
          const userQuery = query(
            collection(db, "users"),
            where("email", "==", email)
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            // This code is so that our userdata will be able and used in notification
            const userData = userDoc.data() as {
              uid: string;
              email: string;
              name: string;
              profilePicture: string;
            };
            const userRef = userDoc.ref;

            // Update the team in the user's document
            await updateDoc(userRef, {
              teams: arrayUnion({
                teamId: teamDocRef.id,
                teamName,
                teamAdmin: adminDetails,
                teamDescription,
                role: "Member",
                task: [],
                members: membersDetails, // Use the fully populated array
                createdAt: Date.now(),
              }),
            });
            const title = "New Team!";
            const message = "You've been added to a new team!";
            const link = `/team/${teamDocRef.id}`;
            const userId = userData.uid;
            handleNotification(userId, title, link, message);
          }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
      }
      // Update the admin's teams field once, outside the loop
      const adminQuery = query(
        collection(db, "users"),
        where("email", "==", adminDetails.email)
      );
      const adminSnapshot = await getDocs(adminQuery);
      if (!adminSnapshot.empty) {
        const adminDoc = adminSnapshot.docs[0];
        const adminRef = adminDoc.ref;

        await updateDoc(adminRef, {
          teams: arrayUnion({
            teamId: teamDocRef.id,
            teamName,
            teamAdmin: adminDetails,
            teamDescription,
            role: "Admin",
            task: [],
            members: membersDetails, // Final members array
            createdAt: Date.now(),
          }),
        });
      }

      // Update the team document
      await updateDoc(teamDocRef, {
        members: arrayUnion(...membersDetails),
      });
      // Check if all members are valid before alerting success
      if (allMembersValid) {
        alert("Team created successfully!");
        setTeamName(""); // Reset team name
        setTeamDescription("");
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
      <div className="flex gap-20  text-text font-bold my-4 ">
        <MdClose size={30} className="font-bold" onClick={goBack} />
        <h2 className="text-2xl font-bold mb-6 text-form">Create Team</h2>
      </div>

      <div className=" flex flex-col gap-3 2xl:gap-6  ">
        <div className="mb-4 border-b border-text">
          <label className="block text-lg font-bold mb-2 text-form">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-3 bg-bgColor text-form text-lg  outline-none "
          />
        </div>
        <div className="mb-4 border-b border-text">
          <label className="block text-lg font-bold mb-2 text-form">
            Team Description
          </label>
          <input
            type="text"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            className="w-full p-3 bg-bgColor text-form text-lg  outline-none "
          />
        </div>

        <div className="mb-4 ">
          <div className="border-b border-text mb-5">
            <label className="block text-lg font-bold mb-2 text-form">
              Add Team Members
            </label>
            <div className="flex flex-row mb-2">
              <input
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3 bg-bgColor text-form text-lg  outline-none "
              />
              <button
                className="bg-ascent text-lg px-3 py-1 rounded-md font-bold"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>

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
