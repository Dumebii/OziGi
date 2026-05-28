'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Campaign {
  id: string
  name: string
  status: string
  sources: string[]
  daily_email_limit: number
  created_at: string
  leads: [{ count: number }]
  sequence_sends: [{ count: number }]
}

export default function GtmPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/gtm/campaigns')
      .then(r => r.json())
      .then(d => { setCampaigns(d.campaigns ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load campaigns'); setLoading(false) })
  }, [])

  async function toggleStatus(id: string, current: string) {
    const next = current === 'active' ? 'paused' : 'active'
    await fetch(`/api/gtm/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, status: next } : c))
  }

  async function deleteCampaign(id: string) {
    if (!confirm('Delete this campaign and all its leads?')) return
    await fetch(`/api/gtm/campaigns/${id}`, { method: 'DELETE' })
    setCampaigns(cs => cs.filter(c => c.id !== id))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>GTM Campaigns</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/dashboard/gtm/settings" style={{ padding: '0.4rem 0.9rem', border: '1px solid #ccc', borderRadius: 6, textDecoration: 'none', color: '#333' }}>
            Settings
          </Link>
          <Link href="/dashboard/gtm/new" style={{ padding: '0.4rem 0.9rem', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none' }}>
            + New Campaign
          </Link>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && campaigns.length === 0 && (
        <div style={{ border: '1px dashed #ccc', borderRadius: 8, padding: '3rem', textAlign: 'center', color: '#666' }}>
          <p>No campaigns yet.</p>
          <Link href="/dashboard/gtm/new" style={{ color: '#111', fontWeight: 600 }}>Create your first campaign →</Link>
        </div>
      )}

      {campaigns.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.75rem' }}>Name</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Status</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Sources</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Leads</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Sent</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Daily limit</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.5rem 0.75rem' }}>
                  <Link href={`/dashboard/gtm/${c.id}`} style={{ fontWeight: 600, color: '#111' }}>{c.name}</Link>
                </td>
                <td style={{ padding: '0.5rem 0.75rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.75rem',
                    background: c.status === 'active' ? '#dcfce7' : c.status === 'paused' ? '#fef9c3' : '#f3f4f6',
                    color: c.status === 'active' ? '#166534' : c.status === 'paused' ? '#854d0e' : '#374151',
                  }}>{c.status}</span>
                </td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.sources.join(', ')}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.leads?.[0]?.count ?? 0}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.sequence_sends?.[0]?.count ?? 0}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{c.daily_email_limit}/day</td>
                <td style={{ padding: '0.5rem 0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => toggleStatus(c.id, c.status)} style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.5rem', border: '1px solid #ccc', borderRadius: 4, background: 'white' }}>
                    {c.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button onClick={() => router.push(`/dashboard/gtm/${c.id}`)} style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.5rem', border: '1px solid #ccc', borderRadius: 4, background: 'white' }}>
                    View
                  </button>
                  <button onClick={() => deleteCampaign(c.id)} style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.5rem', border: '1px solid #fca5a5', borderRadius: 4, background: 'white', color: '#dc2626' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
