'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  interface ProfileUpdate {
    full_name?: string;
    username?: string;
    country?: string;
    city?: string;
    timezone?: string;
    language?: string;
    bio?: string;
    open_to_local_meetups?: boolean;
    updated_at: string;
    onboarding_completed?: boolean;
    avatar_url?: string;
    prayer_interests?: string[];
  }

  const profileData: ProfileUpdate = {
    full_name: formData.get('full_name') as string,
    username: formData.get('username') as string,
    country: formData.get('country') as string,
    city: formData.get('city') as string,
    timezone: formData.get('timezone') as string,
    language: formData.get('language') as string,
    bio: formData.get('bio') as string,
    open_to_local_meetups: formData.get('open_to_local_meetups') === 'on',
    updated_at: new Date().toISOString()
  }

  const onboardingCompleted = formData.get('onboarding_completed')
  if (onboardingCompleted !== null) {
     profileData.onboarding_completed = onboardingCompleted === 'true'
  }

  const avatarUrl = formData.get('avatar_url') as string
  if (avatarUrl) {
    profileData.avatar_url = avatarUrl
  }

  const prayerInterestsStr = formData.get('prayer_interests') as string
  if (prayerInterestsStr) {
    profileData.prayer_interests = JSON.parse(prayerInterestsStr)
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') {
       return { error: "Username already taken." }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function completeOnboarding(formData: FormData) {
  // Onboarding is effectively a profile update that also sets the completed flag
  formData.append('onboarding_completed', 'true')
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Reuse update logic but ensure flag is set
  const { error } = await supabase
    .from('profiles')
    .update({ 
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    
  if (error) return { error: error.message }

  return updateProfile(formData)
}
