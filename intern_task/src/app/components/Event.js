// components/Event.js
"use client"
import { signInWithGoogle } from "../../../lib/auth";
import { FaGoogle } from 'react-icons/fa';

export default function Event({ event }) {
  const handleCardClick = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Logged in user:", user);
    } catch (error) {
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {event?.title || "Untitled Event"}
          </h3>
          <p className="text-gray-600 mt-1">
            {event?.description || "No description available"}
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <FaGoogle className="h-5 w-5" />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}
