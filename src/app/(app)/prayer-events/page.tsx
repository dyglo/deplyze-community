import { createClient } from "@/lib/supabase/server";
import { EventItem } from "@/components/event/EventItem";

export default async function PrayerEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch upcoming events
  const { data: events, error } = await supabase
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

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-24">
         <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 uppercase">Global Events</h1>
         <p className="text-neutral-500 text-sm md:text-base font-medium max-w-md leading-relaxed">
            Join the community in synchronized prayer sessions. A powerful way to connect across timezones.
         </p>
      </div>

      <div className="flex flex-col">
         <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-8 border-b border-border pb-4">Upcoming Sessions</h3>
         
         {!events || events.length === 0 ? (
            <div className="py-24 text-center">
               <p className="text-sm font-medium text-neutral-400 mb-4">No upcoming events scheduled right now.</p>
               <p className="text-[10px] uppercase tracking-widest text-neutral-300">Check back later or propose a session.</p>
            </div>
         ) : (
            events.map(event => (
               <EventItem 
                 key={event.id} 
                 event={event} 
                 userIsRsvpd={userRsvps.includes(event.id)} 
               />
            ))
         )}
      </div>
    </div>
  );
}
