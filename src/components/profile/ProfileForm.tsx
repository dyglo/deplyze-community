'use client'

import { useState, useRef } from "react";
import { updateProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { Camera, Loader2, Save, User, Globe, Shield } from "lucide-react";

interface Profile {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
  open_to_local_meetups?: boolean;
}

interface ProfileFormProps {
  profile: Profile;
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

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

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
    <form action={handleSubmit} className="w-full flex justify-center">
      
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Profile Summary Block */}
        <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
           <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center relative shadow-inner">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt={profile.full_name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-xl font-bold uppercase text-neutral-300">
                     {profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                   </span>
                 )}
                 {isUploading && (
                   <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                   </div>
                 )}
              </div>
              <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className="absolute -bottom-2 -right-2 p-2 bg-black text-white rounded-full hover:opacity-80 transition-all shadow-md"
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
           
           <div className="flex-1 text-center md:text-left space-y-1">
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <p className="text-sm font-medium text-neutral-500">@{profile.username}</p>
              
              <div className="pt-3">
                 <textarea 
                   name="bio" 
                   defaultValue={profile.bio} 
                   rows={2}
                   placeholder="Write a short summary about yourself..."
                   className="w-full bg-neutral-50/50 border border-neutral-100 p-3 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-neutral-300 transition-colors resize-none" 
                 />
              </div>
           </div>
        </div>

        {/* Editable Info Block */}
        <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
           <div className="bg-neutral-50/50 border-b border-neutral-100 px-8 py-5 flex items-center gap-3">
              <User className="w-4 h-4 text-neutral-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Personal Information</h3>
           </div>
           
           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
                <input 
                  name="full_name" 
                  defaultValue={profile.full_name} 
                  required 
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Username</label>
                <input 
                  name="username" 
                  defaultValue={profile.username} 
                  required 
                  className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors" 
                />
              </div>
           </div>
        </div>

        {/* Location & Localization Block */}
        <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
           <div className="bg-neutral-50/50 border-b border-neutral-100 px-8 py-5 flex items-center gap-3">
              <Globe className="w-4 h-4 text-neutral-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Location & Language</h3>
           </div>
           
           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Country</label>
                <input name="country" defaultValue={profile.country} className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">City</label>
                <input name="city" defaultValue={profile.city} className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Timezone</label>
                <input name="timezone" defaultValue={profile.timezone} className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Language</label>
                <select name="language" defaultValue={profile.language} className="w-full bg-transparent border-b border-neutral-200 py-2.5 text-sm font-medium focus:outline-none focus:border-black appearance-none transition-colors">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                </select>
              </div>
           </div>
        </div>

        {/* Community Preferences Block */}
        <div className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden">
           <div className="bg-neutral-50/50 border-b border-neutral-100 px-8 py-5 flex items-center gap-3">
              <Shield className="w-4 h-4 text-neutral-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Community Privacy</h3>
           </div>
           
           <div className="p-8">
              <div className="flex bg-neutral-50/50 p-4 border border-neutral-100 rounded-lg items-start gap-4 cursor-pointer hover:border-neutral-200 transition-colors">
                 <input 
                   type="checkbox" 
                   name="open_to_local_meetups"
                   id="meetups-profile" 
                   defaultChecked={profile.open_to_local_meetups}
                   className="mt-1 w-4 h-4 rounded-sm border-neutral-300 text-black focus:ring-black accent-black"
                 />
                 <div className="flex flex-col">
                    <label htmlFor="meetups-profile" className="text-sm font-bold text-black cursor-pointer">
                      Open to Local Circles
                    </label>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">
                       Enabling this will allow other users in your exact city to see your profile in the Local Hub.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-4 flex justify-end">
           <button 
             type="submit" 
             disabled={isUpdating || isUploading}
             className="bg-black text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-black/10"
           >
             {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {isUpdating ? "Saving..." : "Save Changes"}
           </button>
        </div>

      </div>
    </form>
  );
}
