import React from "react";
import { MdClose } from "react-icons/md";

interface TeamDescriptionProps {
  teamDetail: TeamType | undefined;
  handleClose: () => void;
  showDescription: boolean;
}
interface TeamMember {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}
interface adminType {
  displayName: string;
  photoURL: string;
  uid: string;
  email: string;
}

interface TeamType {
  teamId: string;
  teamName: string;
  teamDescription: string;
  role: string;

  members: TeamMember[];
  teamAdmin: adminType;
}

const TeamDescription: React.FC<TeamDescriptionProps> = ({

  handleClose,
  teamDetail,
}) => {
  //    if(!showDescription) return null;
  if (!teamDetail) return null;
  return (
    <>
      <div className="fixed z-50 bg-[gray] bg-opacity-50  inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-0 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[black] bg-opacity-70"></div>
          </div>
          <span className=" sm:inline-block sm:align-middle sm:h-screen"></span>

          <div
            className="inline-block align-bottom bg-ivory rounded-lg text-left overflow-hidden shadow-xl bg-bgColor transform transition-all sm:my-8 sm:align-middle max-w-lg w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex  justify-between px-6 pt-5 pb-2">
              <button className="text-text" onClick={() => handleClose()}>
                <MdClose size={32} />
              </button>
            </div>
            <div className=" flex items-center justify-center pb-3 px-3 ">
              <div className="w-full max-w-md">
                <div className="hidden lg:flex justify-center  ">
                  {/* <img src={ImgLogo} alt="" className='h-20 w-20' /> */}
                </div>
                {/* <h2 className="text-2xl hidden lg:block text-black text-center font-bold mb-3">Welcome to RecipScape</h2> */}

                <div>
                  <p className="text-gray text-xl font-semibold mb-4">
                    Team Name
                  </p>

                  <h2 className="text-3xl text-texv font-bold mb-5  pb-3">
                    {teamDetail?.teamName}
                  </h2>
                  <p className="text-gray text-xl font-semibold mb-4">
                    Team Description
                  </p>
                  <p className="text-2xl font-bold mb-8  text-texv ">
                    {teamDetail?.teamDescription}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-gray text-xl font-semibold mb-4">
                      Members
                    </p>
                    <p className="text-gray text-xl font-semibold mb-4">
                      {teamDetail?.members.length}
                    </p>
                  </div>
                  {teamDetail?.members.map((member) => (
                    <div
                      key={member?.uid}
                      className="flex flex-row gap-3 mb-4 items-center cursor-pointer hover:bg-gray p-2 rounded-lg"
                    >
                      <img
                        src={member.photoURL}
                        alt={member.displayName}
                        className="w-12 h-12 rounded-full object-cover mb-2"
                      />
                      <p className="text-lg font-bold text-gray">
                        {member.displayName}
                      </p>
                    </div>
                  ))}
                  <p className="text-gray text-xl font-semibold mb-4">Admin</p>
                  <div className="flex flex-row gap-3 mb-4 items-center cursor-pointer hover:bg-gray p-2 rounded-lg">
                    <img
                      src={teamDetail?.teamAdmin.photoURL}
                      alt={teamDetail?.teamAdmin.displayName}
                      className="w-12 h-12 rounded-full object-cover mb-2"
                    />
                    <p className="text-lg font-bold text-gray">
                      {teamDetail?.teamAdmin.displayName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDescription;
