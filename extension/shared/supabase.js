import { createClient } from './supabase-lib.js';

const supabaseUrl = 'https://zhubgshxptzrdgbtstgy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // (your actual key)

// Custom storage adapter for Chrome Extensions to persist session in chrome.storage.local
const ChromeStorageAdapter = {
  getItem: (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  },
  setItem: (key, value) => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  },
  removeItem: (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], () => {
        resolve();
      });
    });
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ChromeStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});