'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function moderatePost(postId: string, action: 'approve' | 'hide') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const status = action === 'approve' ? 'published' : 'hidden'

  const { error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function moderatePrayerRequest(requestId: string, action: 'approve' | 'hide') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const status = action === 'approve' ? 'published' : 'hidden'

  const { error } = await supabase
    .from('prayer_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/dashboard')
  return { success: true }
}
