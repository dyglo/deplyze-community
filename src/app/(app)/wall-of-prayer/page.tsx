import { createClient } from "@/lib/supabase/server";
import { PrayerComposer } from "@/components/prayer/PrayerComposer";
import { PrayerItem } from "@/components/prayer/PrayerItem";

export default async function WallOfPrayerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch top 5 prayer requests
  const { data: topPinned, error: topError } = await supabase
    .from('prayer_requests')
    .select(`
      *,
      profiles ( full_name, username )
    `)
    .eq('status', 'published')
    .order('votes_count', { ascending: false })
    .limit(5);

  const topIds = topPinned?.map(p => p.id) || [];

  // Fetch recent prayer requests (excluding top 5)
  const { data: recentRequests, error: recentError } = await supabase
    .from('prayer_requests')
    .select(`
      *,
      profiles ( full_name, username )
    `)
    .eq('status', 'published')
    .not('id', 'in', `(${topIds.length ? topIds.join(',') : '00000000-0000-0000-0000-000000000000'})`)
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch user votes
  let userVotes: string[] = [];
  if (user) {
    const { data: votes } = await supabase
      .from('prayer_votes')
      .select('prayer_request_id')
      .eq('user_id', user.id);
    
    userVotes = votes?.map(v => v.prayer_request_id) || [];
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
         <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 uppercase">Wall of Prayer</h1>
            <p className="text-neutral-500 text-sm font-medium max-w-sm leading-relaxed">
               A dedicated space to lift each other up. Stand in agreement with the community. Let every need be known.
            </p>
         </div>
         <div className="w-full md:w-1/3">
             <PrayerComposer />
         </div>
      </div>

      {topPinned && topPinned.length > 0 && (
         <div className="mb-24">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-8 border-b border-border pb-4">Most Supported</h3>
             <div className="flex flex-col">
                {topPinned.map(request => (
                   <PrayerItem 
                      key={request.id} 
                      request={request} 
                      userVoted={userVotes.includes(request.id)} 
                   />
                ))}
             </div>
         </div>
      )}

      <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-8 border-b border-border pb-4">Recent Requests</h3>
          <div className="flex flex-col">
             {!recentRequests || (recentRequests.length === 0 && topPinned?.length === 0) ? (
                <div className="py-12 text-center text-sm font-medium text-neutral-400">
                   The wall is empty. Be the first to post a prayer request.
                </div>
             ) : (
                recentRequests?.map(request => (
                   <PrayerItem 
                      key={request.id} 
                      request={request} 
                      userVoted={userVotes.includes(request.id)} 
                   />
                ))
             )}
          </div>
      </div>
    </div>
  );
}
