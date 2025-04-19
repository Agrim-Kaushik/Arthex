"use client";
import Image from "next/image";
import Event from "./components/Event";

import LockedAudioButton from "./components/LockedAudioButton";

export default function Home() {
  return (
    <div>
      <Event event={{title:"Hello", description:"This is the new description"}}/>
      <h1 className="text-2xl font-bold mb-4">Audio Demo</h1>
      <LockedAudioButton />
    </div>
  );
}

