// app/api/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log("Callback received, code:", code ? "present" : "missing");

  if (code) {
    const cookieStore = await cookies()
    console.log("All cookies:", cookieStore.getAll().map(c => c.name));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignored if middleware handles it
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log("Exchange result:", { data, error });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Log the failure reason
  console.error("Exchange failed, redirecting to error");
  return NextResponse.redirect(`${origin}/auth-error`)
}