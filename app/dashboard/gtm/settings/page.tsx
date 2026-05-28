'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

interface EmailAccount {
  id: string
  email_address: string
  display_name: string | null
  is_active: boolean
  daily_send_count: number
  last_send_date: string | null
  created_at: string
}

function SettingsContent() {
  const searchParams = useSearchParams()
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const connected = searchParams.get('connected')
  const error = searchParams.get('error')

  useEffect(() => {
    fetch('/api/gtm/gmail/accounts')
      .then(r => r.json())
      .then(d => { setAccounts(d.accounts ?? []); setLoading(false) })
  }, [])

  async function disconnect(accountId: string, email: string) {
    if (!confirm(`Disconnect ${email}? Active campaigns using this inbox will stop sending.`)) return
    const res = await fetch('/api/gtm/gmail/disconnect', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    })
    if (res.ok) {
      setAccounts(prev => prev.filter(a => a.id !== accountId))
      setMsg(`${email} disconnected.`)
    } else {
      setMsg('Failed to disconnect account.')
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: 680 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/dashboard/gtm" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Campaigns</Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.5rem' }}>GTM Settings</h1>
      </div>

      {connected === 'gmail' && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#166534' }}>
          Gmail account connected successfully.
        </div>
      )}
      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#991b1b' }}>
          {errorMessages[error] ?? `Error: ${error}`}
        </div>
      )}
      {msg && <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>{msg}</p>}

      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 700 }}>Connected Gmail accounts</h2>
          <a
            href="/api/gtm/gmail/connect"
            style={{ padding: '0.4rem 0.9rem', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: '0.9rem' }}
          >
            + Connect Gmail
          </a>
        </div>

        {loading && <p style={{ color: '#888' }}>Loading…</p>}

        {!loading && accounts.length === 0 && (
          <div style={{ border: '1px dashed #ccc', borderRadius: 8, padding: '2rem', textAlign: 'center', color: '#666' }}>
            <p style={{ marginBottom: '0.5rem' }}>No Gmail accounts connected.</p>
            <p style={{ fontSize: '0.85rem' }}>Connect your inbox so campaigns can send emails on your behalf.</p>
          </div>
        )}

        {accounts.map(account => (
          <div key={account.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{account.email_address}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>
                {account.is_active ? '● Active' : '○ Inactive'} ·
                Sent today: {account.daily_send_count} ·
                Connected {new Date(account.created_at).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => disconnect(account.id, account.email_address)}
              style={{ padding: '0.3rem 0.7rem', border: '1px solid #fca5a5', borderRadius: 5, background: 'white', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Disconnect
            </button>
          </div>
        ))}
      </section>

      <section style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#555', lineHeight: 1.7 }}>
        <strong>How email sending works</strong><br />
        Emails are sent from your connected Gmail inbox via the Gmail API — not a shared bulk sender.
        This gives you full control over deliverability and sender reputation.<br /><br />
        The daily send count resets at midnight UTC. The default cap is 40/day per campaign.
        You can adjust the limit when creating or editing a campaign.
      </section>
    </div>
  )
}

const errorMessages: Record<string, string> = {
  gmail_denied: 'You declined the Gmail permission. Try connecting again.',
  gmail_invalid: 'Invalid OAuth response from Google.',
  gmail_expired: 'OAuth session expired. Please try connecting again.',
  gmail_csrf: 'Security check failed. Please try connecting again.',
  gmail_no_refresh_token: 'Google did not return a refresh token. Please revoke Ozigi\'s access in your Google account and try again.',
  gmail_failed: 'Something went wrong connecting your Gmail account. Please try again.',
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', fontFamily: 'monospace' }}>Loading…</div>}>
      <SettingsContent />
    </Suspense>
  )
}
