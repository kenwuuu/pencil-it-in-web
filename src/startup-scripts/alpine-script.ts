import Alpine from 'alpinejs';
import { supabase } from '@/supabase-client/supabase-client.js';

// Ensure Alpine is available globally
(window as any).Alpine = Alpine;

// Define Alpine store types
type ProfilePhotoStore = {
  url: string;
  set: (newUrl: string) => void;
};

type UserIdStore = string | null;

// Initialize Alpine global state
Alpine.store('profile_photo', {
  url: '',
  set(newUrl: string) {
    this.url = newUrl;
  },
} as ProfilePhotoStore);

// hacky way around "Top level await not available"
(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Failed to fetch user', error);
    Alpine.store('userId', null);
    return;
  }

  Alpine.store('userId', user.id as UserIdStore);
})();

Alpine.start();
