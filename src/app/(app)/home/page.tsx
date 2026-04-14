import { createClient } from "@/lib/supabase/server";
import { Composer } from "@/components/feed/Composer";
import { PostItem } from "@/components/feed/PostItem";

type Post = {
  id: string;
  content: string;
  type: string;
  created_at: string;
  status: string;
  profiles: {
    full_name: string;
    username: string;
  } | null;
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      type,
      created_at,
      status,
      profiles (
        full_name,
        username
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
      
      {/* Main Content Column */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tighter mb-2 uppercase">For You</h1>
        <p className="text-neutral-500 text-sm font-medium mb-12">Join the conversation. Encourage others.</p>

        <div className="mb-12 bg-neutral-50/50 rounded-xl p-6 border border-neutral-100">
           <Composer />
        </div>

        <div className="flex flex-col space-y-6">
          {!posts || posts.length === 0 ? (
            <div className="py-12 border border-neutral-100 rounded-xl text-center bg-neutral-50/50">
              <p className="text-sm font-medium text-neutral-400">The feed is quiet. Be the first to share an encouragement.</p>
            </div>
          ) : (
            (posts as Post[]).map(post => (
               <div key={post.id} className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm shadow-neutral-100/50">
                 <PostItem post={post} />
               </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-10">
         
         <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6">Verse of the day</h3>
            <p className="text-sm font-medium leading-relaxed italic text-black">&quot;For God has not given us a spirit of fear, but of power and of love and of a sound mind.&quot;</p>
            <p className="text-xs text-neutral-400 mt-2 font-bold">— 2 Timothy 1:7</p>
         </div>

         <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 px-2">Prayer Topics</h3>
            <div className="flex flex-col">
               {['Healing & Recovery', 'Spiritual Growth', 'Family & Marriage', 'Thanksgiving', 'Grief & Comfort'].map(topic => (
                 <button key={topic} className="text-sm font-medium hover:bg-neutral-50 px-3 py-2.5 rounded-lg text-left transition-colors flex items-center justify-between group">
                    <span className="text-neutral-700 group-hover:text-black">{topic}</span>
                 </button>
               ))}
            </div>
         </div>

         <div className="bg-black text-white rounded-xl p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Next Global Prayer</h3>
            <p className="font-medium text-lg mb-6 tracking-tight">Today at 8:00 PM</p>
            <button className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-neutral-200 transition-colors">
               Join Waitlist
            </button>
         </div>

         <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 px-2">Suggested Circles</h3>
            <div className="flex flex-col gap-4">
               {['Local City Prayer', 'Women in Tech', 'Early Morning Devotion'].map(topic => (
                 <div key={topic} className="text-sm border border-neutral-100 rounded-xl p-4 flex items-center justify-between">
                    <span className="font-medium text-neutral-800">{topic}</span>
                    <button className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-black">View</button>
                 </div>
               ))}
            </div>
         </div>

      </div>

    </div>
  );
}
