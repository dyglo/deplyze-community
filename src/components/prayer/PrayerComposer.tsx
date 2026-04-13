'use client'

import { useRef, useState } from "react";
import { createPrayerRequest } from "@/app/actions/prayer";
import { Plus } from "lucide-react";

export function PrayerComposer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  async function handleAction(formData: FormData) {
    setError(null);
    const result = await createPrayerRequest(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      formRef.current?.reset();
      setIsComposing(false);
    }
  }

  if (!isComposing) {
    return (
       <button 
         onClick={() => setIsComposing(true)}
         className="w-full py-8 border border-neutral-200 border-dashed text-neutral-400 flex items-center justify-center gap-2 hover:border-black hover:text-black transition-colors text-xs font-bold uppercase tracking-widest group"
       >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Post a Prayer Request
       </button>
    )
  }

  return (
    <div className="border border-neutral-200 p-8">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">New Prayer Request</h4>
        <button onClick={() => setIsComposing(false)} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black">Cancel</button>
      </div>

      <form ref={formRef} action={handleAction} className="flex flex-col gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Title</label>
          <input 
            name="title"
            placeholder="What is the core of your request?"
            className="w-full bg-transparent border-b border-neutral-200 py-3 text-lg font-light focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Details (Optional)</label>
          <textarea 
            name="description"
            placeholder="Share more context..."
            className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black resize-none transition-colors placeholder:text-neutral-300"
            rows={3}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <select 
            name="category" 
            className="bg-transparent border-b border-neutral-200 text-xs font-semibold py-2 focus:outline-none focus:border-black appearance-none cursor-pointer hover:opacity-70 transition-colors uppercase tracking-wider"
          >
            <option value="Healing">Healing</option>
            <option value="Family">Family</option>
            <option value="Finances">Finances</option>
            <option value="Guidance">Guidance</option>
            <option value="Missions">Missions</option>
            <option value="Other">Other</option>
          </select>
          
          <button 
            type="submit"
            className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Post Request
          </button>
        </div>
        
        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
      </form>
    </div>
  )
}
