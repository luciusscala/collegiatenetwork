import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getAuthenticatedUser() {
  const supabase = await createAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return user;
}

export async function ensureUserProfile(userId: string, userData?: any) {
  try {
    const supabase = await createAuthClient();
    
    // Check if user exists in our custom users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    // If user doesn't exist, create them
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          id: userId,
          name: userData?.name || "Unknown",
          school: userData?.school || "Unknown",
          position: userData?.position || "Unknown",
        });

      if (insertError) {
        console.error("Error creating user profile:", insertError);
      }
    }
  } catch (err) {
    console.error("Error ensuring user profile:", err);
  }
}

export async function getUserData(userId: string) {
  try {
    const supabase = await createAuthClient();
    const { data, error } = await supabase
      .from("users")
      .select("name, school, position")
      .eq("id", userId)
      .single();
      
    if (error) {
      // If user doesn't exist in users table, try to create it first
      if (error.code === 'PGRST116') {
        console.warn(`User ${userId} not found in users table, attempting to create profile`);
        await ensureUserProfile(userId);
        
        // Try to fetch again after creating
        const { data: retryData, error: retryError } = await supabase
          .from("users")
          .select("name, school, position")
          .eq("id", userId)
          .single();
          
        if (retryError) {
          return { name: null, school: null, position: null };
        }
        return retryData;
      }
      console.error("Error fetching user data:", error.message || error);
      return { name: null, school: null, position: null };
    }
    
    return data;
  } catch (err) {
    console.error("Unexpected error in getUserData:", err);
    return { name: null, school: null, position: null };
  }
}