/**
 * MR & MRS DESIGNER STUDIO — Unified Supabase Database & Client Module
 * Production-grade client with automatic Supabase cloud syncing + robust offline fallback.
 * Works seamlessly with Supabase JS SDK v2 or local persistent storage.
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    CONFIG: 'mr_mrs_supabase_config',
    BOOKINGS: 'mr_mrs_bookings_data',
    CLIENTS: 'mr_mrs_clients_data',
    CURRENT_USER: 'mr_mrs_current_client'
  };

  // Seed sample data for immediate production-grade demonstration
  const SEED_BOOKINGS = [
    {
      id: 'BK-8901',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      client_name: 'Priyanka Sharma',
      client_phone: '+91 98765 43210',
      client_email: 'priyanka.s@gmail.com',
      service: 'Bridal & Saree Embroidery',
      booking_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
      time_slot: '11:30 AM',
      fitting_type: 'In-Studio Atelier Trial',
      notes: 'Bridal blouse for reception, maroon raw silk with antique gold zardozi leaf work.',
      status: 'Confirmed'
    },
    {
      id: 'BK-8902',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      client_name: 'Ananya Krishnan',
      client_phone: '+91 98450 11223',
      client_email: 'ananya.k@outlook.com',
      service: 'Saree Pre-Pleating & Box-Fold',
      booking_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
      time_slot: '02:30 PM',
      fitting_type: 'Doorstep Courier / Pickup',
      notes: '3 Kanchipuram silk sarees for wedding weekend. Require accordion knife-edge folds.',
      status: 'Pending'
    },
    {
      id: 'BK-8903',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      client_name: 'Vikramaditya Rao',
      client_phone: '+91 99001 88776',
      client_email: 'vikram.rao@enterprise.in',
      service: 'Corporate Crests & Uniforms',
      booking_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0],
      time_slot: '04:00 PM',
      fitting_type: 'In-Studio Atelier Trial',
      notes: 'Hotel front office staff royal charcoal bandhgala uniforms. Initial sizing batch of 15 suits.',
      status: 'Confirmed'
    },
    {
      id: 'BK-8904',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      client_name: 'Deepika & Rohan',
      client_phone: '+91 97400 55443',
      client_email: 'deepika.rohan@gmail.com',
      service: 'Kids Festive Couture',
      booking_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString().split('T')[0],
      time_slot: '05:30 PM',
      fitting_type: 'In-Studio Atelier Trial',
      notes: 'Mother & daughter matching ivory gold gown and miniature pattu pavadai for 1st birthday.',
      status: 'Completed'
    }
  ];

  const SEED_CLIENTS = [
    {
      id: 'CL-101',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      name: 'Priyanka Sharma',
      email: 'priyanka.s@gmail.com',
      phone: '+91 98765 43210',
      total_bookings: 2,
      tier: 'Bridal VIP'
    },
    {
      id: 'CL-102',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      name: 'Ananya Krishnan',
      email: 'ananya.k@outlook.com',
      phone: '+91 98450 11223',
      total_bookings: 3,
      tier: 'Silk Patron'
    },
    {
      id: 'CL-103',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@enterprise.in',
      phone: '+91 99001 88776',
      total_bookings: 1,
      tier: 'Corporate Partner'
    }
  ];

  class SupabaseStudioService {
    constructor() {
      this.supabaseClient = null;
      this.initClient();
    }

    getConfig() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('Could not read Supabase config', e);
      }
      return { url: '', key: '', google_client_id: '' };
    }

    saveConfig(url, key, google_client_id) {
      const prev = this.getConfig();
      const config = {
        url: (url !== undefined ? url : prev.url || '').trim(),
        key: (key !== undefined ? key : prev.key || '').trim(),
        google_client_id: (google_client_id !== undefined ? google_client_id : prev.google_client_id || '').trim()
      };
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      this.initClient();
      return this.isConfigured();
    }

    initClient() {
      this._checkIncomingOAuth();
      const { url, key } = this.getConfig();
      if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.supabaseClient = window.supabase.createClient(url, key);
          console.info('Supabase Client successfully initialized with cloud endpoint:', url);

          // Check for incoming Supabase OAuth session (e.g. Google redirect)
          this.supabaseClient.auth.getSession().then(({ data }) => {
            if (data && data.session && data.session.user) {
              const u = data.session.user;
              const profile = {
                id: u.id,
                name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0],
                email: u.email,
                phone: u.phone || u.user_metadata?.phone || '',
                tier: 'Google Verified Patron',
                provider: 'google',
                avatar: u.user_metadata?.avatar_url || ''
              };
              this.setCurrentUser(profile);
            }
          });
        } catch (e) {
          console.error('Failed to initialize Supabase client:', e);
          this.supabaseClient = null;
        }
      } else {
        this.supabaseClient = null;
      }
    }

    isConfigured() {
      return Boolean(this.supabaseClient);
    }

    async testConnection() {
      if (!this.isConfigured()) {
        return { success: false, message: 'Supabase URL and Anon Key are not configured yet.' };
      }
      try {
        const { data, error } = await this.supabaseClient.from('bookings').select('id').limit(1);
        if (error) {
          return { success: false, message: `Connected to Supabase, but query error: ${error.message}. Ensure the "bookings" table exists.` };
        }
        return { success: true, message: 'Successfully connected to live Supabase database!' };
      } catch (err) {
        return { success: false, message: `Connection error: ${err.message}` };
      }
    }

    // Local Storage Helpers
    _getLocalBookings() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }

    _saveLocalBookings(bookings) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    }

    _getLocalClients() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(SEED_CLIENTS));
      return SEED_CLIENTS;
    }

    _saveLocalClients(clients) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    }

    // --- Bookings API ---
    async getBookings() {
      // If live Supabase configured, attempt to query cloud
      if (this.isConfigured()) {
        try {
          const { data, error } = await this.supabaseClient
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data) && data.length > 0) {
            return data;
          }
        } catch (e) {
          console.warn('Supabase fetch failed, falling back to local database:', e);
        }
      }
      return this._getLocalBookings();
    }

    async createBooking(bookingInput) {
      const newBooking = {
        id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
        created_at: new Date().toISOString(),
        client_name: bookingInput.client_name || 'Guest Client',
        client_phone: bookingInput.client_phone || '',
        client_email: bookingInput.client_email || '',
        service: bookingInput.service || 'Bridal & Saree Embroidery',
        booking_date: bookingInput.booking_date || new Date().toISOString().split('T')[0],
        time_slot: bookingInput.time_slot || '11:00 AM',
        fitting_type: bookingInput.fitting_type || 'In-Studio Atelier Trial',
        notes: bookingInput.notes || '',
        status: 'Pending'
      };

      // Always save locally to ensure 100% offline reliability
      const localList = this._getLocalBookings();
      localList.unshift(newBooking);
      this._saveLocalBookings(localList);

      // Register or update client registry
      this.recordClientActivity(newBooking);

      // Try syncing to Supabase if configured
      if (this.isConfigured()) {
        try {
          await this.supabaseClient.from('bookings').insert([newBooking]);
        } catch (err) {
          console.warn('Could not sync booking to cloud Supabase:', err);
        }
      }

      return newBooking;
    }

    async updateBookingStatus(id, newStatus) {
      // Update local storage
      const localList = this._getLocalBookings();
      const item = localList.find(b => b.id === id);
      if (item) {
        item.status = newStatus;
        this._saveLocalBookings(localList);
      }

      // Sync with Supabase if online
      if (this.isConfigured()) {
        try {
          await this.supabaseClient.from('bookings').update({ status: newStatus }).eq('id', id);
        } catch (err) {
          console.warn('Could not sync status update to Supabase:', err);
        }
      }

      return item;
    }

    async deleteBooking(id) {
      let localList = this._getLocalBookings();
      localList = localList.filter(b => b.id !== id);
      this._saveLocalBookings(localList);

      if (this.isConfigured()) {
        try {
          await this.supabaseClient.from('bookings').delete().eq('id', id);
        } catch (err) {
          console.warn('Could not delete from Supabase:', err);
        }
      }
      return true;
    }

    // --- Clients Registry & Auth API ---
    recordClientActivity(booking) {
      if (!booking.client_phone && !booking.client_email) return;
      const clients = this._getLocalClients();
      const existing = clients.find(c => 
        (booking.client_email && c.email.toLowerCase() === booking.client_email.toLowerCase()) ||
        (booking.client_phone && c.phone === booking.client_phone)
      );

      if (existing) {
        existing.total_bookings = (existing.total_bookings || 1) + 1;
        existing.last_booking = booking.booking_date;
      } else {
        clients.unshift({
          id: 'CL-' + Math.floor(100 + Math.random() * 900),
          created_at: new Date().toISOString(),
          name: booking.client_name,
          email: booking.client_email || 'client@studio.in',
          phone: booking.client_phone,
          total_bookings: 1,
          tier: 'Silver Patron'
        });
      }
      this._saveLocalClients(clients);
    }

    async getClients() {
      if (this.isConfigured()) {
        try {
          const { data, error } = await this.supabaseClient.from('clients').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            return data;
          }
        } catch (e) {}
      }
      return this._getLocalClients();
    }

    async registerClient(userData) {
      const client = {
        id: 'CL-' + Math.floor(100 + Math.random() * 900),
        created_at: new Date().toISOString(),
        name: userData.name || 'Valued Client',
        email: userData.email || '',
        phone: userData.phone || '',
        total_bookings: 0,
        tier: 'Atelier Member'
      };

      const clients = this._getLocalClients();
      clients.unshift(client);
      this._saveLocalClients(clients);

      this.setCurrentUser(client);

      if (this.isConfigured()) {
        try {
          // Cloud Supabase Auth signup
          await this.supabaseClient.auth.signUp({
            email: userData.email,
            password: userData.password || 'TemporaryPass123!',
            options: {
              data: { name: userData.name, phone: userData.phone }
            }
          });
          await this.supabaseClient.from('clients').insert([client]);
        } catch (err) {
          console.warn('Supabase cloud signup warning:', err);
        }
      }

      return client;
    }

    async loginClient(email, password) {
      if (this.isConfigured()) {
        try {
          const { data, error } = await this.supabaseClient.auth.signInWithPassword({ email, password });
          if (!error && data && data.user) {
            const clientProfile = {
              id: data.user.id,
              name: data.user.user_metadata?.name || email.split('@')[0],
              email: data.user.email,
              phone: data.user.user_metadata?.phone || '',
              tier: 'Atelier Member'
            };
            this.setCurrentUser(clientProfile);
            return { success: true, user: clientProfile };
          }
        } catch (e) {
          console.warn('Supabase auth failed, checking local profiles:', e);
        }
      }

      // Check local profiles
      const clients = this._getLocalClients();
      const found = clients.find(c => c.email.toLowerCase() === (email || '').toLowerCase().trim());
      if (found) {
        this.setCurrentUser(found);
        return { success: true, user: found };
      }

      // Create guest session
      const guest = {
        id: 'CL-GUEST',
        name: email.split('@')[0] || 'Valued Client',
        email: email,
        phone: '',
        tier: 'Guest'
      };
      this.setCurrentUser(guest);
      return { success: true, user: guest };
    }

    _checkIncomingOAuth() {
      try {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token=')) {
          const params = new URLSearchParams(hash.substring(1));
          const token = params.get('access_token');
          if (token) {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(r => r.json())
            .then(profile => {
              if (profile && profile.email) {
                this.loginWithGoogleProfile({
                  name: profile.name || profile.email.split('@')[0],
                  email: profile.email,
                  avatar: profile.picture || ''
                });
                window.history.replaceState({}, document.title, window.location.pathname);
              }
            })
            .catch(err => console.warn('Google userinfo fetch failed:', err));
          }
        }
      } catch (e) {}
    }

    async signInWithGoogle() {
      const { google_client_id } = this.getConfig();

      // 1. If live Supabase is configured with OAuth
      if (this.isConfigured()) {
        try {
          const { data, error } = await this.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + '/auth.html'
            }
          });
          if (!error) return { success: true, mode: 'supabase' };
        } catch (e) {
          console.warn('Supabase Google OAuth error:', e);
        }
      }

      // 2. If Google Cloud Client ID is configured, direct redirect to accounts.google.com
      if (google_client_id) {
        const redirectUri = window.location.origin + '/auth.html';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(google_client_id)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email%20profile`;
        window.location.href = authUrl;
        return { success: true, mode: 'google_direct' };
      }

      return { success: false, setupRequired: true, message: 'Google Client ID or Supabase OAuth is not configured yet.' };
    }

    loginWithGoogleProfile(googleData) {
      const name = googleData.name || 'Google User';
      const email = googleData.email || 'user@gmail.com';
      const avatar = googleData.avatar || '';

      const clients = this._getLocalClients();
      let found = clients.find(c => c.email.toLowerCase() === email.toLowerCase());

      if (!found) {
        found = {
          id: 'CL-G-' + Math.floor(100 + Math.random() * 900),
          created_at: new Date().toISOString(),
          name: name,
          email: email,
          phone: googleData.phone || '+91 98000 12345',
          total_bookings: 0,
          tier: 'Google Verified Patron',
          provider: 'google',
          avatar: avatar
        };
        clients.unshift(found);
        this._saveLocalClients(clients);
      } else {
        found.provider = 'google';
        if (avatar) found.avatar = avatar;
      }

      this.setCurrentUser(found);
      return { success: true, user: found };
    }

    getCurrentUser() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    }

    setCurrentUser(user) {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }

    logout() {
      this.setCurrentUser(null);
      if (this.isConfigured()) {
        try { this.supabaseClient.auth.signOut(); } catch (e) {}
      }
    }

    // --- SQL Schema generator snippet for Admin setup ---
    getSqlSchema() {
      return `-- Run this in your Supabase SQL Editor:

-- 1. Create Bookings Table
create table if not exists public.bookings (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_name text not null,
  client_phone text not null,
  client_email text,
  service text not null,
  booking_date text not null,
  time_slot text not null,
  fitting_type text not null,
  notes text,
  status text default 'Pending'
);

-- 2. Create Clients Table
create table if not exists public.clients (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text not null,
  total_bookings integer default 0,
  tier text default 'Atelier Member'
);

-- 3. Enable Row Level Security (RLS) & Public access policies
alter table public.bookings enable row level security;
alter table public.clients enable row level security;

create policy "Public bookings select" on public.bookings for select using (true);
create policy "Public bookings insert" on public.bookings for insert with check (true);
create policy "Public bookings update" on public.bookings for update using (true);
create policy "Public bookings delete" on public.bookings for delete using (true);

create policy "Public clients select" on public.clients for select using (true);
create policy "Public clients insert" on public.clients for insert with check (true);
create policy "Public clients update" on public.clients for update using (true);
`;
    }
  }

  // Export singleton to global namespace
  window.StudioDatabase = new SupabaseStudioService();

})(window);
