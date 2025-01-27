import { useAuth } from "../context/AuthContex";
import BottomNavigation from "../components/BottomNavigation";
import { HiOutlineLogout } from "react-icons/hi";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 h-full mb-32 lg:px-9 lg:pt-4 bg-bgColor">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center pt-14 pb-9">
          <img
            src={user?.photoURL ?? ""}
            alt={user?.displayName ?? "User"}
            className="rounded-full w-48 h-48 border-4 border-[#cccccc]"
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-form mb-2">
            {user?.displayName}
          </h1>
          <p className="text-2xl font-bold text-[#666666]">{user?.email}</p>

          <div className="mt-6"></div>

          <div
            className="flex flex-row gap-3 items-center justify-center mt-6"
            onClick={() => logout()}
          >
            <p className="text-2xl font-bold text-texv">Log Out</p>
            <HiOutlineLogout
              size={39}
              className="text-[#666666] font-bold cursor-pointer"
            />
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Profile;
