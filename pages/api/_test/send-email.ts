import type { NextApiRequest, NextApiResponse } from 'next'
import { sendResendEmail } from '../../../lib/resend'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const to = (req.query.to as string) || req.body?.to
  if (!to) return res.status(400).json({ error: 'Provide ?to=you@domain' })

  const from = process.env.EMAIL_FROM || 'no-reply@example.com'
  try {
    const result = await sendResendEmail({
      to,
      from,
      subject: 'Test email from Bookmy (Resend)',
      text: 'This is a test email sent via Resend API.',
      html: '<p>This is a <strong>test</strong> email sent via Resend API.</p>',
    })
    return res.status(200).json({ ok: true, result })
  } catch (err: any) {
    console.error('send-email test error', err)
    return res.status(500).json({ error: err.message || String(err) })
  }
}
