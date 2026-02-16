import { createBrowserClient } from '@supabase/ssr'

// just a quick function to get the supabase connection
export const getSb = () => 
  createBrowserClient(
    process.env.NEXT_PUBLIC_URL!,
    process.env.NEXT_PUBLIC_KEY!
  )