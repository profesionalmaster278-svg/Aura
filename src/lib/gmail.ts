import { getAccessToken } from './firebase.ts';

// Helper to base64url encode string
function toBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendConsultationEmail(payload: SendEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in to connect your Gmail account.');
  }

  const emailLines = [
    `To: ${payload.to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
    '',
    payload.body,
  ];
  const rawEmail = emailLines.join('\r\n');
  const encodedEmail = toBase64Url(rawEmail);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail API responded with status ${response.status}`);
  }

  const result = await response.json();
  return { success: true, messageId: result.id };
}

export async function fetchUserGmailProfile(): Promise<{ emailAddress: string; messagesTotal: number } | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return await response.json();
}
