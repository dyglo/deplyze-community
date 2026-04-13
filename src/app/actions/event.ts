'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleEventRsvp(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  // Check if they already RSVP'd
  const { data: existingParticipant } = await supabase
    .from('event_participants')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .single()

  if (existingParticipant) {
    // Remove RSVP
    await supabase.from('event_participants').delete().eq('id', existingParticipant.id)
  } else {
    // Add RSVP
    await supabase.from('event_participants').insert({
      user_id: user.id,
      event_id: eventId
    })
  }

  revalidatePath('/prayer-events')
  return { success: true }
}
