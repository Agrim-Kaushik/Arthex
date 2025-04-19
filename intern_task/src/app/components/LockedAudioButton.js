"use client";
import { useState, useRef, useEffect } from 'react';
import FeedbackForm from './FeedbackForm';

export default function LockedAudioButton() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioSource, setAudioSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const audioUrl = URL.createObjectURL(file);
      setAudioSource(audioUrl);
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Update progress bar
  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  // Play handler
  const handlePlay = () => {
    if (!hasPlayed && audioSource) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // End of playback handler
  const handleEnded = () => {
    setIsPlaying(false);
    setHasPlayed(true);
    setShowFeedback(true);
    URL.revokeObjectURL(audioSource); // Clean up memory
  };

  return (
    <div className="mt-4 space-y-4 max-w-md">
      {/* File input */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Audio File (mp3)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={hasPlayed}
        />
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Play button */}
      <button
        onClick={handlePlay}
        disabled={!audioSource || hasPlayed}
        className={`px-6 py-3 rounded-lg font-medium transition-colors w-full ${
          hasPlayed ? "bg-gray-300 cursor-not-allowed" :
          !audioSource ? "bg-gray-300 cursor-not-allowed" :
          "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isLoading ? "Loading..." : 
         hasPlayed ? "Playback Completed" : 
         isPlaying ? "Playing..." : 
         "Play Audio"}
      </button>

      {/* Hidden audio element */}
      {audioSource && (
        <audio
          ref={audioRef}
          onTimeUpdate={updateProgress}
          onEnded={handleEnded}
          className="hidden"
        >
          <source src={audioSource} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    
      {/* Feedback Form */}
      {showFeedback && (
        <div className="mt-6">
          <FeedbackForm />
        </div>
      )}
    </div>
  );
}