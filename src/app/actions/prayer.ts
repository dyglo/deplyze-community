'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPrayerRequest(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  if (!title || title.trim().length === 0) {
    return { error: "Title cannot be empty" }
  }

  const { error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      category: category || 'General',
      status: 'published'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/wall-of-prayer')
  
  return { success: true }
}

export async function togglePrayerVote(prayerRequestId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Check if they already voted
  const { data: existingVote } = await supabase
    .from('prayer_votes')
    .select('id')
    .eq('user_id', user.id)
    .eq('prayer_request_id', prayerRequestId)
    .single()

  if (existingVote) {
    // Unlike / Remove vote
    await supabase.from('prayer_votes').delete().eq('id', existingVote.id)
  } else {
    // Like / Add vote
    await supabase.from('prayer_votes').insert({
      user_id: user.id,
      prayer_request_id: prayerRequestId
    })
  }

  revalidatePath('/wall-of-prayer')
  return { success: true }
}
