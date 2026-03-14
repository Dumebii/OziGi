import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    
    // 1. Initialize standard client to verify who is making the request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          // Properly typed and executed cookie setter to satisfy TypeScript
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // The `setAll` method was called from a Read-Only context.
              // This can be safely ignored in a Route Handler.
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // SECURITY GATE: Prevent unauthenticated execution
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Initialize the Admin Client to bypass RLS and delete the auth record
    // This requires the private Service Role Key!
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 3. Execute the deletion on the core auth table
    // Because of our "Cascade" settings, this single command instantly wipes 
    // their profiles, campaigns, personas, and tokens.
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true, message: "Account permanently deleted." });

  } catch (error: any) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}