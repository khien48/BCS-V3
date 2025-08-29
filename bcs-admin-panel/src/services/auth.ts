import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { Subscription } from '@supabase/supabase-js';

export async function signUp(credentials: {
  email: string;
  password: string;
  profile: Omit<Profile, 'id' | 'status' | 'last_login' | 'created_at' | 'updated_at'>;
}) {
  const { email, password, profile } = credentials;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: profile.first_name,
        middle_name: profile.middle_name,
        last_name: profile.last_name,
        suffix: profile.suffix,
        username: profile.username,
        contact_number: profile.contact_number,
        role: profile.role,
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  
  if (!session?.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) throw profileError;
  return { user: session.user, profile };
}

export function setupAuthListener(callback: (profile: Profile | null) => void) {
  // Get the subscription object from onAuthStateChange
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      callback(profile || null);
    } else {
      callback(null);
    }
  });
  
  // Return the subscription so it can be unsubscribed later
  return { subscription: data.subscription };
}

export async function createSampleUsers() {
  const sampleUsers = [
    {
      email: 'sarah.cashier@bcs.com',
      password: 'Cashier123!',
      profile: {
        first_name: 'Sarah',
        last_name: 'Garcia',
        username: 'sarah.cashier',
        contact_number: '09123456789',
        role: 'cashier'
      }
    },
    {
      email: 'john.terminal@bcs.com',
      password: 'Terminal123!',
      profile: {
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Cruz',
        suffix: 'Jr',
        username: 'john.terminal',
        contact_number: '09187654321',
        role: 'terminal_staff'
      }
    },
    {
      email: 'maria.admin@bcs.com',
      password: 'Admin123!',
      profile: {
        first_name: 'Maria',
        middle_name: 'S',
        last_name: 'Santos',
        username: 'maria.admin',
        contact_number: '09198765432',
        role: 'admin'
      }
    }
  ];

  for (const user of sampleUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            first_name: user.profile.first_name,
            middle_name: user.profile.middle_name,
            last_name: user.profile.last_name,
            suffix: user.profile.suffix,
            username: user.profile.username,
            contact_number: user.profile.contact_number,
            role: user.profile.role
          }
        }
      });

      if (error) {
        console.error('Error creating user:', error);
      }
    } catch (err) {
      console.error('Unexpected error creating user:', err);
    }
  }
}
