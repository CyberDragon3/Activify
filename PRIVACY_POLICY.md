# Activify Privacy Policy

**Last Updated: July 27, 2026**

## 1. Age Requirements

Activify is not intended for children under 13. By creating an account, you confirm that you are at least 13 years old. If you are under 18, review this policy with a parent or guardian before using Activify.

## 2. Information We Collect

### Account Information

When you create or sign in to an account, authentication is provided by Supabase Auth. Activify does not store your password. Supabase manages authentication credentials on our behalf.

### School, Task, and Assignment Data

When you click **Scan** on Google Classroom, Canvas, or Schoology, Activify collects visible page text needed to identify assignments. This may include assignment titles, course names, due dates, source URLs, and other visible text on the page. Scanned assignments and tasks are stored locally in your browser and, when you are signed in, synced to Supabase.

Your study streak and preferences are stored locally in your browser. They are not synced to Supabase.

### AI Data and Groq API Key

Activify uses Groq to provide assignment extraction, AI planning, chat, and assignment deduplication. When you use these features, Activify sends relevant school-page text, task or assignment data, and any prompt you provide directly to Groq.

Your optional Groq API key is stored locally in Chrome extension storage on your device. It is transmitted directly to Groq only to authenticate Groq requests. Activify does not transmit or store your Groq API key on its own servers.

Groq's handling of data is governed by its own policies: <https://console.groq.com/docs/your-data>.

### Product Analytics

Activify uses PostHog, through its US service endpoint, for pseudonymous product analytics. We generate a random identifier and store it locally in your browser. We send events when the extension is installed, started, and when a scan is performed, along with associated technical and request metadata.

We do not intentionally send school-page content, task data, assignment data, account credentials, or Groq API keys to PostHog.

## 3. How We Use Information

We use information to:

- Display assignments and tasks in Activify.
- Sync tasks and scanned assignments across your signed-in devices.
- Extract assignments and provide AI planning, chat, and deduplication features when you use them.
- Maintain your study streak locally in your browser.
- Understand extension reliability and feature usage.

We do not sell personal information or use your information for advertising.

## 4. Service Providers and Data Sharing

We share data only with the following service providers to operate Activify:

| Service | Purpose | Data Shared |
| --- | --- | --- |
| Supabase | Authentication and cloud sync | Account information, tasks, and scanned assignments for signed-in users |
| Groq | Assignment extraction and AI features | Relevant page text, task or assignment data, prompts, and the API key needed to authenticate the request |
| PostHog | Product analytics | Pseudonymous identifier, event names, and technical or request metadata |

PostHog's privacy policy is available at <https://posthog.com/privacy>.

## 5. Data Security

We use HTTPS/TLS for data sent between Activify and its service providers. Supabase states that hosted data is encrypted in transit and at rest. Chrome extension storage is local to your browser profile; do not treat it as end-to-end encrypted storage.

No method of storage or transmission is completely secure. If we become aware of a breach affecting information we control, we will notify affected users as required by applicable law.

## 6. Retention and Deletion

We retain account, task, and assignment data in Supabase while your account remains active, unless a longer retention period is required by law. You may request deletion of your account and associated Supabase data by emailing the address below. We aim to process verified deletion requests within 30 days.

Removing the extension removes Activify data stored locally in that browser profile. It does not automatically delete data already synced to Supabase or data already processed by Groq or PostHog.

PostHog analytics retention follows the retention settings configured for the Activify PostHog project. Analytics are pseudonymous and are not linked by Activify to your Supabase account. Contact us if you would like to make an analytics deletion request; we will use reasonable efforts to process it when we can identify the relevant data.

## 7. Changes to This Policy

We may update this policy from time to time. We will post the updated version with a new "Last Updated" date.

## 8. Contact

For questions about this policy or to request deletion of account data, contact:

hello.activify@gmail.com
