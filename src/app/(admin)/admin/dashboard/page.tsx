import { createClient } from "@/lib/supabase/server";
import { moderatePost } from "@/app/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Double check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return <div className="p-24 text-center">Unauthorized. You must be an admin.</div>;
  }

  interface Post {
    id: string;
    content: string;
    type: string;
    status: string;
    profiles: { username: string } | null;
  }

  // Fetch flagged posts
  const { data: flaggedData } = await supabase
    .from('posts')
    .select('id, content, type, status, profiles(username)')
    .eq('status', 'flagged');
  const flaggedPosts = flaggedData as Post[] | null;

  // Fetch all other posts for general moderation
  const { data: recentData } = await supabase
    .from('posts')
    .select('id, content, type, status, profiles(username)')
    .neq('status', 'flagged')
    .order('created_at', { ascending: false })
    .limit(20);
  const recentPosts = recentData as Post[] | null;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Admin Dashboard</h1>
      <p className="text-neutral-500 text-sm font-medium mb-16">Monitor and moderate community content.</p>

      <section className="mb-24">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-border pb-4 text-red-500">Flagged Posts (Requires Action)</h2>
        {flaggedPosts?.length === 0 ? (
           <p className="text-sm text-neutral-400">No flagged posts.</p>
        ) : (
           <div className="space-y-6">
              {flaggedPosts?.map((post) => (
                 <div key={post.id} className="p-6 border border-red-200 bg-red-50/50 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                       <span>{post.profiles?.username || 'Anonymous'}</span>
                       <span className="text-red-500">Flagged</span>
                    </div>
                    <p className="text-sm">{post.content}</p>
                    <div className="flex gap-4 pt-4 border-t border-red-100">
                       <form action={async () => { 'use server'; await moderatePost(post.id, 'approve'); }}>
                          <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-green-600 hover:opacity-70">Approve</button>
                       </form>
                       <form action={async () => { 'use server'; await moderatePost(post.id, 'hide'); }}>
                          <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:opacity-70">Hide / Remove</button>
                       </form>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">Recent Posts</h2>
        <div className="space-y-6">
            {recentPosts?.map((post) => (
               <div key={post.id} className="p-6 border border-neutral-100 flex flex-col gap-4 group">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                     <span>{post.profiles?.username || 'Anonymous'}</span>
                     <span>{post.status}</span>
                  </div>
                  <p className="text-sm text-neutral-800">{post.content}</p>
                  <div className="flex gap-4 pt-4 border-t border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity">
                     <form action={async () => { 'use server'; await moderatePost(post.id, post.status === 'hidden' ? 'approve' : 'hide'); }}>
                        <button type="submit" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black">
                           {post.status === 'hidden' ? 'Restore' : 'Hide'}
                        </button>
                     </form>
                  </div>
               </div>
            ))}
        </div>
      </section>
    </div>
  );
}
