import { PostHog } from 'posthog-js/dist/module.no-external';

const POSTHOG_KEY = 'phc_yvN9tWkUbZfrArYb2KHwCszRay38fLH3bzEcp9wf4iFa';
const POSTHOG_HOST = 'https://us.i.posthog.com';

const DISTINCT_ID_KEY = 'posthog_distinct_id';

export async function getDistinctId() {
  const stored = await chrome.storage.local.get(DISTINCT_ID_KEY);
  if (stored[DISTINCT_ID_KEY]) return stored[DISTINCT_ID_KEY];
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ [DISTINCT_ID_KEY]: id });
  return id;
}

export async function initPostHog(context) {
  const distinctId = await getDistinctId();

  const isBg = context === 'background';

  const posthog = new PostHog();
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    bootstrap: { distinctID: distinctId },
    disable_external_dependency_loading: true,
    persistence: isBg ? 'memory' : 'localStorage',
    capture_pageview: !isBg,
    autocapture: !isBg,
    disable_session_recording: isBg,
    disable_surveys: isBg,
  });

  return posthog;
}
