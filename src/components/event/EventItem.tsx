'use client'

import { useState, useEffect } from "react";
import { format, differenceInSeconds, isValid } from "date-fns";
import { toggleEventRsvp } from "@/app/actions/event";

interface Event {
  id: string;
  title: string;
  description?: string;
  datetime: string;
}

export function EventItem({ event, userIsRsvpd }: { event: Event, userIsRsvpd: boolean }) {
  const [isPending, setIsPending] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const eventTime = new Date(event.datetime);
    if (!isValid(eventTime)) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(eventTime, now);

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (24 * 3600)),
        h: Math.floor((diff % (24 * 3600)) / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event.datetime]);

  async function handleRsvp() {
    setIsPending(true);
    await toggleEventRsvp(event.id);
    setIsPending(false);
  }

  const dateObject = new Date(event.datetime);
  const formattedDate = isValid(dateObject) ? format(dateObject, "MMMM d, yyyy 'at' h:mm a") : "Date TBD";

  return (
    <div className="flex flex-col md:flex-row gap-8 py-16 border-b border-neutral-100 last:border-0 group items-start">
       <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-neutral-50 px-6 py-8 border border-neutral-100 flex flex-col gap-6">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Event Starts In</h4>
             
             {timeLeft ? (
                <div className="grid grid-cols-4 gap-2 text-center">
                   <div className="flex flex-col"><span className="text-3xl font-light">{timeLeft.d}</span><span className="text-[8px] uppercase tracking-widest text-neutral-400">Days</span></div>
                   <div className="flex flex-col"><span className="text-3xl font-light">{timeLeft.h}</span><span className="text-[8px] uppercase tracking-widest text-neutral-400">Hrs</span></div>
                   <div className="flex flex-col"><span className="text-3xl font-light">{timeLeft.m}</span><span className="text-[8px] uppercase tracking-widest text-neutral-400">Min</span></div>
                   <div className="flex flex-col"><span className="text-3xl font-light">{timeLeft.s}</span><span className="text-[8px] uppercase tracking-widest text-neutral-400">Sec</span></div>
                </div>
             ) : (
                <span className="text-sm font-medium">Calculating...</span>
             )}
          </div>
       </div>

       <div className="w-full md:w-2/3 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-black mb-3">{formattedDate}</span>
          <h3 className="text-3xl md:text-5xl font-normal leading-[1.1] tracking-tight text-neutral-400 mb-6 group-hover:text-black transition-colors">
             {event.title}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-lg mb-8">
             {event.description}
          </p>
          
          <button 
            onClick={handleRsvp} 
            disabled={isPending}
            className={`self-start px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${userIsRsvpd ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300' : 'bg-black text-white hover:bg-neutral-800'}`}
          >
            {userIsRsvpd ? 'Joined. Remove RSVP' : 'Join Event'}
          </button>
       </div>
    </div>
  )
}
