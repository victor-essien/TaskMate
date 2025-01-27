import { RiHome6Fill, RiAddCircleFill } from "react-icons/ri";
import { IoCalendarSharp } from "react-icons/io5";
import { BsFillPersonFill } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className=" h-screen flex flex-col justify-between py-6 px-6 shadow-lg fixed bg-lightgrey text-text">
      <div>
        {/* Top Section */}
        <div className="">
          {/* Menu Items */}
          <div className="space-y-2">
            {/* Home */}
            <Link to={"/home"}>
              <div className="flex flex-col items-center gap-2 p-2 rounded-lg transition duration-200 cursor-pointer">
                <div className="p-4 bg-[#18202b] rounded-full shadow-lg flex items-center  justify-center">
                  <RiHome6Fill
                    size={24}
                    className="text-[#9CA3AF] hover:text-[#F1F5F9]"
                  />
                </div>
                <p className="text-lg text-[#F1F5F9]">Home</p>
              </div>
            </Link>

            {/* Calendar*/}
            <Link to={"/calendar"}>
              <div className="flex items-center flex-col gap-4 p-2 rounded-lg  cursor-pointer">
                <div className="p-4 bg-[#18202b] rounded-full shadow-lg flex items-center  justify-center">
                  <IoCalendarSharp
                    size={24}
                    className="text-[#9CA3AF] hover:text-[#F1F5F9]"
                  />
                </div>
                <p className="text-lg text-[#F1F5F9]">Calendar</p>
              </div>
            </Link>
            {/* Add */}
            <Link to={"/add"}>
              <div className="flex items-center flex-col gap-4 p-2 rounded-lg  cursor-pointer">
                <div className="p-4 bg-yellow rounded-full shadow-lg flex items-center  justify-center">
                  <RiAddCircleFill
                    size={24}
                    className="hover:text-[#9CA3AF] text-[#050404]"
                  />
                </div>
                <p className="text-lg text-[#F1F5F9]">Add</p>
              </div>
            </Link>
            {/* Notes */}
            <Link to={"/team"}>
              <div className="flex items-center flex-col gap-4 p-2 rounded-lg  cursor-pointer">
                <div className="p-4 bg-[#18202b] rounded-full shadow-lg flex items-center  justify-center">
                  <MdGroups
                    size={24}
                    className="text-[#9CA3AF] hover:text-[#F1F5F9]"
                  />
                </div>
                <p className="text-lg text-[#F1F5F9]">Team</p>
              </div>
            </Link>
            {/* Profile */}
            <Link to={"/profile"}>
              <div className="flex items-center flex-col gap-4 p-2 rounded-lg  cursor-pointer">
                <div className="p-4 bg-[#18202b] rounded-full shadow-lg flex items-center  justify-center">
                  <BsFillPersonFill
                    size={24}
                    className="text-[#9CA3AF] hover:text-[#F1F5F9]"
                  />
                </div>
                <p className="text-lg text-[#F1F5F9]">Profile</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Post Button */}
      </div>
    </div>
  );
};

export default Sidebar;
