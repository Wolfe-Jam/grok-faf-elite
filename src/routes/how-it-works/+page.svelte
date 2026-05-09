<script lang="ts">
	// "How is this scored?" — the transparency page that turns "FAF don't lie"
	// into a falsifiable receipt. Source of truth: ~/FAF/cli/src/core/slots.ts
	// + scorer.ts + tiers.ts. Every number on this page traces back to a
	// public file in the faf-cli repo. Run faf-cli locally → same answer.
</script>

<svelte:head>
	<title>How is this scored? — builder.faf.one</title>
	<meta property="og:title" content="How FAF scores your repo — the rubric, the math, the source code" />
	<meta property="og:description" content="33 slots. App-type-aware. Deterministic. WASM-scored. Anyone can run faf-cli locally and get the same number. FAF don't lie." />
	<meta property="og:image" content="https://mcpaas.live/og/Wolfe-Jam/faf-cli.png" />
	<meta name="twitter:title" content="How FAF scores your repo" />
	<meta name="twitter:image" content="https://mcpaas.live/og/Wolfe-Jam/faf-cli.png" />
</svelte:head>

<main class="min-h-screen bg-background text-foreground p-6 md:p-12 max-w-4xl mx-auto">
	<!-- Top nav back to scorer -->
	<nav class="text-sm mb-12 opacity-70">
		<a href="/" class="hover:opacity-100 transition-opacity">← back to builder.faf.one</a>
	</nav>

	<!-- Hero -->
	<header class="mb-16">
		<h1 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
			How is this scored?
		</h1>
		<p class="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
			33 canonical slots. App-type-aware. WASM-scored. Deterministic.
			Anyone can run <code class="text-orange-400 font-mono text-base">faf-cli</code>
			locally and reproduce the same number — no API keys, no opinions, no AI judgment.
		</p>
		<p class="text-lg text-orange-400 italic">
			<strong>FAF don't lie.</strong>
		</p>
	</header>

	<!-- The math, briefly -->
	<section class="mb-16">
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">The math</h2>
		<div class="bg-black/40 border border-white/10 rounded-lg p-6 mb-6 font-mono text-base md:text-lg">
			score = (populated_slots / active_slots) × 100
		</div>
		<p class="text-muted-foreground leading-relaxed mb-3">
			Score caps at <strong class="text-orange-400">100% (Trophy 🏆)</strong>. No half-points, no bonus
			rounds, no AI grading — just division. Every project gets the same rubric;
			the rubric never moves.
		</p>
		<p class="text-muted-foreground leading-relaxed">
			"Populated" means a slot has a real value. Empty strings, <code class="font-mono text-orange-400">null</code>,
			<code class="font-mono text-orange-400">"n/a"</code>,
			<code class="font-mono text-orange-400">"describe your project goal"</code> and other known placeholders are
			explicitly excluded — see <a href="https://github.com/Wolfe-Jam/faf-cli/blob/main/src/core/slots.ts" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">slots.ts</a> for the full placeholder list.
		</p>
	</section>

	<!-- The 33 slots -->
	<section class="mb-16">
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">The 33 slots</h2>
		<p class="text-muted-foreground mb-8 leading-relaxed">
			Eight categories. Every category answers a question an AI tool needs answered before it
			can be useful in your repo. Source:
			<a href="https://github.com/Wolfe-Jam/faf-cli/blob/main/src/core/slots.ts" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">
				faf-cli/src/core/slots.ts
			</a>.
		</p>

		<div class="space-y-6">
			<div class="border border-white/10 rounded-lg p-5">
				<h3 class="text-lg font-bold text-orange-400 mb-2">Project Meta (3)</h3>
				<ul class="text-muted-foreground space-y-1">
					<li>1. <code class="font-mono text-foreground">project.name</code> — Project name</li>
					<li>2. <code class="font-mono text-foreground">project.goal</code> — Goal (use case)</li>
					<li>3. <code class="font-mono text-foreground">project.main_language</code> — Primary language</li>
				</ul>
			</div>

			<div class="border border-white/10 rounded-lg p-5">
				<h3 class="text-lg font-bold text-orange-400 mb-2">Human Context — the 6 W's (6)</h3>
				<ul class="text-muted-foreground space-y-1">
					<li>4. <code class="font-mono text-foreground">human_context.who</code> — Who is this for?</li>
					<li>5. <code class="font-mono text-foreground">human_context.what</code> — What are they building?</li>
					<li>6. <code class="font-mono text-foreground">human_context.why</code> — Why does it exist?</li>
					<li>7. <code class="font-mono text-foreground">human_context.where</code> — Where does it run?</li>
					<li>8. <code class="font-mono text-foreground">human_context.when</code> — When was it started?</li>
					<li>9. <code class="font-mono text-foreground">human_context.how</code> — How is it built?</li>
				</ul>
			</div>

			<div class="border border-white/10 rounded-lg p-5">
				<h3 class="text-lg font-bold text-cyan-400 mb-2">Frontend Stack (4)</h3>
				<ul class="text-muted-foreground space-y-1">
					<li>10. <code class="font-mono text-foreground">stack.frontend</code> — Framework (React, Svelte, etc.)</li>
					<li>11. <code class="font-mono text-foreground">stack.css_framework</code> — CSS framework</li>
					<li>12. <code class="font-mono text-foreground">stack.ui_library</code> — UI component library</li>
					<li>13. <code class="font-mono text-foreground">stack.state_management</code> — State management</li>
				</ul>
			</div>

			<div class="border border-white/10 rounded-lg p-5">
				<h3 class="text-lg font-bold text-cyan-400 mb-2">Backend Stack (5)</h3>
				<ul class="text-muted-foreground space-y-1">
					<li>14. <code class="font-mono text-foreground">stack.backend</code> — Backend framework</li>
					<li>15. <code class="font-mono text-foreground">stack.api_type</code> — API style (REST, GraphQL, etc.)</li>
					<li>16. <code class="font-mono text-foreground">stack.runtime</code> — Runtime (Node, Bun, Python)</li>
					<li>17. <code class="font-mono text-foreground">stack.database</code> — Database</li>
					<li>18. <code class="font-mono text-foreground">stack.connection</code> — Connection method</li>
				</ul>
			</div>

			<div class="border border-white/10 rounded-lg p-5">
				<h3 class="text-lg font-bold text-foreground mb-2">Universal Stack (3)</h3>
				<ul class="text-muted-foreground space-y-1">
					<li>19. <code class="font-mono text-foreground">stack.hosting</code> — Hosting platform</li>
					<li>20. <code class="font-mono text-foreground">stack.build</code> — Build tool</li>
					<li>21. <code class="font-mono text-foreground">stack.cicd</code> — CI/CD</li>
				</ul>
			</div>

			<div class="border border-white/10 rounded-lg p-5 opacity-80">
				<h3 class="text-lg font-bold text-muted-foreground mb-2">Enterprise tiers (12) — slots 22–33</h3>
				<p class="text-muted-foreground text-sm mb-3">
					Monorepo / Admin / Cache / Search / Storage / Versioning / Shared configs /
					Remote build cache. Active for enterprise app types only.
				</p>
				<a href="https://github.com/Wolfe-Jam/faf-cli/blob/main/src/core/slots.ts#L33" class="text-cyan-400 hover:underline text-sm" target="_blank" rel="noopener">
					see all 12 →
				</a>
			</div>
		</div>
	</section>

	<!-- App-type-aware -->
	<section class="mb-16">
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">App-type-aware</h2>
		<p class="text-muted-foreground mb-6 leading-relaxed">
			A CLI doesn't need a frontend. A mobile app doesn't need a database. The app type
			determines which slots are <strong class="text-foreground">active</strong> for scoring —
			only active slots are counted in the denominator. This is why a CLI scoring 100%
			at 12 slots is the same Trophy as a monorepo scoring 100% at 33 slots: <em>both filled
			what was relevant to them.</em>
		</p>

		<div class="overflow-x-auto">
			<table class="w-full text-sm md:text-base">
				<thead class="border-b border-white/20">
					<tr class="text-left">
						<th class="py-3 pr-4 font-semibold">App type</th>
						<th class="py-3 pr-4 font-semibold">Active slots</th>
						<th class="py-3 font-semibold">Categories</th>
					</tr>
				</thead>
				<tbody class="text-muted-foreground">
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono text-foreground">documentation</td>
						<td class="py-3 pr-4">9</td>
						<td class="py-3">project + human</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono text-foreground">cli, library, sdk, wasm, html</td>
						<td class="py-3 pr-4">12</td>
						<td class="py-3">project + human + universal</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono text-foreground">frontend, website, mobile</td>
						<td class="py-3 pr-4">16</td>
						<td class="py-3">project + frontend + human + universal</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono text-foreground">mcp, data-science</td>
						<td class="py-3 pr-4">17</td>
						<td class="py-3">project + backend + human + universal</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono text-foreground">api, fullstack</td>
						<td class="py-3 pr-4">21</td>
						<td class="py-3">all base categories</td>
					</tr>
					<tr>
						<td class="py-3 pr-4 font-mono text-foreground">enterprise (4 variants)</td>
						<td class="py-3 pr-4">up to 33</td>
						<td class="py-3">all base + enterprise infra/app/ops</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-muted-foreground text-sm mt-4">
			Source:
			<a href="https://github.com/Wolfe-Jam/faf-cli/blob/main/src/core/slots.ts#L86" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">
				APP_TYPE_CATEGORIES in slots.ts
			</a>
		</p>
	</section>

	<!-- Tier table -->
	<section class="mb-16">
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">Tier table</h2>
		<p class="text-muted-foreground mb-6 leading-relaxed">
			Trophy 🏆 is the only emoji. Sub-Trophy uses clean Unicode geometric symbols. The
			medal-rainbow ladder (🥇🥈🥉🟢🟡🔴🤍) is retired. Source:
			<a href="https://github.com/Wolfe-Jam/faf-cli/blob/main/src/core/tiers.ts" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">
				tiers.ts
			</a>.
		</p>
		<div class="overflow-x-auto">
			<table class="w-full text-base">
				<thead class="border-b border-white/20">
					<tr class="text-left">
						<th class="py-3 pr-4 font-semibold">Score</th>
						<th class="py-3 pr-4 font-semibold">Tier</th>
						<th class="py-3 pr-4 font-semibold">Symbol</th>
						<th class="py-3 font-semibold">Status</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono text-orange-400">100%</td>
						<td class="py-3 pr-4 font-bold text-orange-400">Trophy</td>
						<td class="py-3 pr-4 text-3xl">🏆</td>
						<td class="py-3 text-muted-foreground">AI Optimised — Gold Code</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono">99%</td>
						<td class="py-3 pr-4 font-bold text-orange-400">Gold</td>
						<td class="py-3 pr-4 text-2xl text-orange-400">★</td>
						<td class="py-3 text-muted-foreground">Near-perfect</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono">95%</td>
						<td class="py-3 pr-4 font-bold text-cyan-400">Silver</td>
						<td class="py-3 pr-4 text-2xl text-cyan-400">◆</td>
						<td class="py-3 text-muted-foreground">Excellent</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono">85%</td>
						<td class="py-3 pr-4 font-bold text-cyan-400">Bronze</td>
						<td class="py-3 pr-4 text-2xl text-cyan-400">◇</td>
						<td class="py-3 text-muted-foreground">Production ready</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono">70%</td>
						<td class="py-3 pr-4 font-bold">Green</td>
						<td class="py-3 pr-4 text-2xl">●</td>
						<td class="py-3 text-muted-foreground">Solid foundation</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono">55%</td>
						<td class="py-3 pr-4 font-bold opacity-70">Yellow</td>
						<td class="py-3 pr-4 text-2xl opacity-70">●</td>
						<td class="py-3 text-muted-foreground">AI flipping coins</td>
					</tr>
					<tr class="border-b border-white/5">
						<td class="py-3 pr-4 font-mono opacity-70">1%</td>
						<td class="py-3 pr-4 font-bold opacity-70">Red</td>
						<td class="py-3 pr-4 text-2xl opacity-70">○</td>
						<td class="py-3 text-muted-foreground">AI working blind</td>
					</tr>
					<tr>
						<td class="py-3 pr-4 font-mono opacity-50">0%</td>
						<td class="py-3 pr-4 font-bold opacity-50">White</td>
						<td class="py-3 pr-4 text-2xl opacity-50">♡</td>
						<td class="py-3 text-muted-foreground">No context at all</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<!-- Verify it yourself -->
	<section class="mb-16">
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">Verify it yourself</h2>
		<p class="text-muted-foreground mb-6 leading-relaxed">
			The score this site shows for any repo is reproducible offline. Same input, same number,
			every time. No API keys, no rate limits, no telemetry between you and the answer.
		</p>
		<div class="bg-black/60 border border-white/10 rounded-lg p-6 mb-6 font-mono text-sm md:text-base">
			<div class="text-muted-foreground mb-2"># install once</div>
			<div><span class="text-orange-400">$</span> npm install -g faf-cli</div>
			<div class="text-muted-foreground mb-2 mt-4"># score any repo, locally</div>
			<div><span class="text-orange-400">$</span> faf-cli score</div>
			<div class="text-muted-foreground mb-2 mt-4"># or score a remote repo without cloning</div>
			<div><span class="text-orange-400">$</span> faf-cli git github.com/owner/repo</div>
		</div>
		<p class="text-muted-foreground leading-relaxed">
			The WASM scoring kernel (<a href="https://www.npmjs.com/package/faf-scoring-kernel" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">faf-scoring-kernel</a>) does the math.
			Same kernel runs in your browser when you score on builder.faf.one, on disk via the CLI,
			and at the edge in the badge / OG endpoints. <strong class="text-foreground">One kernel, one rubric, one number.</strong>
		</p>
	</section>

	<!-- Why this matters -->
	<section class="mb-16">
		<h2 class="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">Why this matters</h2>
		<p class="text-muted-foreground leading-relaxed mb-4">
			Repo scores are about to be a badge fest. Cursor will badge "Cursor Ready". Vercel will
			badge "AI-Compatible". GitHub will badge "Copilot Friendly". Each one is an
			<strong class="text-foreground">opinion</strong> dressed as a number — vendor-biased,
			internally rubric'd, periodically re-tuned.
		</p>
		<p class="text-muted-foreground leading-relaxed mb-4">
			FAF's score is different by design:
		</p>
		<ul class="space-y-3 mb-6 text-muted-foreground">
			<li>
				<strong class="text-foreground">First.</strong> First repo Context score. Created the category.
			</li>
			<li>
				<strong class="text-foreground">IANA-registered.</strong>
				<a href="https://www.iana.org/assignments/media-types/application/vnd.faf+yaml" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">
					application/vnd.faf+yaml
				</a>
				is the only Context format with formal registration. Anyone can write a spec; registered formats are authored and approved by IESG experts.
			</li>
			<li>
				<strong class="text-foreground">Deterministic.</strong> Same repo → same number, every time. WASM-local, no server tampering.
			</li>
			<li>
				<strong class="text-foreground">Mechanical.</strong> Reads actual files, applies the IANA-spec rubric. Not LLM-judged, not human-curated.
			</li>
			<li>
				<strong class="text-foreground">Falsifiable.</strong> Anyone can run it on their own machine and get the identical number.
			</li>
		</ul>
		<p class="text-orange-400 italic text-lg">
			<strong>Theirs is an opinion. Ours is a measurement. FAF don't lie.</strong>
		</p>
	</section>

	<!-- CTA -->
	<section class="text-center py-12 border-t border-white/10">
		<p class="text-xl mb-6 text-muted-foreground">Ready to see your number?</p>
		<a
			href="/"
			class="inline-block px-8 py-4 bg-orange-400 text-black font-bold rounded-lg hover:bg-orange-300 transition-colors text-lg"
		>
			Score your repo →
		</a>
	</section>
</main>
