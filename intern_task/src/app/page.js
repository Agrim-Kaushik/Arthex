"use client";
import Image from "next/image";
import Event from "./components/Event";
import LockedAudioButton from "./components/LockedAudioButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Audio Experience</h1>
          
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <Event event={{title:"Welcome!", description:"Login using this button"}}/>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Audio Player</h2>
            <LockedAudioButton />
          </div>
        </div>
      </div>
    </div>
  );
}

