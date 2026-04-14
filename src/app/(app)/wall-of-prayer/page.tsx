import { createClient } from "@/lib/supabase/server";
import { PrayerComposer } from "@/components/prayer/PrayerComposer";
import { PrayerItem } from "@/components/prayer/PrayerItem";

export default async function WallOfPrayerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch top 5 prayer requests
  const { data: topPinned } = await supabase
    .from('prayer_requests')
    .select(`
      *,
      profiles ( full_name, username )
    `)
    .eq('status', 'published')
    .order('votes_count', { ascending: false })
    .limit(5);

  const topIds = topPinned?.map(p => p.id) || [];

  // Fetch recent prayer requests
  const { data: recentRequests } = await supabase
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
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
      
      {/* Main Content Column */}
      <div className="flex-1 max-w-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div>
              <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">Wall of Prayer</h1>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                 A dedicated space to lift each other up. Let every need be known.
              </p>
           </div>
        </div>

        <div className="mb-10 p-6 bg-neutral-50/50 rounded-xl border border-neutral-100 flex flex-col gap-6">
           <div>
              <h3 className="text-sm font-bold text-black mb-1">Stand in Agreement</h3>
              <p className="text-xs text-neutral-500 font-medium">Share your burden with the community.</p>
           </div>
           <div className="w-full">
               <PrayerComposer />
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100 mb-8 mt-2">
           <button className="text-[11px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-3 px-4">Recent</button>
           <button className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black pb-3 px-4 transition-colors">Top Requests</button>
           <button className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black pb-3 px-4 transition-colors">Answered</button>
        </div>

        <div className="flex flex-col space-y-6">
           {!recentRequests || (recentRequests.length === 0 && topPinned?.length === 0) ? (
              <div className="py-12 border border-neutral-100 rounded-xl text-center bg-neutral-50/50">
                 <p className="text-sm font-medium text-neutral-400">The wall is empty. Be the first to post a request.</p>
              </div>
           ) : (
              recentRequests?.map(request => (
                 <div key={request.id} className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm shadow-neutral-100/50">
                    <PrayerItem 
                       request={request} 
                       userVoted={userVotes.includes(request.id)} 
                    />
                 </div>
              ))
           )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-10">
         
         {topPinned && topPinned.length > 0 && (
           <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 px-2">Focus Prayers</h3>
              <div className="flex flex-col gap-3">
                 {topPinned.map(request => (
                    <div key={request.id} className="border border-neutral-100 rounded-xl p-4 hover:border-neutral-200 transition-colors bg-neutral-50/50">
                       <h4 className="font-bold text-sm line-clamp-1 mb-1">{request.title}</h4>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                         {request.votes_count} Praying
                       </span>
                    </div>
                 ))}
              </div>
           </div>
         )}

         <div className="bg-black text-white rounded-xl p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Prayer Theme</h3>
            <p className="font-bold text-xl mb-2 tracking-tight">Strength in Adversity</p>
            <p className="text-sm text-neutral-300 leading-relaxed font-medium">This week we are focusing our prayers on those facing sudden hardship and loss.</p>
         </div>

         <div className="border border-neutral-100 rounded-xl p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Answered Prayer</h3>
            <p className="font-medium text-sm leading-relaxed mb-4 text-black">&quot;After 8 months of searching, my husband finally got a job offer! Praise God for his provision.&quot;</p>
            <p className="text-xs text-neutral-400 font-bold">— Anonymous</p>
         </div>

      </div>

    </div>
  );
}
