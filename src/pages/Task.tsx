import React from 'react'
import BottomNavigation from '../components/BottomNavigation';
import { IoArrowBackOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";

type TaskColor = "bg-Purple" | "bg-Yellow" | "bg-Gray" | "bg-Green";

const Task: React.FC = () => {

    const assignedTo = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
      ];
    
      const attachments = [
        "https://via.placeholder.com/100",
        "https://via.placeholder.com/100",
        "https://via.placeholder.com/100",
      ];

      // Task color variable
  const taskColor:string = "bg-Purple"; // Change this value for testing different colors

  // Determine gradient styles based on taskColor
  let gradientStyle:string
  switch (taskColor) {
    case "bg-Purple":
      gradientStyle = "linear-gradient(to right, #D8B4FE, #C084FC, #A855F7)";
      break;
    case "bg-Yellow":
      gradientStyle = "linear-gradient(to right, #FDE68A, #FCD34D, #FBBF24)";
      break;
    case "bg-Gray":
      gradientStyle = "linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)";
      break;
    case "bg-Green":
      gradientStyle = "linear-gradient(to right, #A7F3D0, #6EE7B7, #34D399)";
      break;
    default:
      gradientStyle = "linear-gradient(to right, #E5E7EB, #D1D5DB, #9CA3AF)"; // Default fallback
  }

  return (
    <div className='flex-1 h-full  mb-32 lg:px-9 lg:pt-4   '>
    <div className=" mx-auto  shadow-lg overflow-auto pb-32">
    {/* Top Section with Hex Background */}
    <div
      className="p-6 text-black"
      style={{
        background: gradientStyle,
      }}
    >
      <div className=" flex justify-between text-lg font-extrabold lg:hidden ">
<IoArrowBackOutline size={32} />
<CiEdit size={34}  />

</div>
<div className='flex flex-col justify-center'>
<h1 className='text-2xl font-bold my-5 text-center'>Salon App Wireframe & UI</h1> 
<div className='flex flex-col gap-4 text-xl px-3'>
<div className='flex flex-row  justify-between'>
        <span className='font-semibold'>Start Date</span>
        <span className='font-bold'>August 12, 2024</span>
    </div>
    <div className='flex flex-row  justify-between'>
        <span className='font-semibold'>End Date</span>
        <span className='font-bold'>January 12, 2024</span>
    </div>
    <div className='flex flex-row  justify-between'>
        <span className='font-semibold'>Time</span>
        <span className='font-bold'>10 AM - 6 PM</span>
    </div>
    <div className='flex flex-row  justify-between'>
        <span className='font-semibold'>Priority</span>
        <span
className={`px-2 py-1 text-lg text-[#F1F5F9] font-semibold rounded-md bg-[#EF4444]`}>
    High
</span>
    </div>
</div>
</div>
    </div>

    {/* Bottom Section with Dark Background */}
    <div className="  text-text p-6">
     <div className='bg-bgColor'>
      <div className="mb-4 text-text border-b border-gray pb-4">
        <h2 className="text-2xl font-semibold">Description:</h2>
        <p className="text-xl font-medium mt-1 ">
          Hey guys! 👋 Make wireframe first & complete this task ASAP! Send me
          updates daily!
        </p>
      </div>
      <div className="mb-4 border-b border-gray pb-4">
        <h2 className="text-2xl font-medium mb-2">Assigned To:</h2>
        <div className="flex space-x-2 mt-1">
          {assignedTo.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-8 h-8 rounded-full border-2 border-gray"
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-medium mb-2">Attachments:</h2>
        <div className="flex space-x-2 mt-1">
          {attachments.map((attachment, index) => (
            <img
              key={index}
              src={attachment}
              alt={`Attachment ${index + 1}`}
              className="w-20 h-20 rounded-lg border border-gray"
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-medium ">Task Color:</h2>
        <p className="mt-1 text-xl font-semibold" style={{ color: "#d1c4e9" }}>
          Light Purple
        </p>
      </div>
      
    </div>
    </div>
  </div>
  <BottomNavigation />
  </div>
  )
}

export default Task