'use client'

import { useState, useRef } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface StoryCardProps {
  title: string;
  author: string;
  videoSrc: string;
}

export function StoryCard({ title, author, videoSrc }: StoryCardProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 rounded-sm">
        <video 
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-black/20 flex items-center justify-center">
            {/* Play indicator */}
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
               <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>

            {/* Mute Toggle */}
            <button 
              onClick={toggleMute}
              className="absolute bottom-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
         <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{author}</p>
         <h4 className="text-sm font-medium leading-relaxed max-w-sm group-hover:text-neutral-500 transition-colors border-b border-transparent group-hover:border-neutral-200 pb-0.5 inline-block w-fit">{title}</h4>
      </div>
    </div>
  );
}
