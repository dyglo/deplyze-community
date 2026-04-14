import { createClient } from "@/lib/supabase/server";
import { MapPin, Shield } from "lucide-react";

interface Profile {
  full_name?: string;
  username?: string;
  city?: string;
  country?: string;
  prayer_interests?: string[];
}

export default async function LocalCommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get current user's city/country
  let currentUserLocation = { city: "Unknown", country: "Unknown" };
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('city, country')
      .eq('id', user.id)
      .single();
    if (profile) {
      currentUserLocation = { city: profile.city || "Unknown", country: profile.country || "Unknown" };
    }
  }

  // Fetch all users open to local meetups
  const { data: profiles } = await supabase
    .from('profiles')
    .select('full_name, username, city, country, prayer_interests')
    .eq('open_to_local_meetups', true)
    .order('country', { ascending: true })
    .order('city', { ascending: true });

  // Group by country and city
  const grouped: Record<string, Record<string, Profile[]>> = {};
  
  if (profiles) {
    for (const p of profiles) {
      const country = p.country || 'Unknown';
      const city = p.city || 'Unknown';
      if (!grouped[country]) grouped[country] = {};
      if (!grouped[country][city]) grouped[country][city] = [];
      grouped[country][city].push(p);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
      
      {/* Main Content Column */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Local Hub</h1>
        <p className="text-neutral-500 text-sm font-medium mb-10 leading-relaxed">
           Find brothers and sisters nearby. Form physical prayer circles.
        </p>

        <div className="flex border-b border-neutral-100 mb-8">
           <button className="text-[11px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-3 px-4">Nearby Believers</button>
           <button className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black pb-3 px-4 transition-colors">Active Circles</button>
        </div>

        <div className="space-y-12">
           {Object.keys(grouped).length === 0 ? (
              <div className="py-24 border border-neutral-100 rounded-xl text-center bg-neutral-50/50">
                 <p className="text-sm font-medium text-neutral-400">No one has opted into local meetups yet.</p>
              </div>
           ) : (
              Object.keys(grouped).map(country => (
                 <div key={country} className="space-y-8">
                    <h2 className="text-2xl font-bold tracking-tight">{country}</h2>
                    
                    <div className="flex flex-col gap-8">
                       {Object.keys(grouped[country]).map(city => {
                          const isNearMe = currentUserLocation.city === city && currentUserLocation.country === country;
                          return (
                             <div key={city} className="flex flex-col">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-3 text-neutral-500">
                                   {city}
                                   {isNearMe && <span className="bg-black text-white px-2 py-0.5 rounded-sm">Near You</span>}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {grouped[country][city].map((p, idx) => (
                                      <div key={idx} className="flex flex-col gap-3 p-5 border border-neutral-100 rounded-xl bg-white shadow-sm shadow-neutral-100/50">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
                                              <span className="text-xs font-bold uppercase text-neutral-500">
                                                {p.full_name?.charAt(0) || p.username?.charAt(0) || "U"}
                                              </span>
                                            </div>
                                            <span className="font-bold text-sm">{p.full_name || p.username}</span>
                                         </div>
                                         
                                         {p.prayer_interests && p.prayer_interests.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                               {p.prayer_interests.map((interest: string) => (
                                                  <span key={interest} className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-1 rounded-md">
                                                     {interest}
                                                  </span>
                                               ))}
                                            </div>
                                         )}
                                      </div>
                                   ))}
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              ))
           )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-8">
         
         {/* Location Card */}
         <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Your Location
            </h3>
            <p className="font-bold text-lg text-black">{currentUserLocation.city}</p>
            <p className="text-sm text-neutral-500 font-medium mb-6">{currentUserLocation.country}</p>
            <button className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
               Update in Profile &rarr;
            </button>
         </div>

         {/* Filters */}
         <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 px-2">Local Interests</h3>
            <div className="flex flex-col gap-2">
               {['Coffee & Prayer', 'Bible Study', 'Church Plant', 'Outdoor Walks'].map(topic => (
                 <label key={topic} className="flex items-center gap-3 p-3 border border-transparent hover:border-neutral-100 rounded-lg cursor-pointer transition-colors hover:bg-neutral-50">
                    <input type="checkbox" className="rounded-sm border-neutral-300 text-black focus:ring-black accent-black" />
                    <span className="text-sm font-medium text-neutral-700">{topic}</span>
                 </label>
               ))}
            </div>
         </div>

         {/* Call to Action */}
         <div className="bg-black text-white rounded-xl p-6 relative overflow-hidden">
            <Shield className="w-24 h-24 absolute -right-4 -bottom-4 text-white/5" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 relative z-10">Safe Space</h3>
            <p className="text-sm font-medium leading-relaxed text-neutral-200 mb-6 relative z-10">
               We only show shared cities to protect your exact location. Always meet in public places.
            </p>
         </div>

      </div>

    </div>
  );
}
