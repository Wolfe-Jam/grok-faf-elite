<script lang="ts">
	// Flow Diagram: Before/After - Drift vs .faf
	// Palette: Black/white base, green for FAF, brand colors for AI logos only
</script>

<svelte:head>
	<title>Daaft Flow Diagram | FAF Diagrams</title>
</svelte:head>

<div class="page">
	<div class="diagram">
		<!-- Left: Drift Loop -->
		<div class="side drift-side">
			<h3 class="side-title">DAAFT Flow</h3>

			<div class="drift-loop">
				<div class="loop-step">
					<div class="step-label">Discover</div>
					<div class="step-desc">Scans files + scattered .md</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="step-label">Assume</div>
					<div class="step-desc">Inconsistent parsing</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="step-label">Ask</div>
					<div class="step-desc">Needs clarification</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="step-label">Forget</div>
					<div class="step-desc">Next session = reset</div>
				</div>
				<div class="loop-arrow loop-back">↩ repeat</div>
			</div>

			<div class="chaos-files">
				<span class="chaos-file">README.md</span>
				<span class="chaos-file">CLAUDE.md</span>
				<span class="chaos-file">arch.md</span>
				<span class="chaos-q">?</span>
				<span class="chaos-q">?</span>
			</div>

			<div class="score-badge drift-badge">
				<span class="score-num">20-40%</span>
				<span class="score-label">Variable</span>
			</div>

			<div class="bottom-label">Drift compounds every session</div>
		</div>

		<!-- Center Divider -->
		<div class="divider">
			<div class="divider-line"></div>
			<div class="divider-text">vs</div>
			<div class="divider-line"></div>
		</div>

		<!-- Right: .faf Path -->
		<div class="side faf-side">
			<h3 class="side-title faf-title">SMART Flow</h3>

			<div class="faf-steps">
				<div class="faf-row">
					<div class="faf-step">
						<div class="step-cmd">faf init</div>
						<div class="step-time">&lt;100ms</div>
						<div class="step-what">Core tech definition</div>
					</div>
					<div class="score-circle">20-40%</div>
				</div>
				<div class="step-arrow">↓</div>
				<div class="faf-row">
					<div class="faf-step">
						<div class="step-cmd">faf auto</div>
						<div class="step-time">seconds</div>
						<div class="step-what">150+ frameworks, 200+ formats</div>
					</div>
					<div class="score-circle">~85%</div>
				</div>
				<div class="step-arrow">↓</div>
				<div class="faf-row">
					<div class="faf-step final-step">
						<div class="step-cmd">faf go</div>
						<div class="step-time">minutes</div>
						<div class="step-what">Human context + 6 W's</div>
					</div>
					<div class="score-circle final-circle">100%</div>
				</div>
			</div>

			<div class="ai-row">
				<div class="ai-chip claude">Claude</div>
				<div class="ai-chip gemini">Gemini</div>
				<div class="ai-chip grok">Grok</div>
				<div class="ai-chip cursor">Cursor</div>
			</div>

			<div class="faf-file-icon">
				<span class="faf-icon-text">.faf</span>
			</div>

			<div class="score-badge faf-badge">
				<span class="score-num faf-score">100%</span>
				<span class="score-label">Zero Drift</span>
			</div>

			<div class="bottom-label faf-bottom">Locked forever</div>
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
		border-radius: 12px;
		background: #1a1a1a;
		border: 1px solid #333;
	}

	.drift-side {
		/* No special color - just dark */
	}

	.faf-side {
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.side-title {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #888;
	}

	.faf-title {
		color: #22c55e;
	}

	/* Drift loop */
	.drift-loop {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.loop-step {
		background: #0a0a0a;
		border: 1px solid #444;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		text-align: center;
		width: 180px;
	}

	.step-label {
		font-weight: 600;
		font-size: 0.85rem;
		color: #f5f5f5;
	}

	.step-desc {
		font-size: 0.7rem;
		color: #666;
	}

	.loop-arrow {
		color: #666;
		font-size: 1rem;
	}

	.loop-back {
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}

	.chaos-files {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		justify-content: center;
		margin-top: 1rem;
	}

	.chaos-file {
		background: #0a0a0a;
		border: 1px solid #444;
		color: #888;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.6rem;
		font-family: 'SF Mono', monospace;
	}

	.chaos-q {
		color: #666;
		font-weight: bold;
	}

	/* FAF steps */
	.faf-steps {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.faf-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.faf-step {
		background: #0a0a0a;
		border: 1px solid #444;
		border-radius: 8px;
		padding: 0.6rem 1rem;
		text-align: center;
		width: 180px;
	}

	.final-step {
		border: 1px solid rgba(34, 197, 94, 0.5);
	}

	.step-cmd {
		font-family: 'SF Mono', monospace;
		font-weight: 700;
		font-size: 0.9rem;
		color: #f5f5f5;
	}

	.final-step .step-cmd {
		color: #22c55e;
	}

	.step-time {
		font-size: 0.65rem;
		color: #666;
	}

	.step-what {
		font-size: 0.7rem;
		color: #888;
		margin-top: 0.2rem;
	}

	.score-circle {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: #1a1a1a;
		border: 2px solid #444;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: 700;
		color: #f5f5f5;
	}

	.final-circle {
		background: rgba(34, 197, 94, 0.1);
		border: 2px solid #22c55e;
		color: #22c55e;
	}

	.step-arrow {
		color: #666;
		font-size: 1.2rem;
		font-weight: bold;
	}

	/* AI row */
	.ai-row {
		display: flex;
		gap: 0.4rem;
		margin-top: 1rem;
	}

	.ai-chip {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.65rem;
		font-weight: 600;
	}

	/* Claude = Orange */
	.ai-chip.claude {
		background: #f59e0b;
		color: #0a0a0a;
	}

	/* Gemini = Blue */
	.ai-chip.gemini {
		background: #3b82f6;
		color: white;
	}

	/* Grok = White text on black */
	.ai-chip.grok {
		background: #0a0a0a;
		color: #f5f5f5;
		border: 1px solid #444;
	}

	/* Cursor = Black text on white */
	.ai-chip.cursor {
		background: #f5f5f5;
		color: #0a0a0a;
	}

	.faf-file-icon {
		margin-top: 0.75rem;
		background: #22c55e;
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
	}

	.faf-icon-text {
		color: #0a0a0a;
		font-family: 'SF Mono', monospace;
		font-weight: 700;
		font-size: 0.9rem;
	}

	/* Score badges */
	.score-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		margin-top: 1rem;
		background: #0a0a0a;
		border: 1px solid #444;
	}

	.drift-badge {
		/* Default dark style */
	}

	.faf-badge {
		border: 1px solid rgba(34, 197, 94, 0.5);
	}

	.score-num {
		font-size: 1.2rem;
		font-weight: 700;
		color: #f5f5f5;
	}

	.faf-score {
		color: #22c55e;
	}

	.score-label {
		font-size: 0.7rem;
		color: #666;
	}

	.bottom-label {
		margin-top: 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: #666;
	}

	.faf-bottom {
		color: #22c55e;
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
		height: 100px;
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
