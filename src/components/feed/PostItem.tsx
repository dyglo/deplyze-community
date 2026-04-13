import { formatDistanceToNow } from "date-fns";
import { Flag, Bookmark, Heart } from "lucide-react";

type PostProps = {
  post: {
    id: string;
    content: string;
    type: string;
    created_at: string;
    profiles: {
      full_name: string;
      username: string;
    } | null;
  }
}

export function PostItem({ post }: PostProps) {
  const authorName = post.profiles?.full_name || post.profiles?.username || "Anonymous";
  
  return (
    <article className="py-16 border-b border-neutral-100 last:border-0 group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
           <span>{authorName}</span>
           <span className="text-neutral-200">&bull;</span>
           <span>{post.type}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-neutral-300">
           {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </span>
      </div>

      <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed font-light tracking-tight text-black mb-12">
        {post.content}
      </p>

      <div className="flex items-center space-x-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
          <Heart className="w-4 h-4 mr-2" /> Amen
        </button>
        <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">
          <Bookmark className="w-4 h-4 mr-2" /> Save
        </button>
        <button className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors ml-auto">
          <Flag className="w-4 h-4 mr-2" /> Report
        </button>
      </div>
    </article>
  )
}
