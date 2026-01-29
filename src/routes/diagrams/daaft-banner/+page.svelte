<script lang="ts">
	// Banner: 5:2 aspect ratio (1000x400 for X Articles)
	// Palette: Black/white base, green for FAF, brand colors for AI logos only
</script>

<svelte:head>
	<title>Daaft Banner | FAF Diagrams</title>
</svelte:head>

<div class="page">
	<div class="banner">
		<!-- Left: Drift chaos -->
		<div class="drift-side">
			<div class="drift-files">
				<div class="md-file md-light drift-1">README.md</div>
				<div class="md-file md-outline drift-2">CLAUDE.md</div>
				<div class="md-file md-mid drift-3">architecture.md</div>
				<div class="md-file md-outline drift-4">requirements.md</div>
			</div>
			<div class="drift-arrows">
				<span class="drift-arrow">?</span>
				<span class="drift-arrow">?</span>
				<span class="drift-arrow">?</span>
			</div>
			<div class="drift-label">Context Drift</div>
		</div>

		<!-- Center: .faf file -->
		<div class="center">
			<div class="faf-glow"></div>
			<div class="faf-icon">
				<div class="faf-label">.faf</div>
				<div class="faf-sublabel">Project DNA</div>
			</div>
			<!-- Progress arc -->
			<div class="progress-arc">
				<div class="arc-step">
					<span class="arc-percent">20-40%</span>
					<span class="arc-cmd">init</span>
				</div>
				<div class="arc-arrow">→</div>
				<div class="arc-step">
					<span class="arc-percent">~85%</span>
					<span class="arc-cmd">auto</span>
				</div>
				<div class="arc-arrow">→</div>
				<div class="arc-step final">
					<span class="arc-percent">100%</span>
					<span class="arc-cmd">go</span>
				</div>
			</div>
		</div>

		<!-- Right: AI logos synced -->
		<div class="sync-side">
			<div class="ai-logos">
				<div class="ai-logo claude">Claude</div>
				<div class="ai-logo gemini">Gemini</div>
				<div class="ai-logo grok">Grok</div>
				<div class="ai-logo cursor">Cursor</div>
			</div>
			<div class="sync-label">Zero Drift</div>
		</div>

		<!-- Bottom overlay text -->
		<div class="overlay-text">
			<div class="tagline-top">You don't have 5 package.json files. Why 5 .md files for context?</div>
			<div class="tagline-bottom">project.faf — the package.json for AI. Free forever.</div>
		</div>
	</div>

	<p class="instructions">Screenshot the banner above (1000x400)</p>
	<p class="link">Article: <a href="https://www.faf.one/blog/daaft">faf.one/blog/daaft</a></p>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #1a1a1a;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.banner {
		width: 1000px;
		height: 400px;
		background: #0a0a0a;
		border-radius: 12px;
		display: grid;
		grid-template-columns: 1fr 1.5fr 1fr;
		position: relative;
		overflow: hidden;
		border: 1px solid #333;
	}

	/* Left side - Drift */
	.drift-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.drift-files {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.md-file {
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-family: 'SF Mono', monospace;
	}

	/* Light variant - brighter background */
	.md-file.md-light {
		background: #2a2a2a;
		border: 1px solid #555;
		color: #ccc;
	}

	/* Outline variant - white border */
	.md-file.md-outline {
		background: #0a0a0a;
		border: 1px solid #f5f5f5;
		color: #f5f5f5;
	}

	/* Mid variant - medium gray */
	.md-file.md-mid {
		background: #1a1a1a;
		border: 1px solid #666;
		color: #aaa;
	}

	.drift-1 { transform: rotate(-3deg) translateX(-5px); }
	.drift-2 { transform: rotate(2deg) translateX(8px); }
	.drift-3 { transform: rotate(-2deg) translateX(-3px); }
	.drift-4 { transform: rotate(4deg) translateX(5px); }

	.drift-arrows {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0 0.5rem;
	}

	.drift-arrow {
		color: #666;
		font-size: 1.2rem;
		font-weight: bold;
		animation: drift-pulse 1.5s ease-in-out infinite;
	}

	.drift-arrow:nth-child(2) { animation-delay: 0.3s; }
	.drift-arrow:nth-child(3) { animation-delay: 0.6s; }

	@keyframes drift-pulse {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 1; }
	}

	.drift-label {
		color: #666;
		font-size: 0.9rem;
		font-weight: 600;
		margin-top: 0.5rem;
	}

	/* Center - .faf */
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.faf-glow {
		position: absolute;
		width: 120px;
		height: 120px;
		background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%);
		border-radius: 50%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -70%);
	}

	.faf-icon {
		background: #22c55e;
		padding: 1.5rem 2rem;
		border-radius: 12px;
		text-align: center;
		box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
		position: relative;
		z-index: 1;
	}

	.faf-label {
		color: #0a0a0a;
		font-size: 2rem;
		font-weight: bold;
		font-family: 'SF Mono', monospace;
	}

	.faf-sublabel {
		color: rgba(0, 0, 0, 0.7);
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}

	.progress-arc {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		background: #1a1a1a;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border: 1px solid #333;
	}

	.arc-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		background: #0a0a0a;
		border: 1px solid #333;
	}

	.arc-step.final {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.5);
	}

	.arc-percent {
		font-size: 0.9rem;
		font-weight: bold;
		color: #f5f5f5;
	}

	.arc-step.final .arc-percent {
		color: #22c55e;
	}

	.arc-cmd {
		font-size: 0.65rem;
		font-family: 'SF Mono', monospace;
		color: #666;
	}

	.arc-arrow {
		color: #aaa;
		font-size: 1.2rem;
		font-weight: bold;
	}

	/* Right side - Sync */
	.sync-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.ai-logos {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.ai-logo {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		text-align: center;
	}

	/* Claude = Orange */
	.ai-logo.claude {
		background: #f59e0b;
		color: #0a0a0a;
	}

	/* Gemini = Blue */
	.ai-logo.gemini {
		background: #3b82f6;
		color: white;
	}

	/* Grok = White text on black with white outline */
	.ai-logo.grok {
		background: #0a0a0a;
		color: #f5f5f5;
		border: 1px solid #f5f5f5;
	}

	/* Cursor = Black text on white */
	.ai-logo.cursor {
		background: #f5f5f5;
		color: #0a0a0a;
	}

	.sync-label {
		color: #22c55e;
		font-size: 0.9rem;
		font-weight: 600;
		margin-top: 1rem;
	}

	/* Overlay text */
	.overlay-text {
		position: absolute;
		bottom: 0.75rem;
		left: 0;
		right: 0;
		text-align: center;
	}

	.tagline-top {
		color: #f5f5f5;
		font-size: 1rem;
		font-weight: 600;
	}

	.tagline-bottom {
		color: #22c55e;
		font-size: 0.9rem;
		font-weight: 600;
		margin-top: 0.25rem;
	}

	/* Instructions */
	.instructions {
		color: #666;
		font-size: 0.85rem;
		margin-top: 1.5rem;
	}

	.link {
		color: #888;
		font-size: 0.85rem;
		margin-top: 0.5rem;
	}

	.link a {
		color: #22c55e;
		text-decoration: none;
	}

	.link a:hover {
		text-decoration: underline;
	}
</style>
