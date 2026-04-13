'use client'

import { useRef, useState } from "react";
import { createPost } from "@/app/actions/post";
import { Send } from "lucide-react";

export function Composer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null);
    setSuccessMsg(null);
    
    const result = await createPost(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      formRef.current?.reset();
      if (result.flagged) {
         setSuccessMsg("Your post has been submitted and is pending review.");
      } else {
         setSuccessMsg("Posted successfully.");
         setTimeout(() => setSuccessMsg(null), 3000);
      }
    }
  }

  return (
    <div className="mb-20">
      <form ref={formRef} action={handleAction} className="flex flex-col">
        <textarea 
          name="content"
          placeholder="Share a testimony, encouragement, or scripture..."
          className="w-full bg-transparent border-0 border-b border-neutral-200 py-4 text-xl sm:text-2xl font-light placeholder:text-neutral-300 focus:outline-none focus:ring-0 focus:border-black resize-none transition-colors"
          rows={3}
          required
        />
        
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Post Type</span>
            <select 
              name="type" 
              className="bg-transparent text-xs font-semibold py-1 focus:outline-none appearance-none cursor-pointer hover:opacity-70 transition-opacity uppercase tracking-wider"
            >
              <option value="encouragement">Encouragement</option>
              <option value="testimony">Testimony</option>
              <option value="scripture">Scripture</option>
            </select>
          </div>
          
          <button 
            type="submit"
            className="flex items-center text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
          >
            Publish <Send className="w-3 h-3 ml-2" />
          </button>
        </div>
        
        {error && <p className="text-red-500 text-xs font-bold mt-4">{error}</p>}
        {successMsg && <p className="text-neutral-500 text-xs font-bold mt-4">{successMsg}</p>}
      </form>
    </div>
  )
}
