'use client'

import { useState, useRef } from "react";
import { updateProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { Camera, Loader2 } from "lucide-react";
import Link from "next/link";

interface ProfileFormProps {
  profile: any;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsUpdating(true);
    if (avatarUrl) {
      formData.set('avatar_url', avatarUrl);
    }
    const result = await updateProfile(formData);
    if (result?.error) {
      alert(result.error);
    }
    setIsUpdating(false);
  };

  return (
    <div className="w-full">
      <form action={handleSubmit} className="space-y-16 pt-12 border-t border-neutral-100">
        <div className="flex flex-col md:flex-row items-start gap-12">
            {/* Avatar Section */}
            <div className="relative group shrink-0">
               <div className="w-32 h-32 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold uppercase text-neutral-300">
                      {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                    </span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                       <Loader2 className="w-6 h-6 animate-spin text-black" />
                    </div>
                  )}
               </div>
               <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full hover:opacity-80 transition-all shadow-lg"
                  title="Change Avatar"
               >
                  <Camera className="w-4 h-4" />
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
               />
            </div>

            <div className="flex-grow space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Full Name</label>
                    <input 
                      name="full_name" 
                      defaultValue={profile.full_name} 
                      required 
                      placeholder="Your Name"
                      className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Username</label>
                    <input 
                      name="username" 
                      defaultValue={profile.username} 
                      required 
                      placeholder="username"
                      className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Country</label>
                    <input name="country" defaultValue={profile.country} className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">City</label>
                    <input name="city" defaultValue={profile.city} className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Timezone</label>
                    <input name="timezone" defaultValue={profile.timezone} className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Language</label>
                    <select name="language" defaultValue={profile.language} className="w-full bg-transparent border-b border-neutral-200 py-3 text-sm focus:outline-none focus:border-black appearance-none transition-colors">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Bio</label>
                  <textarea 
                    name="bio" 
                    defaultValue={profile.bio} 
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-transparent border border-neutral-100 p-4 text-sm focus:outline-none focus:border-black transition-colors resize-none" 
                  />
               </div>

               <div className="flex items-start space-x-3 pt-4">
                  <input 
                    type="checkbox" 
                    name="open_to_local_meetups"
                    id="meetups-profile" 
                    defaultChecked={profile.open_to_local_meetups}
                    className="mt-1 w-4 h-4 rounded-none border-neutral-300 text-black focus:ring-transparent accent-black"
                  />
                  <label htmlFor="meetups-profile" className="text-xs text-neutral-500 leading-relaxed">
                    I'm open to local meetups and physical prayer circles in my city.
                  </label>
               </div>
            </div>
        </div>

        <button 
          type="submit" 
          disabled={isUpdating || isUploading}
          className="bg-black text-white px-12 py-5 text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile Changes"}
        </button>
      </form>
    </div>
  );
}
