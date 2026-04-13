'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/home'

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // If logging into admin, verify they are actually an admin
  if (redirectTo.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      return { error: "Access denied. You are not an admin." }
    }
  }

  redirect(redirectTo)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  // Terms acceptance REQUIRED before onboarding
  if (!formData.get('terms')) {
      return { error: "You must accept the terms and conditions." }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/onboarding')
}

export async function adminSignup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!username) {
    return { error: "Username is required for admin accounts." }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        role: 'admin'
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/admin/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
