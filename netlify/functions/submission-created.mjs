/**
 * Netlify event-triggered function — fires automatically on every Netlify Forms
 * submission (audit / partner / affiliate). Native Forms already CAPTURED the
 * lead (zero owner credentials needed); this function enriches it when keys exist:
 *   1. sends the submitter a confirmation email (Resend)         — if RESEND_API_KEY
 *   2. notifies the owner of the new lead (Resend)               — if LEAD_NOTIFY_EMAIL
 *   3. pushes the lead into a CRM (HubSpot Forms API)            — if HUBSPOT_* set
 * Every step degrades gracefully: with no keys, the lead is still captured by
 * Netlify and this function is a harmless no-op. It never fails the submission.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

async function sendEmail({ apiKey, from, to, subject, text }) {
  if (!apiKey || !to) return;
  try {
    await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch {
    /* never throw — capture already happened */
  }
}

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const data = (body.payload && body.payload.data) || {};
    const formName = (body.payload && body.payload.form_name) || data['form-name'] || 'lead';
    const email = data.email;

    const RESEND = process.env.RESEND_API_KEY;
    const FROM = process.env.EMAIL_FROM || 'noreply@persistentcartapp.com';
    const NOTIFY = process.env.LEAD_NOTIFY_EMAIL;

    const isAudit = formName === 'audit';
    const confirmSubject = isAudit
      ? 'Your free Persistent Cart store audit is on the way'
      : 'Thanks for your interest in the Persistent Cart program';
    const confirmText = isAudit
      ? `Thanks for requesting a free cross-device cart audit. We'll check whether your store keeps a signed-in cart across devices and email your results within 1–2 business days.\n\n— The Persistent Cart team`
      : `Thanks for applying to the Persistent Cart partner/affiliate program. We'll review your details and follow up with your referral link, the promo kit, and the finalized terms.\n\n— The Persistent Cart team`;

    // 1) Confirmation to the submitter
    await sendEmail({ apiKey: RESEND, from: FROM, to: email, subject: confirmSubject, text: confirmText });

    // 2) Notify the owner
    if (NOTIFY) {
      const summary = Object.entries(data)
        .filter(([k]) => !['bot-field', 'form-name', 'started'].includes(k))
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      await sendEmail({
        apiKey: RESEND,
        from: FROM,
        to: NOTIFY,
        subject: `New ${formName} lead — persistentcartapp.com`,
        text: `A new ${formName} submission:\n\n${summary}`,
      });
    }

    // 3) HubSpot CRM push
    const portal = process.env.HUBSPOT_PORTAL_ID;
    const formGuid = isAudit ? process.env.HUBSPOT_FORM_GUID_AUDIT : process.env.HUBSPOT_FORM_GUID_PARTNER;
    if (portal && formGuid && email) {
      try {
        await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${formGuid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: Object.entries(data)
              .filter(([k]) => !['bot-field', 'form-name', 'started'].includes(k))
              .map(([name, value]) => ({ name, value: String(value) })),
          }),
        });
      } catch {
        /* ignore */
      }
    }

    return { statusCode: 200, body: 'ok' };
  } catch {
    return { statusCode: 200, body: 'ignored' };
  }
};
