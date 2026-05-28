'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEFAULT_STEPS = [
  { step: 1, channel: 'email', delay_days: 0 },
  { step: 2, channel: 'email', delay_days: 3 },
  { step: 3, channel: 'email', delay_days: 7 },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [icpDescription, setIcpDescription] = useState('')
  const [sources, setSources] = useState<string[]>(['github'])
  const [dailyLimit, setDailyLimit] = useState(40)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleSource(source: string) {
    setSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !icpDescription.trim() || sources.length === 0) {
      setError('Fill in all fields and select at least one source.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/gtm/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          icp_description: icpDescription,
          sources,
          daily_email_limit: dailyLimit,
          sequence_steps: DEFAULT_STEPS,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create campaign')
      router.push(`/dashboard/gtm/${data.campaign.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: 640 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/gtm" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Campaigns
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.5rem' }}>New Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600 }}>Campaign name</span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Dev tools founders – May 2026"
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 6, fontSize: '0.95rem' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600 }}>Who are you targeting?</span>
          <span style={{ fontSize: '0.82rem', color: '#666' }}>
            Describe your ICP in plain English — Gemini will extract the structured config.
          </span>
          <textarea
            value={icpDescription}
            onChange={e => setIcpDescription(e.target.value)}
            rows={5}
            placeholder="e.g. Software engineers and technical founders building SaaS products or dev tools. They work at early-stage startups (1–50 people), are active on GitHub with open-source projects, and care about shipping fast. Seniority: senior engineer to CTO."
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 6, fontSize: '0.9rem', resize: 'vertical' }}
          />
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600 }}>Sources</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['github', 'devto', 'linkedin'].map(src => (
              <label key={src} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sources.includes(src)}
                  onChange={() => toggleSource(src)}
                />
                {src}
                {src === 'linkedin' && <span style={{ fontSize: '0.75rem', color: '#999' }}>(manual only for now)</span>}
              </label>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontWeight: 600 }}>Daily email limit</span>
          <input
            type="number"
            min={1}
            max={200}
            value={dailyLimit}
            onChange={e => setDailyLimit(Number(e.target.value))}
            style={{ width: 100, padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 6 }}
          />
        </label>

        <div style={{ fontSize: '0.82rem', color: '#666', background: '#f9f9f9', padding: '0.75rem 1rem', borderRadius: 6, lineHeight: 1.6 }}>
          <strong>Default sequence:</strong><br />
          Step 1 — cold intro email (day 0)<br />
          Step 2 — follow-up, new angle (day 3)<br />
          Step 3 — final close (day 10)
        </div>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.65rem 1.5rem', background: loading ? '#999' : '#111', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Creating… (Gemini is parsing your ICP)' : 'Create Campaign'}
        </button>
      </form>
    </div>
  )
}
