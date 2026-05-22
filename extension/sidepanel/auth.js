import { supabase } from '../shared/storage.js';

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log(`[Activify] Auth Event: ${event}`, session ? 'Session exists' : 'No session');
  
  if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session) {
    console.log('[Activify] Valid session detected, redirecting...');
    // Use a small delay to ensure storage has persisted before navigation
    setTimeout(() => {
      window.location.replace('index.html');
    }, 100);
  }
});

let mode = 'signin';

document.getElementById('toggle-mode').addEventListener('click', () => {
  mode = mode === 'signin' ? 'signup' : 'signin';
  document.getElementById('btn-submit').textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
  document.getElementById('toggle-mode').textContent = mode === 'signin'
    ? "Don't have an account? Sign up"
    : 'Already have an account? Sign in';
  document.getElementById('auth-error').textContent = '';
});

document.getElementById('btn-submit').addEventListener('click', async () => {
  const email = document.getElementById('field-email').value.trim();
  const password = document.getElementById('field-password').value;
  const errorEl = document.getElementById('auth-error');
  const btn = document.getElementById('btn-submit');

  if (!email || !password) {
    errorEl.textContent = 'Please fill in both fields.';
    return;
  }

  console.log('[Activify] Login started:', { email, mode });
  btn.disabled = true;
  btn.textContent = 'Loading...';
  errorEl.textContent = '';

  try {
    let result;
    if (mode === 'signin') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: 'https://activify-web.vercel.app/confirm.html' }
      });
    }

    console.log('[Activify] Supabase responded:', result);

    if (result.error) {
      console.error('[Activify] Auth Error:', result.error.message);
      throw result.error;
    }

    if (mode === 'signup') {
      errorEl.style.color = 'var(--green)';
      errorEl.textContent = '✓ Check your email to confirm your account.';
      return;
    }

    if (result.data?.session) {
      console.log('[Activify] Redirecting to index.html...');
      window.location.replace('index.html');
    } else if (mode === 'signin') {
      console.warn('[Activify] Sign in successful but no session returned?');
      errorEl.textContent = 'Session could not be established. Please try again.';
    }
  } catch (err) {
    console.error('[Activify] Catch block error:', err);
    errorEl.style.color = 'var(--warn)';
    errorEl.textContent = err.message || 'An unexpected error occurred.';
  } finally {
    // Only reset if we are not redirecting or if we are in signup mode
    if (mode === 'signup' || errorEl.textContent !== '') {
      console.log('[Activify] Resetting button state');
      btn.disabled = false;
      btn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
    }
  }
});

document.getElementById('field-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-submit').click();
});