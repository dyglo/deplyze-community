'use client'

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { togglePrayerVote } from "@/app/actions/prayer";
import { formatDistanceToNow } from "date-fns";

interface PrayerRequest {
  id: string;
  title: string;
  description?: string;
  category: string;
  votes_count: number;
  created_at: string;
  profiles?: {
    full_name?: string;
    username?: string;
  };
}

export function PrayerItem({ request, userVoted }: { request: PrayerRequest, userVoted: boolean }) {
  const [isPending, setIsPending] = useState(false);
  const authorName = request.profiles?.full_name || request.profiles?.username || "Anonymous";

  async function handleVote() {
    setIsPending(true);
    await togglePrayerVote(request.id);
    setIsPending(false);
  }

  return (
    <div className="flex gap-6 py-10 border-b border-neutral-100 last:border-0 group">
      <div className="flex flex-col items-center gap-2">
         <button 
            onClick={handleVote} 
            disabled={isPending}
            className={`flex flex-col items-center justify-center p-3 border hover:border-black transition-colors ${userVoted ? 'bg-black text-white border-black' : 'border-neutral-200 text-neutral-500'}`}
         >
            <ChevronUp className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold tracking-widest">{request.votes_count}</span>
         </button>
         <span className="text-[8px] uppercase font-bold tracking-widest text-neutral-400">Pray</span>
      </div>

      <div className="flex flex-col flex-1">
         <div className="flex items-center gap-3 mb-3">
             <span className="text-[10px] uppercase font-bold tracking-widest bg-neutral-100 text-neutral-600 px-2 py-0.5">{request.category}</span>
             <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">{authorName}</span>
             <span className="text-neutral-200">&bull;</span>
             <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
             </span>
         </div>
         <h4 className="text-xl sm:text-2xl font-light tracking-tight text-black mb-3">{request.title}</h4>
         {request.description && (
             <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">{request.description}</p>
         )}
      </div>
    </div>
  )
}
