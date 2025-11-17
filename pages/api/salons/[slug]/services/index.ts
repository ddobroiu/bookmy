import type { NextApiRequest, NextApiResponse } from 'next'

// Deprecated endpoint: we no longer expose services via slug-scoped public API routes.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(410).json({ error: 'This endpoint is deprecated. Use subdomain-based API or admin endpoints.' })
}
