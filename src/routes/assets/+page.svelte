<script lang="ts">
	// Hidden assets dashboard - no nav link, URL only
	const diagrams = [
		{
			name: 'Daaft Banner',
			url: '/diagrams/daaft-banner',
			description: '5:2 X Article header - package.json for context'
		},
		{
			name: 'Daaft Flow',
			url: '/diagrams/daaft-flow',
			description: 'DAAFT vs SMART flow comparison'
		}
	];

	const externalAssets = [
		{
			name: 'Bi-sync Demo',
			type: 'GIF',
			description: 'Live bi-sync in action'
		},
		{
			name: 'FAF ASCII Art',
			type: 'GIF',
			description: 'ASCII animation'
		},
		{
			name: 'CLI Init 100%',
			type: 'GIF',
			description: 'faf init to Gold Code'
		},
		{
			name: 'Claude Code Demo',
			type: 'GIF',
			description: '.faf in Claude Code'
		}
	];
</script>

<svelte:head>
	<title>Assets | FAF (Hidden)</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="page">
	<div class="header">
		<div class="badge">Hidden Dashboard</div>
		<h1>FAF Visual Assets</h1>
		<p class="subtitle">Diagrams, GIFs, screenshots — all in one place</p>
	</div>

	<section class="section">
		<h2>Live Diagrams</h2>
		<p class="section-desc">Click to open, screenshot as needed</p>
		<div class="grid">
			{#each diagrams as item}
				<a href={item.url} class="card">
					<div class="card-type">DIAGRAM</div>
					<h3>{item.name}</h3>
					<p>{item.description}</p>
					<div class="card-url">{item.url}</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Local Assets</h2>
		<p class="section-desc">GIFs and screenshots in FAF-GOLD</p>
		<div class="grid">
			{#each externalAssets as item}
				<div class="card local">
					<div class="card-type">{item.type}</div>
					<h3>{item.name}</h3>
					<p>{item.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2>Quick Reference</h2>
		<div class="reference">
			<div class="ref-item">
				<span class="ref-label">Full Index:</span>
				<code>FAF-GOLD/PLANET-FAF/docs/VISUAL-ASSETS-INDEX.md</code>
			</div>
			<div class="ref-item">
				<span class="ref-label">Screenshots:</span>
				<code>~/2026-Misc/</code>
			</div>
			<div class="ref-item">
				<span class="ref-label">GIFs:</span>
				<code>FAF-GOLD/PLANET-FAF/</code>
			</div>
		</div>
	</section>

	<footer class="footer">
		<p>This page is unlisted. No navigation links point here.</p>
	</footer>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #0a0a0a;
		padding: 3rem 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		color: #f5f5f5;
	}

	.header {
		max-width: 900px;
		margin: 0 auto 3rem auto;
	}

	.badge {
		display: inline-block;
		background: #1a1a1a;
		border: 1px solid #333;
		color: #888;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #888;
		font-size: 1.1rem;
	}

	.section {
		max-width: 900px;
		margin: 0 auto 3rem auto;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: #22c55e;
	}

	.section-desc {
		color: #666;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.card {
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 12px;
		padding: 1.25rem;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s, transform 0.2s;
	}

	.card:hover {
		border-color: #22c55e;
		transform: translateY(-2px);
	}

	.card.local {
		opacity: 0.7;
		cursor: default;
	}

	.card.local:hover {
		transform: none;
		border-color: #333;
	}

	.card-type {
		font-size: 0.65rem;
		font-weight: 700;
		color: #22c55e;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.card h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.card p {
		color: #888;
		font-size: 0.85rem;
	}

	.card-url {
		margin-top: 0.75rem;
		font-family: 'SF Mono', monospace;
		font-size: 0.7rem;
		color: #666;
	}

	.reference {
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 12px;
		padding: 1.25rem;
	}

	.ref-item {
		display: flex;
		gap: 1rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid #222;
	}

	.ref-item:last-child {
		border-bottom: none;
	}

	.ref-label {
		font-weight: 600;
		color: #888;
		min-width: 100px;
	}

	code {
		font-family: 'SF Mono', monospace;
		font-size: 0.8rem;
		color: #22c55e;
	}

	.footer {
		max-width: 900px;
		margin: 3rem auto 0 auto;
		text-align: center;
	}

	.footer p {
		color: #444;
		font-size: 0.8rem;
	}
</style>
