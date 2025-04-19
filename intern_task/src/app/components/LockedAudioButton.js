"use client";
import { useState, useRef, useEffect } from 'react';
import FeedbackForm from './FeedbackForm';
import { FaPlay, FaPause, FaFileAudio } from 'react-icons/fa';

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
    <div className="space-y-6">
      {/* File input */}
      <div className="flex flex-col gap-3">
        <label className="block text-sm font-medium text-gray-700">
          Select Audio File
        </label>
        <div className="relative">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              file:transition-colors file:duration-200"
            disabled={hasPlayed}
          />
          <FaFileAudio className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Play button */}
      <button
        onClick={handlePlay}
        disabled={!audioSource || hasPlayed}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2
          ${hasPlayed ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
          !audioSource ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"}`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : hasPlayed ? (
          <span>Playback Completed</span>
        ) : isPlaying ? (
          <div className="flex items-center space-x-2">
            <FaPause className="h-4 w-4" />
            <span>Playing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <FaPlay className="h-4 w-4" />
            <span>Play Audio</span>
          </div>
        )}
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
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Share Your Experience</h3>
          <FeedbackForm/>
        </div>
      )}
    </div>
  );
}