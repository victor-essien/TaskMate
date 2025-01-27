import React from "react";

const OfflinePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bgColor text-text text-center space-y-6">
      {/* Animated WiFi Icon */}
      <div className="animate-pulse">
        <svg
          className="w-20 h-20 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20h.01M8 16.37a4 4 0 018 0M5.6 12.56a9 9 0 0112.8 0M2.05 8.27a14 14 0 0119.9 0"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold animate-bounce">You're Offline!</h1>

      {/* Message */}
      <p className="text-lg font-medium text-gray">
        Oops! It seems like you've lost your internet connection. Please check
        your connection and try again.
      </p>

      {/* Retry Button */}
      <button
        className="px-6 py-3 bg-lightgrey text-texv font-bold rounded-lg  transition duration-300 shadow-lg hover:shadow-bgColor/50"
        onClick={() => window.location.reload()}
      >
        Retry Connection
      </button>

      {/* Animation: Cloud with a crossed WiFi icon */}
      <div className="mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-48 text-gray-500 opacity-75"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 15a4 4 0 014-4h1a4 4 0 014-4h2a4 4 0 014 4h1a4 4 0 014 4v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3zm8-7v4m0 0v4m0-4h4m-4 0H7"
          />
        </svg>
      </div>
    </div>
  );
};

export default OfflinePage;
