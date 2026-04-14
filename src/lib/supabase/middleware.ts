import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-request state pollution.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/signup') || 
                      pathname.startsWith('/admin/login') || 
                      pathname.startsWith('/admin/signup')
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.includes('/login') && !pathname.includes('/signup')

  // If there is no user and the route is not an auth route or public route
  if (
    !user &&
    !isAuthRoute &&
    pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = isAdminRoute ? '/admin/login' : '/login'
    return NextResponse.redirect(url)
  }

  // Fetch profile if user exists
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('username, role, onboarding_completed').eq('id', user.id).single()
    profile = data
  }

  // Admin route protection
  if (user && isAdminRoute) {
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/home' // Redirect non-admins to user home
      return NextResponse.redirect(url)
    }
  }

  // Onboarding flow protection
  const isOnboardingRoute = pathname.startsWith('/onboarding')
  
  if (user && profile && !profile.onboarding_completed && !isOnboardingRoute && pathname !== '/' && !isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  // Redirect completed users away from onboarding
  if (user && profile?.onboarding_completed && isOnboardingRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = profile?.role === 'admin' ? '/admin/dashboard' : '/home'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
