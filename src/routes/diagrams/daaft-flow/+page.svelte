<script lang="ts">
	// Flow Diagram: Before/After - Drift vs .faf
</script>

<svelte:head>
	<title>Daaft Flow Diagram | FAF Diagrams</title>
</svelte:head>

<div class="page">
	<div class="diagram">
		<!-- Left: Drift Loop -->
		<div class="side drift-side">
			<h3 class="side-title drift-title">Typical AI Reality</h3>

			<div class="drift-loop">
				<div class="loop-step">
					<div class="step-icon">🔍</div>
					<div class="step-label">Discover</div>
					<div class="step-desc">Scans files + scattered .md</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="step-icon">🎲</div>
					<div class="step-label">Assume</div>
					<div class="step-desc">Inconsistent parsing</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="step-icon">❓</div>
					<div class="step-label">Ask</div>
					<div class="step-desc">Needs clarification</div>
				</div>
				<div class="loop-arrow">↓</div>
				<div class="loop-step">
					<div class="step-icon">💨</div>
					<div class="step-label">Forget</div>
					<div class="step-desc">Next session = reset</div>
				</div>
				<div class="loop-arrow loop-back">↩️ repeat</div>
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

			<div class="bottom-label drift-bottom">Drift compounds every session</div>
		</div>

		<!-- Center Divider -->
		<div class="divider">
			<div class="divider-line"></div>
			<div class="divider-text">vs</div>
			<div class="divider-line"></div>
		</div>

		<!-- Right: .faf Path -->
		<div class="side faf-side">
			<h3 class="side-title faf-title">.faf Free Path</h3>

			<div class="faf-steps">
				<div class="faf-step init-step">
					<div class="step-cmd">faf init</div>
					<div class="step-time">&lt;100ms</div>
					<div class="step-what">Core tech definition</div>
					<div class="step-score init-score">20-40%</div>
				</div>
				<div class="step-arrow">↓</div>
				<div class="faf-step auto-step">
					<div class="step-cmd">faf auto</div>
					<div class="step-time">seconds</div>
					<div class="step-what">150+ frameworks, 200+ formats</div>
					<div class="step-score auto-score">~85%</div>
				</div>
				<div class="step-arrow">↓</div>
				<div class="faf-step go-step">
					<div class="step-cmd">faf go</div>
					<div class="step-time">minutes</div>
					<div class="step-what">Human context + 6 W's</div>
					<div class="step-score go-score">100%</div>
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
				<span class="trophy">🏆</span>
				<span class="score-num">100%</span>
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
		background: #f8f9fa;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.diagram {
		width: 900px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
	}

	.drift-side {
		background: #fef2f2;
		border: 1px solid #fecaca;
	}

	.faf-side {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
	}

	.side-title {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.drift-title { color: #dc2626; }
	.faf-title { color: #16a34a; }

	/* Drift loop */
	.drift-loop {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.loop-step {
		background: white;
		border: 1px solid #fecaca;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		text-align: center;
		width: 180px;
	}

	.step-icon {
		font-size: 1.2rem;
	}

	.step-label {
		font-weight: 600;
		font-size: 0.85rem;
		color: #1a1a1a;
	}

	.step-desc {
		font-size: 0.7rem;
		color: #666;
	}

	.loop-arrow {
		color: #dc2626;
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
		background: #fee2e2;
		color: #991b1b;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.6rem;
		font-family: 'SF Mono', monospace;
	}

	.chaos-q {
		color: #dc2626;
		font-weight: bold;
	}

	/* FAF steps */
	.faf-steps {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.faf-step {
		background: white;
		border-radius: 8px;
		padding: 0.6rem 1rem;
		text-align: center;
		width: 200px;
		position: relative;
	}

	.init-step { border: 2px solid #3b82f6; }
	.auto-step { border: 2px solid #00D4D4; }
	.go-step { border: 2px solid #22c55e; }

	.step-cmd {
		font-family: 'SF Mono', monospace;
		font-weight: 700;
		font-size: 0.9rem;
	}

	.init-step .step-cmd { color: #2563eb; }
	.auto-step .step-cmd { color: #0891b2; }
	.go-step .step-cmd { color: #16a34a; }

	.step-time {
		font-size: 0.65rem;
		color: #888;
	}

	.step-what {
		font-size: 0.7rem;
		color: #666;
		margin-top: 0.2rem;
	}

	.step-score {
		position: absolute;
		right: -10px;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.init-score { background: #dbeafe; color: #1d4ed8; }
	.auto-score { background: #ccfbf1; color: #0f766e; }
	.go-score { background: #dcfce7; color: #15803d; }

	.step-arrow {
		color: #22c55e;
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
		color: white;
	}

	.ai-chip.claude { background: #d97706; }
	.ai-chip.gemini { background: #2563eb; }
	.ai-chip.grok { background: #059669; }
	.ai-chip.cursor { background: #7c3aed; }

	.faf-file-icon {
		margin-top: 0.75rem;
		background: linear-gradient(135deg, #FF6B35, #ff8c5a);
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
	}

	.faf-icon-text {
		color: white;
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
	}

	.drift-badge {
		background: #fecaca;
	}

	.faf-badge {
		background: #bbf7d0;
	}

	.trophy {
		font-size: 1.5rem;
	}

	.score-num {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.drift-badge .score-num { color: #dc2626; }
	.faf-badge .score-num { color: #16a34a; }

	.score-label {
		font-size: 0.7rem;
		color: #666;
	}

	.bottom-label {
		margin-top: 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.drift-bottom { color: #dc2626; }
	.faf-bottom { color: #16a34a; }

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
		background: #e5e7eb;
	}

	.divider-text {
		color: #9ca3af;
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
		color: #FF6B35;
		text-decoration: none;
	}

	.link a:hover {
		text-decoration: underline;
	}
</style>
