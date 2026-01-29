<script lang="ts">
	const diagrams = [
		{
			slug: 'daaft-banner',
			title: 'Daaft Banner',
			description: '5:2 banner for X Article - Drift to Zero-Drift progression'
		},
		{
			slug: 'daaft-flow',
			title: 'Daaft Flow Diagram',
			description: 'Before/After comparison - DAAFT vs SMART flow'
		},
		{
			slug: 'before-after-faf',
			title: 'Before/After .faf',
			description: 'Components floating vs connected foundation'
		}
	];
</script>

<svelte:head>
	<title>Diagrams | FAF</title>
</svelte:head>

<div class="page">
	<h1>FAF Diagrams</h1>
	<p class="subtitle">Screenshot-ready visuals for documentation and social</p>

	<div class="grid">
		{#each diagrams as diagram}
			<a href="/diagrams/{diagram.slug}" class="card">
				<h2>{diagram.title}</h2>
				<p>{diagram.description}</p>
			</a>
		{/each}
	</div>

	<a href="/" class="back">← Back to Home</a>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #0a0a0a;
		padding: 3rem 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		color: #f5f5f5;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #888;
		margin-bottom: 2rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
		max-width: 900px;
	}

	.card {
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 12px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s, transform 0.2s;
	}

	.card:hover {
		border-color: #FF6B35;
		transform: translateY(-2px);
	}

	.card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #FF6B35;
		margin-bottom: 0.5rem;
	}

	.card p {
		color: #888;
		font-size: 0.9rem;
	}

	.back {
		display: inline-block;
		margin-top: 2rem;
		color: #FF6B35;
		text-decoration: none;
	}

	.back:hover {
		text-decoration: underline;
	}
</style>
