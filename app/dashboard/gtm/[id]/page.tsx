'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Campaign, Lead } from '@/lib/types/gtm'

interface Send {
  id: string
  step: number
  channel: string
  status: string
  sent_at: string | null
  lead_id: string
}

interface PageData {
  campaign: Campaign
  leads: Lead[]
  sends: Send[]
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  useEffect(() => {
    fetch(`/api/gtm/campaigns/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [id])

  async function triggerAction(action: 'scrape' | 'send') {
    setActionMsg(`Triggering ${action}…`)
    const res = await fetch(`/api/gtm/campaigns/${id}/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const d = await res.json()
    setActionMsg(res.ok ? `${action} triggered ✓ — ${JSON.stringify(d.results?.[id] ?? d.message ?? d)}` : `Error: ${d.error}`)
    setTimeout(() => {
      fetch(`/api/gtm/campaigns/${id}`).then(r => r.json()).then(setData)
      setActionMsg('')
    }, 3000)
  }

  async function toggleStatus() {
    if (!data) return
    const next = data.campaign.status === 'active' ? 'paused' : 'active'
    const res = await fetch(`/api/gtm/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    const d = await res.json()
    setData(prev => prev ? { ...prev, campaign: d.campaign } : prev)
  }

  if (loading) return <div style={{ padding: '2rem', fontFamily: 'monospace' }}>Loading…</div>
  if (!data) return <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'red' }}>Campaign not found.</div>

  const { campaign, leads, sends } = data

  const sendsByStatus = sends.reduce<Record<string, number>>((acc, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/gtm" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Campaigns</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{campaign.name}</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => triggerAction('scrape')} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ccc', borderRadius: 5, cursor: 'pointer', background: 'white', fontSize: '0.85rem' }}>
              Run Scrape
            </button>
            <button onClick={() => triggerAction('send')} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ccc', borderRadius: 5, cursor: 'pointer', background: 'white', fontSize: '0.85rem' }}>
              Run Send
            </button>
            <button onClick={toggleStatus} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ccc', borderRadius: 5, cursor: 'pointer', background: campaign.status === 'active' ? '#fef9c3' : '#dcfce7', fontSize: '0.85rem' }}>
              {campaign.status === 'active' ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
        {actionMsg && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>{actionMsg}</p>}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total leads', value: leads.length },
          { label: 'Emails sent', value: sendsByStatus['sent'] ?? 0 },
          { label: 'Replied', value: sendsByStatus['replied'] ?? 0 },
          { label: 'Daily limit', value: `${campaign.daily_email_limit}/day` },
        ].map(s => (
          <div key={s.label} style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ICP config */}
      <details style={{ marginBottom: '2rem', border: '1px solid #eee', borderRadius: 8, padding: '1rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>ICP Config (parsed by Gemini)</summary>
        <pre style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: '#f9f9f9', padding: '0.75rem', borderRadius: 6, overflow: 'auto' }}>
          {JSON.stringify(campaign.icp_config, null, 2)}
        </pre>
      </details>

      {/* Leads table */}
      <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Leads ({leads.length})</h2>
      {leads.length === 0 ? (
        <p style={{ color: '#888' }}>No leads yet — run a scrape to discover leads.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.4rem 0.6rem' }}>Name</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Email</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Source</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Score</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Status</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Company</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                  <td style={{ padding: '0.4rem 0.6rem' }}>
                    {l.github_username
                      ? <a href={`https://github.com/${l.github_username}`} target="_blank" rel="noreferrer" style={{ color: '#111' }}>{l.name}</a>
                      : l.name}
                  </td>
                  <td style={{ padding: '0.4rem 0.6rem', color: l.email ? '#111' : '#bbb' }}>{l.email ?? '—'}</td>
                  <td style={{ padding: '0.4rem 0.6rem' }}>{l.source}</td>
                  <td style={{ padding: '0.4rem 0.6rem' }}>{l.icp_match_score != null ? (l.icp_match_score * 100).toFixed(0) + '%' : '—'}</td>
                  <td style={{ padding: '0.4rem 0.6rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: 10, fontSize: '0.75rem',
                      background: l.status === 'contacted' ? '#dbeafe' : l.status === 'replied' ? '#dcfce7' : '#f3f4f6',
                    }}>{l.status}</span>
                  </td>
                  <td style={{ padding: '0.4rem 0.6rem', color: '#555' }}>{l.company ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent sends */}
      {sends.length > 0 && (
        <>
          <h2 style={{ fontWeight: 700, margin: '2rem 0 0.75rem' }}>Recent sends</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.4rem 0.6rem' }}>Step</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Channel</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Status</th>
                <th style={{ padding: '0.4rem 0.6rem' }}>Sent at</th>
              </tr>
            </thead>
            <tbody>
              {sends.slice(0, 50).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                  <td style={{ padding: '0.4rem 0.6rem' }}>Step {s.step}</td>
                  <td style={{ padding: '0.4rem 0.6rem' }}>{s.channel}</td>
                  <td style={{ padding: '0.4rem 0.6rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: 10, fontSize: '0.75rem',
                      background: s.status === 'sent' ? '#dcfce7' : s.status === 'failed' ? '#fee2e2' : '#f3f4f6',
                    }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '0.4rem 0.6rem', color: '#555' }}>
                    {s.sent_at ? new Date(s.sent_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
