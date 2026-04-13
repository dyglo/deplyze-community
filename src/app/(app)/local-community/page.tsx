import { createClient } from "@/lib/supabase/server";

export default async function LocalCommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get current user's city/country to highlight "People near you"
  let currentUserLocation = { city: "", country: "" };
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('city, country')
      .eq('id', user.id)
      .single();
    if (profile) {
      currentUserLocation = { city: profile.city || "", country: profile.country || "" };
    }
  }

  // Fetch all users open to local meetups
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('full_name, username, city, country, prayer_interests')
    .eq('open_to_local_meetups', true)
    // Basic privacy restriction: We only select name and city/country, never exact location data.
    .order('country', { ascending: true })
    .order('city', { ascending: true });

  if (error) {
    console.error("Error fetching local community:", error);
  }

  // Group by country and city
  const grouped: Record<string, Record<string, any[]>> = {};
  
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
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
         <div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 uppercase">Local Hub</h1>
            <p className="text-neutral-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
               Find brothers and sisters nearby. Form physical prayer circles. Remember, only shared cities are shown to protect your exact location.
            </p>
         </div>
         {currentUserLocation.city && (
            <div className="text-right">
               <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-2">Your Location</span>
               <span className="text-sm font-medium border-b border-neutral-300 pb-1">{currentUserLocation.city}, {currentUserLocation.country}</span>
            </div>
         )}
      </div>

      <div className="space-y-24">
         {Object.keys(grouped).length === 0 ? (
            <div className="py-24 text-center">
               <p className="text-sm font-medium text-neutral-400">No one has opted into local meetups yet.</p>
            </div>
         ) : (
            Object.keys(grouped).map(country => (
               <div key={country} className="space-y-12">
                  <h2 className="text-4xl font-light tracking-tight">{country}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                     {Object.keys(grouped[country]).map(city => {
                        const isNearMe = currentUserLocation.city === city && currentUserLocation.country === country;
                        return (
                           <div key={city} className="flex flex-col">
                              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                 {city}
                                 {isNearMe && <span className="text-[8px] bg-black text-white px-2 py-0.5">Near You</span>}
                              </h3>
                              
                              <ul className="space-y-6">
                                 {grouped[country][city].map((p, idx) => (
                                    <li key={idx} className="flex flex-col gap-2 pb-6 border-b border-neutral-100 last:border-0">
                                       <span className="font-medium text-base">{p.full_name || p.username}</span>
                                       
                                       {p.prayer_interests && p.prayer_interests.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-1">
                                             {p.prayer_interests.map((interest: string) => (
                                                <span key={interest} className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 border border-neutral-200 px-2 py-1">
                                                   {interest}
                                                </span>
                                             ))}
                                          </div>
                                       )}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        );
                     })}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
