// components/Event.js
"use client"
import { signInWithGoogle } from "../../../lib/auth";

export default function Event({ event }) {
  const handleCardClick = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Logged in user:", user); // Optional: Redirect or update UI
    } catch (error) {
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div
      id="login"
      onClick={handleCardClick}
      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
    >
      <h3 className="text-lg font-bold">{event?.title || "Untitled Event"}</h3>
      <p className="text-gray-600">{event?.description || "No description available"}</p>
    </div>
  );
}
