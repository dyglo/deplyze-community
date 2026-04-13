'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const content = formData.get('content') as string
  const type = formData.get('type') as string

  if (!content || content.trim().length === 0) {
    return { error: "Post cannot be empty" }
  }

  // Basic moderation (V1 PRD requirement)
  const forbiddenWords = ['hate', 'spam', 'profanity_mock', 'porn']; // Minimal mockup
  const hasBadWords = forbiddenWords.some(word => content.toLowerCase().includes(word));
  
  const status = hasBadWords ? 'flagged' : 'published';

  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: content.trim(),
      type: type || 'encouragement',
      status: status
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/home')
  
  return { success: true, flagged: hasBadWords }
}
