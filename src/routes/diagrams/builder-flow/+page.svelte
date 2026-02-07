<script lang="ts">
	// builder.faf.one - DOUBLE-WHAMMY Flow
	// Shows: User → GitHub API → Rust WASM → Zig WASM → Preview → Download/Commit
</script>

<svelte:head>
	<title>builder.faf.one - DOUBLE-WHAMMY Architecture | FAF Diagrams</title>
</svelte:head>

<div class="page">
	<div class="header">
		<h1>builder.faf.one</h1>
		<p class="subtitle">DOUBLE-WHAMMY Architecture</p>
		<p class="tagline">Rust WASM (211KB) + Zig WASM (2.7KB) = Championship-grade .faf generation</p>
	</div>

	<div class="diagram">
		<!-- Step 1: User Input -->
		<div class="flow-step">
			<div class="step-number">1</div>
			<div class="step-box input-box">
				<div class="step-icon">👤</div>
				<div class="step-title">User Input</div>
				<div class="step-desc">Paste GitHub URL</div>
				<div class="step-example">github.com/user/repo</div>
			</div>
		</div>

		<div class="flow-arrow">→</div>

		<!-- Step 2: GitHub API -->
		<div class="flow-step">
			<div class="step-number">2</div>
			<div class="step-box github-box">
				<div class="step-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
					</svg>
				</div>
				<div class="step-title">GitHub API</div>
				<div class="step-desc">Fetch metadata</div>
				<div class="step-meta">
					<span class="meta-item">README.md</span>
					<span class="meta-item">package.json</span>
					<span class="meta-item">description</span>
				</div>
			</div>
		</div>

		<div class="flow-arrow">→</div>

		<!-- Step 3: Rust WASM -->
		<div class="flow-step highlight-step">
			<div class="step-number">3</div>
			<div class="step-box rust-box">
				<div class="step-icon wasm-icon">🦀</div>
				<div class="step-title rust-title">Rust WASM</div>
				<div class="step-desc">Generate .faf</div>
				<div class="wasm-stats">
					<div class="stat-row">
						<span class="stat-label">Size:</span>
						<span class="stat-value">211KB</span>
					</div>
					<div class="stat-row">
						<span class="stat-label">Speed:</span>
						<span class="stat-value">~3ms</span>
					</div>
				</div>
				<div class="step-features">
					<div class="feature-tag">Multi-language</div>
					<div class="feature-tag">Type detection</div>
				</div>
			</div>
		</div>

		<div class="flow-arrow">→</div>

		<!-- Step 4: Zig WASM -->
		<div class="flow-step highlight-step">
			<div class="step-number">4</div>
			<div class="step-box zig-box">
				<div class="step-icon wasm-icon">⚡</div>
				<div class="step-title zig-title">Zig WASM</div>
				<div class="step-desc">Score AI-readiness</div>
				<div class="wasm-stats">
					<div class="stat-row">
						<span class="stat-label">Size:</span>
						<span class="stat-value">2.7KB</span>
					</div>
					<div class="stat-row">
						<span class="stat-label">Speed:</span>
						<span class="stat-value">~14μs</span>
					</div>
				</div>
				<div class="step-features">
					<div class="feature-tag zig-tag">71K scores/sec</div>
				</div>
			</div>
		</div>

		<div class="flow-arrow">→</div>

		<!-- Step 5: Preview -->
		<div class="flow-step">
			<div class="step-number">5</div>
			<div class="step-box preview-box">
				<div class="step-icon">📊</div>
				<div class="step-title">Preview</div>
				<div class="step-desc">Show results</div>
				<div class="preview-display">
					<div class="preview-score">
						<span class="score-value">89%</span>
						<span class="score-tier">🥉</span>
					</div>
					<div class="preview-file">project.faf</div>
				</div>
			</div>
		</div>

		<div class="flow-arrow">→</div>

		<!-- Step 6: Output -->
		<div class="flow-step">
			<div class="step-number">6</div>
			<div class="step-box output-box">
				<div class="step-icon">✅</div>
				<div class="step-title">Output</div>
				<div class="step-desc">User choice</div>
				<div class="output-options">
					<div class="output-btn download-btn">
						<span class="btn-icon">⬇️</span>
						<span class="btn-text">Download</span>
					</div>
					<div class="output-btn commit-btn">
						<span class="btn-icon">📝</span>
						<span class="btn-text">Commit (OAuth)</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Tech Summary -->
	<div class="tech-summary">
		<div class="summary-title">DOUBLE-WHAMMY Specs</div>
		<div class="summary-grid">
			<div class="summary-item">
				<div class="summary-label">Total Bundle</div>
				<div class="summary-value">213.7KB</div>
			</div>
			<div class="summary-item">
				<div class="summary-label">End-to-End</div>
				<div class="summary-value">&lt;100ms</div>
			</div>
			<div class="summary-item">
				<div class="summary-label">Cached</div>
				<div class="summary-value">Forever</div>
			</div>
			<div class="summary-item">
				<div class="summary-label">Languages</div>
				<div class="summary-value">15+</div>
			</div>
		</div>
	</div>

	<p class="instructions">Screenshot the diagram above for presentations</p>
	<p class="link">Live at: <a href="https://builder.faf.one">builder.faf.one</a></p>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #0a0a0a;
		padding: 3rem 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #FF6B35;
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		font-size: 1.2rem;
		font-weight: 600;
		color: #f5f5f5;
		margin: 0 0 0.5rem 0;
	}

	.tagline {
		font-size: 0.9rem;
		color: #999;
		margin: 0;
	}

	/* Main Diagram */
	.diagram {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		background: #1a1a1a;
		border-radius: 16px;
		border: 1px solid #333;
		overflow-x: auto;
		max-width: 100%;
	}

	.flow-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.highlight-step {
		position: relative;
	}

	.highlight-step::before {
		content: '';
		position: absolute;
		inset: -8px;
		border-radius: 12px;
		background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05));
		z-index: -1;
	}

	.step-number {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: #FF6B35;
		color: #0a0a0a;
		font-size: 0.85rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.step-box {
		background: #0a0a0a;
		border: 1px solid #444;
		border-radius: 12px;
		padding: 1rem;
		width: 180px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.input-box {
		border-color: #666;
	}

	.github-box {
		border-color: #6e5494;
	}

	.rust-box {
		border: 2px solid #CE422B;
		background: linear-gradient(135deg, #0a0a0a, #1a0a0a);
	}

	.zig-box {
		border: 2px solid #f7a41d;
		background: linear-gradient(135deg, #0a0a0a, #1a1000);
	}

	.preview-box {
		border-color: #00D4D4;
	}

	.output-box {
		border-color: #4ade80;
	}

	.step-icon {
		font-size: 2rem;
	}

	.wasm-icon {
		font-size: 2.5rem;
	}

	.step-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: #f5f5f5;
	}

	.rust-title {
		color: #CE422B;
	}

	.zig-title {
		color: #f7a41d;
	}

	.step-desc {
		font-size: 0.75rem;
		color: #999;
	}

	.step-example {
		font-family: 'SF Mono', monospace;
		font-size: 0.65rem;
		color: #aaa;
		background: #1a1a1a;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		margin-top: 0.25rem;
	}

	/* GitHub meta items */
	.step-meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.25rem;
	}

	.meta-item {
		font-family: 'SF Mono', monospace;
		font-size: 0.65rem;
		color: #999;
		background: #1a1a1a;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
	}

	/* WASM Stats */
	.wasm-stats {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
		margin-top: 0.25rem;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #1a1a1a;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
	}

	.stat-label {
		font-size: 0.7rem;
		color: #999;
	}

	.stat-value {
		font-family: 'SF Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		color: #f5f5f5;
	}

	/* Feature Tags */
	.step-features {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		justify-content: center;
		margin-top: 0.25rem;
	}

	.feature-tag {
		background: #FF6B35;
		color: #0a0a0a;
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
	}

	.zig-tag {
		background: #f7a41d;
	}

	/* Preview Display */
	.preview-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.preview-score {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #1a1a1a;
		padding: 0.5rem 1rem;
		border-radius: 8px;
	}

	.score-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #00D4D4;
	}

	.score-tier {
		font-size: 1.5rem;
	}

	.preview-file {
		font-family: 'SF Mono', monospace;
		font-size: 0.7rem;
		color: #4ade80;
		background: #1a1a1a;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	/* Output Options */
	.output-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		margin-top: 0.25rem;
	}

	.output-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #1a1a1a;
		border: 1px solid #444;
		padding: 0.4rem 0.6rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.output-btn:hover {
		border-color: #FF6B35;
		transform: translateY(-1px);
	}

	.download-btn {
		border-color: #00D4D4;
	}

	.commit-btn {
		border-color: #4ade80;
	}

	.btn-icon {
		font-size: 1rem;
	}

	.btn-text {
		font-size: 0.7rem;
		font-weight: 600;
		color: #f5f5f5;
	}

	/* Flow Arrow */
	.flow-arrow {
		color: #FF6B35;
		font-size: 1.5rem;
		font-weight: bold;
	}

	/* Tech Summary */
	.tech-summary {
		margin-top: 2rem;
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 12px;
		padding: 1.5rem;
		width: 600px;
	}

	.summary-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: #FF6B35;
		text-align: center;
		margin-bottom: 1rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.summary-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		background: #0a0a0a;
		border: 1px solid #444;
		padding: 0.75rem;
		border-radius: 8px;
	}

	.summary-label {
		font-size: 0.7rem;
		color: #999;
		text-align: center;
	}

	.summary-value {
		font-family: 'SF Mono', monospace;
		font-size: 0.9rem;
		font-weight: 700;
		color: #f5f5f5;
	}

	/* Instructions */
	.instructions {
		color: #999;
		font-size: 0.85rem;
		margin-top: 2rem;
		text-align: center;
	}

	.link {
		color: #aaa;
		font-size: 0.85rem;
		margin-top: 0.5rem;
		text-align: center;
	}

	.link a {
		color: #FF6B35;
		text-decoration: none;
	}

	.link a:hover {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 1200px) {
		.diagram {
			flex-direction: column;
			gap: 1.5rem;
		}

		.flow-arrow {
			transform: rotate(90deg);
		}

		.summary-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.tech-summary {
			width: 100%;
			max-width: 400px;
		}
	}
</style>
