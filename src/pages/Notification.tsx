import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContex";
import { MdClose, MdNotificationsActive } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "../firebaseConfig/db";
import { Link } from "react-router-dom";

interface NotificationType {
  id: string;
  title: string;
  message: string;
  link: string;
  timestamp: Date;
  read: boolean;
}

const Notification: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const userId = user?.uid;
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This will navigate to the previous URL
  };

  useEffect(() => {
    const fetchUserNotifications = async () => {
      if (userId) {
        const userNotifications = await fetchNotifications(userId);
        if (userNotifications) {
          setNotifications(userNotifications);
        }
      }
    };
    fetchUserNotifications();
  }, [userId, notifications]);

  return (
    <div className="min-h-screen bg-bgColor flex  justify-center">
      <div className="bg-bgColor shadow-lg rounded-lg  max-w-md w-full">
        <div className="flex gap-5  text-text font-bold  mx-2 mt-8 mb-4">
          <MdClose
            size={30}
            className="font-bold cursor-pointer"
            onClick={goBack}
          />
          <h2 className="text-3xl font-bold text-form mb-4">Notifications</h2>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-texv text-xl font-bold">
                No Notifications Available
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                className="p-4 border-b border-gray flex items-start bg-lightgrey rounded-lg "
                key={notification?.id}
              >
                <div className="mr-4">
                  <MdNotificationsActive
                    size={30}
                    style={{ color: "#4299E1" }}
                  />
                </div>
                <Link to={notification.link}>
                  <p className="font-bold text-[#F9FAFB] text-lg mb-2 ">
                    {notification?.title}
                  </p>
                  <p className="text-lg text-[#9CA3AF] font-semibold">
                    {notification?.message}
                  </p>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
