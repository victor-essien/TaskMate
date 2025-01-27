import { RiHome6Line, RiAddCircleFill, RiUser3Line } from "react-icons/ri";
import { IoCalendarSharp } from "react-icons/io5";
import { MdSpeakerNotes } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-[#1a1a1a] lg:hidden p-4 flex justify-around items-center shadow-inner">
      <Link to={"/home"}>
        {" "}
        <RiHome6Line
          size={28}
          className="text-[#9CA3AF] hover:text-[#F1F5F9]"
        />
      </Link>

      <Link to={"/calendar"}>
        <IoCalendarSharp
          size={28}
          className="text-[#9CA3AF] hover:text-[#F1F5F9]"
        />
      </Link>
      <button className="p-4 bg-yellow rounded-full shadow-lg">
        <Link to={"/add"}>
          <RiAddCircleFill size={28} className="" />
        </Link>
      </button>
      <Link to={"/team"}>
        <MdGroups size={38} className="text-[#9CA3AF] hover:text-[#F1F5F9]" />
      </Link>
      <Link to={"/profile"}>
        <BsFillPersonFill
          size={28}
          className="text-[#9CA3AF] hover:text-[#F1F5F9]"
        />
      </Link>
    </div>
  );
};

export default BottomNavigation;
