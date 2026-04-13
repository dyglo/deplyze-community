import { createClient } from "@/lib/supabase/server";
import { Composer } from "@/components/feed/Composer";
import { PostItem } from "@/components/feed/PostItem";

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
    <div className="w-full max-w-3xl mx-auto px-6 py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">For You</h1>
      <p className="text-neutral-500 text-sm font-medium mb-24">A quiet space for reflections and encouragement.</p>

      <Composer />

      <div className="flex flex-col">
        {!posts || posts.length === 0 ? (
          <div className="py-12 border-t border-neutral-100 text-center">
            <p className="text-sm font-medium text-neutral-400">The feed is quiet. Be the first to share an encouragement.</p>
          </div>
        ) : (
          posts.map(post => (
             <PostItem key={post.id} post={post as any} />
          ))
        )}
      </div>
    </div>
  );
}
