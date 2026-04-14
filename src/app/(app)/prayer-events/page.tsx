import { createClient } from "@/lib/supabase/server";
import { EventItem } from "@/components/event/EventItem";
import { CheckCircle, Globe, Video } from "lucide-react";

export default async function PrayerEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('datetime', new Date().toISOString())
    .order('datetime', { ascending: true })
    .limit(20);

  // Fetch user RSVPS
  let userRsvps: string[] = [];
  if (user) {
    const { data: rsvps } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', user.id);
    
    userRsvps = rsvps?.map(r => r.event_id) || [];
  }

  const featuredEvent = events?.[0]; // Make the next soonest event "Featured"

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
      
      {/* Main Content Column */}
      <div className="flex-1 max-w-2xl">
         <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Global Events</h1>
         <p className="text-neutral-500 text-sm font-medium leading-relaxed mb-10">
            Join the community in synchronized prayer sessions. A powerful way to connect across timezones.
         </p>

         <div className="flex border-b border-neutral-100 mb-8 mt-2">
            <button className="text-[11px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-3 px-4">Upcoming</button>
            <button className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black pb-3 px-4 transition-colors">Past Sessions</button>
            <button className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black pb-3 px-4 transition-colors">My RSVPs</button>
         </div>
         
         <div className="flex flex-col gap-6">
            {!events || events.length === 0 ? (
               <div className="py-24 border border-neutral-100 rounded-xl bg-neutral-50/50 text-center">
                  <p className="text-sm font-medium text-neutral-400 mb-2">No upcoming events scheduled right now.</p>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-300">Check back later or propose a session.</p>
               </div>
            ) : (
               events.map(event => (
                  <div key={event.id} className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm shadow-neutral-100/50">
                    <EventItem 
                      event={event} 
                      userIsRsvpd={userRsvps.includes(event.id)} 
                    />
                  </div>
               ))
            )}
         </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-8">
         
         {featuredEvent && (
            <div className="bg-black text-white rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <Video className="w-12 h-12 text-white/10" />
               </div>
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Up Next
               </h3>
               <h2 className="text-xl font-bold mb-2 pr-8">{featuredEvent.title}</h2>
               <p className="text-sm text-neutral-300 mb-6 font-medium line-clamp-2">
                 {featuredEvent.description}
               </p>
               
               <button className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
                  Join Room
               </button>
            </div>
         )}

         <div className="bg-white border border-neutral-100 rounded-xl p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Timezones
            </h3>
            <p className="text-sm font-medium leading-relaxed text-black">
               All times shown are automatically converted to your local time.
            </p>
            {user && (
               <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-3">
                 <CheckCircle className="w-4 h-4 text-green-500" />
                 <span className="text-xs text-neutral-500 font-medium">Syncing to device time</span>
               </div>
            )}
         </div>

         <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-6 text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Host a session</h3>
            <p className="text-xs text-neutral-600 font-medium mb-4">Want to lead a prayer session? Submit a proposal to host.</p>
            <button className="text-xs font-bold uppercase tracking-widest border-b border-black text-black pb-0.5">
               Propose Topic
            </button>
         </div>

      </div>

    </div>
  );
}
