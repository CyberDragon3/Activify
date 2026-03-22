import { getCurrentUser, supabase } from '../shared/storage.bundle.js';

getCurrentUser().then(user => {
  if (user) window.location.href = 'index.html';
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

  if (!email || !password) { errorEl.textContent = 'Please fill in both fields.'; return; }

  btn.disabled = true;
  btn.textContent = 'Loading...';
  errorEl.textContent = '';

  try {
    let result;
    if (mode === 'signin') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) throw result.error;

    if (mode === 'signup') {
      errorEl.style.color = 'var(--green)';
      errorEl.textContent = '✓ Check your email to confirm your account.';
      btn.disabled = false;
      btn.textContent = 'Create Account';
      return;
    }

    window.location.href = 'index.html';
  } catch (err) {
    errorEl.style.color = 'var(--warn)';
    errorEl.textContent = err.message;
    btn.disabled = false;
    btn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
  }
});

document.getElementById('field-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-submit').click();
});