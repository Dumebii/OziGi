const COMPOSIO_API_BASE = 'https://backend.composio.dev/api/v3';
const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY!;

export async function initiateGitHubConnection(userId: string, redirectUri: string) {
  const payload = {
    user_id: userId,
    auth_config: {
      id: process.env.COMPOSIO_GITHUB_AUTH_CONFIG_ID,
    },
    connection: {
      redirect_uri: redirectUri,
    },
  };
  console.log('Composio initiate payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(`${COMPOSIO_API_BASE}/connected_accounts`, {
    method: 'POST',
    headers: {
      'x-api-key': COMPOSIO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Composio initiate response status:', response.status);
  console.log('Composio initiate response body:', responseText);

  if (!response.ok) {
    throw new Error(`Composio API error: ${responseText}`);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error('Invalid JSON response from Composio');
  }

  // The v3 API returns a redirect_url field (snake_case)
  if (!data.redirect_url) {
    throw new Error('Composio response missing redirect_url');
  }
  return data.redirect_url;
}

export async function exchangeCode(code: string, state: string) {
  console.log('🔁 Exchange started with code:', code, 'state:', state);
  const response = await fetch(`${COMPOSIO_API_BASE}/connected_accounts/exchange`, {
    method: 'POST',
    headers: {
      'x-api-key': COMPOSIO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, state }),
  });
  const responseText = await response.text();
  console.log('📥 Exchange response status:', response.status);
  console.log('📥 Exchange response body:', responseText);
  if (!response.ok) {
    throw new Error(`Composio exchange error: ${responseText}`);
  }
  const data = JSON.parse(responseText);
  console.log('✅ Exchange parsed data:', data);
  return data;
}

export async function getComposioConnection(connectionId: string) {
  const response = await fetch(`${COMPOSIO_API_BASE}/connected_accounts/${connectionId}`, {
    headers: { 'x-api-key': COMPOSIO_API_KEY },
  });
  if (!response.ok) throw new Error('Connection not found');
  return response.json();
}

export async function getGitHubEnrichedContext(connectionId: string): Promise<string> {
  const connection = await getComposioConnection(connectionId);

  // Composio v3 stores the OAuth token in connectionParams
  const accessToken =
    connection.connectionParams?.access_token ||
    connection.connectionParams?.token;

  if (!accessToken) {
    // Graceful degradation: repos-only via Composio action endpoint
    const reposResp = await fetch(
      `https://backend.composio.dev/api/v1/connectedAccounts/${connection.id}/actions/getUserRepos`,
      { headers: { 'x-api-key': COMPOSIO_API_KEY } },
    );
    if (!reposResp.ok) return '';
    const repos = await reposResp.json();
    if (!repos?.length) return '';
    return (
      "\n\nUser's GitHub repositories:\n" +
      repos.map((r: any) => `- ${r.name}: ${r.description || 'No description'}`).join('\n')
    );
  }

  const ghHeaders = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Fetch repos sorted by most recently pushed
  const reposResp = await fetch(
    'https://api.github.com/user/repos?sort=pushed&per_page=10&affiliation=owner',
    { headers: ghHeaders },
  );
  if (!reposResp.ok) return '';
  const repos: any[] = await reposResp.json();
  if (!repos.length) return '';

  // Enrich top 3 repos with commits + README + latest release
  const enriched = await Promise.allSettled(
    repos.slice(0, 3).map(async (repo) => {
      const [commitsRes, readmeRes, releasesRes] = await Promise.allSettled([
        fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=5`, { headers: ghHeaders }),
        fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
          headers: { ...ghHeaders, Accept: 'application/vnd.github.raw+json' },
        }),
        fetch(`https://api.github.com/repos/${repo.full_name}/releases?per_page=1`, { headers: ghHeaders }),
      ]);

      let commits: string[] = [];
      if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
        const data: any[] = await commitsRes.value.json();
        commits = data.map((c) => c.commit.message.split('\n')[0]).slice(0, 5);
      }

      let readme = '';
      if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
        const raw = await readmeRes.value.text();
        readme = raw
          .replace(/```[\s\S]*?```/g, '')   // strip code blocks
          .replace(/`[^`]+`/g, '')           // strip inline code
          .replace(/!\[.*?\]\(.*?\)/g, '')   // strip images
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // unwrap links
          .replace(/#+\s*/g, '')             // strip headings
          .replace(/\n{3,}/g, '\n\n')
          .trim()
          .slice(0, 400);
      }

      let latestRelease = '';
      if (releasesRes.status === 'fulfilled' && releasesRes.value.ok) {
        const data: any[] = await releasesRes.value.json();
        if (data.length) {
          const rel = data[0];
          const body = (rel.body || '').replace(/#+\s*/g, '').replace(/\n+/g, ' ').trim().slice(0, 300);
          latestRelease = `${rel.name || rel.tag_name}${body ? ': ' + body : ''}`;
        }
      }

      return { name: repo.name, description: repo.description, commits, readme, latestRelease };
    }),
  );

  const parts = enriched
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map(({ value: { name, description, commits, readme, latestRelease } }) => {
      const lines = [`${name}${description ? ': ' + description : ''}`];
      if (readme) lines.push(`  Overview: ${readme}`);
      if (latestRelease) lines.push(`  Latest release: ${latestRelease}`);
      if (commits.length) lines.push(`  Recent commits: ${commits.join(' | ')}`);
      return lines.join('\n');
    });

  if (!parts.length) return '';
  return "\n\nUser's GitHub projects (for content context):\n" + parts.join('\n\n');
}