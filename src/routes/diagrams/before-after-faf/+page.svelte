<script lang="ts">
	// Before/After .faf Diagram - Dark Mode
	// Shows floating components vs connected foundation
</script>

<svelte:head>
	<title>Before/After .faf | FAF Diagrams</title>
</svelte:head>

<div class="page">
	<div class="diagram">
		<!-- Left: Before .faf -->
		<div class="side before-side">
			<h3 class="side-title before-title">Before .faf</h3>

			<div class="components">
				<div class="component-box">
					<div class="component-name">Skills</div>
					<div class="component-status">Ephemeral</div>
				</div>
				<div class="component-box">
					<div class="component-name">Projects</div>
					<div class="component-status">Session-scoped</div>
				</div>
				<div class="component-box">
					<div class="component-name">MCP</div>
					<div class="component-status">Connection-only</div>
				</div>
				<div class="component-box">
					<div class="component-name">Subagents</div>
					<div class="component-status">Isolated</div>
				</div>
			</div>

			<div class="summary-box before-summary">
				<div class="summary-title">No Foundation</div>
				<div class="summary-text">Components floating independently. No persistent format. Context reinvented per session.</div>
			</div>
			<div class="question-text">AI starts from scratch here every time. Do you know where it starts..?</div>
		</div>

		<!-- Center Divider -->
		<div class="divider">
			<div class="divider-line"></div>
			<div class="divider-text">vs</div>
			<div class="divider-line"></div>
		</div>

		<!-- Right: After .faf -->
		<div class="side after-side">
			<h3 class="side-title after-title">After .faf</h3>

			<div class="components connected">
				<div class="component-box connected-box">
					<div class="component-name">Skills</div>
					<div class="component-action">Loads .faf</div>
				</div>
				<div class="connector-line"></div>
				<div class="component-box connected-box">
					<div class="component-name">Projects</div>
					<div class="component-action">Serializes .faf</div>
				</div>
				<div class="connector-line"></div>
				<div class="component-box connected-box">
					<div class="component-name">MCP</div>
					<div class="component-action">Returns .faf</div>
				</div>
				<div class="connector-line"></div>
				<div class="component-box connected-box">
					<div class="component-name">Subagents</div>
					<div class="component-action">Shares .faf</div>
				</div>
				<div class="connector-line"></div>
			</div>

			<div class="foundation-box">
				<div class="foundation-title">.faf Format Foundation</div>
				<div class="badges">
					<span class="badge">IANA-Registered</span>
					<span class="badge">Persistent</span>
					<span class="badge">Universal</span>
				</div>
			</div>
		</div>
	</div>

	<p class="instructions">Screenshot the diagram above</p>
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

	.diagram {
		width: 900px;
		background: #0a0a0a;
		border-radius: 16px;
		border: 1px solid #333;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		padding: 2rem;
		gap: 1.5rem;
	}

	/* Side panels */
	.side {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
	}

	.side-title {
		font-size: 1.2rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		width: 100%;
		text-align: center;
	}

	.before-title {
		color: #f87171;
		border-bottom: 2px solid #f87171;
	}

	.after-title {
		color: #22c55e;
		border-bottom: 2px solid #22c55e;
	}

	/* Components */
	.components {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.component-box {
		background: #1a1a1a;
		border: 1px solid #444;
		border-radius: 8px;
		padding: 0.75rem 1rem;
	}

	.connected-box {
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.component-name {
		font-weight: 600;
		font-size: 0.95rem;
		color: #f5f5f5;
	}

	.component-status {
		font-size: 0.8rem;
		color: #888;
		margin-top: 0.2rem;
	}

	.component-action {
		font-size: 0.8rem;
		color: #22c55e;
		margin-top: 0.2rem;
	}

	/* Connector lines */
	.connector-line {
		width: 2px;
		height: 12px;
		background: #22c55e;
		margin: 0 auto;
	}

	/* Summary boxes */
	.summary-box {
		margin-top: 1.5rem;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		width: 100%;
	}

	.before-summary {
		background: rgba(248, 113, 113, 0.1);
		border: 1px dashed rgba(248, 113, 113, 0.3);
	}

	.summary-title {
		font-weight: 700;
		font-size: 0.95rem;
		color: #f87171;
		margin-bottom: 0.5rem;
	}

	.summary-text {
		font-size: 0.8rem;
		color: #999;
		line-height: 1.4;
	}

	.question-text {
		margin-top: 1rem;
		font-size: 0.8rem;
		color: #666;
		font-style: italic;
		text-align: center;
	}

	/* Foundation box */
	.foundation-box {
		margin-top: 1rem;
		background: #22c55e;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		width: 100%;
	}

	.foundation-title {
		font-weight: 700;
		font-size: 1rem;
		color: #0a0a0a;
		margin-bottom: 0.75rem;
	}

	.badges {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.badge {
		background: #0a0a0a;
		color: #f5f5f5;
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	/* Divider */
	.divider {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.divider-line {
		width: 2px;
		height: 80px;
		background: #333;
	}

	.divider-text {
		color: #666;
		font-size: 0.9rem;
		font-weight: 600;
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
