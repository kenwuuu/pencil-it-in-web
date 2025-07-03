import { supabase } from '@/supabase-client/supabase-client.ts';

// For the root page (index.html), redirect users based on their auth status.
export function handleRootRedirect() {
  supabase.auth.getSession().then(({ data }) => {
    const token = data?.session?.access_token;
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (token) {
      window.location.href = '/events.html';
    } else if (isMobile) {
      window.location.href = '/src/auth/create-account.html';
    } else {
      window.location.href = '/src/auth/login.html';
    }
  });
}

// For protected pages, redirect users to login if they are not authenticated.
export function protectPage() {
  supabase.auth.getSession().then(({ data }) => {
    const token = !data?.session?.access_token;
    console.log('token', token);
    if (token) {
      window.location.href = '/src/auth/login.html';
    }
  });
}
