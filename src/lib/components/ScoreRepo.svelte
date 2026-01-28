<script lang="ts">
	let repoUrl = $state('');
	let loading = $state(false);
	let score = $state<number | null>(null);
	let repoName = $state('');
	let repoOwner = $state('');
	let error = $state('');
	let shared = $state(false);

	// Big Orange application state
	let applyingForOrange = $state(false);
	let orangeResult = $state<{ awarded: boolean; feedback: string } | null>(null);

	// Tier definitions - Big 🍊 Award (105%) is the Michelin Star for Repos
	function getTier(s: number): { emoji: string; name: string; color: string; note?: string } {
		if (s >= 105) return { emoji: '🍊', name: 'Big Orange', color: 'text-orange-500', note: 'The Michelin Star for Repos' };
		if (s >= 100) return { emoji: '🏆', name: 'Trophy', color: 'text-yellow-400', note: 'Gold Code - Perfect Score!' };
		if (s >= 99) return { emoji: '🥇', name: 'Gold', color: 'text-yellow-300' };
		if (s >= 95) return { emoji: '🥈', name: 'Silver', color: 'text-gray-300' };
		if (s >= 85) return { emoji: '🥉', name: 'Bronze', color: 'text-amber-600' };
		if (s >= 70) return { emoji: '🟢', name: 'Green', color: 'text-green-500' };
		if (s >= 55) return { emoji: '🟡', name: 'Yellow', color: 'text-yellow-500' };
		return { emoji: '🔴', name: 'Needs Work', color: 'text-red-500' };
	}

	const tier = $derived(score !== null ? getTier(score) : null);

	async function checkScore() {
		if (!repoUrl.trim()) return;

		loading = true;
		error = '';
		score = null;

		try {
			// Parse GitHub URL
			const url = new URL(repoUrl);
			const pathParts = url.pathname.split('/').filter(Boolean);
			if (pathParts.length < 2) throw new Error('Invalid GitHub URL');

			const owner = pathParts[0];
			const repo = pathParts[1];
			repoOwner = owner;
			repoName = repo;

			// Fetch raw project.faf from GitHub
			const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/project.faf`;
			const response = await fetch(rawUrl);

			if (!response.ok) {
				// Try master branch
				const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/project.faf`;
				const masterResponse = await fetch(masterUrl);
				if (!masterResponse.ok) {
					throw new Error('No project.faf found - repo needs FAF!');
				}
			}

			const fafContent = await response.text();

			// Simple scoring based on filled fields
			// Count meaningful lines (not empty, not just whitespace)
			const lines = fafContent.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));

			// Check for key fields
			const hasProject = /^project:/m.test(fafContent);
			const hasGoal = /goal:/m.test(fafContent);
			const hasStack = /^stack:/m.test(fafContent);
			const hasHumanContext = /^human_context:/m.test(fafContent);
			const hasWho = /who:/m.test(fafContent);
			const hasWhat = /what:/m.test(fafContent);
			const hasWhy = /why:/m.test(fafContent);
			const hasWhere = /where:/m.test(fafContent);
			const hasWhen = /when:/m.test(fafContent);
			const hasHow = /how:/m.test(fafContent);
			const hasMainLang = /main_language:/m.test(fafContent);
			const hasType = /type:/m.test(fafContent);

			// Calculate score (12 slots = 100%)
			const filledSlots = [
				hasProject, hasGoal, hasStack, hasHumanContext,
				hasWho, hasWhat, hasWhy, hasWhere, hasWhen, hasHow,
				hasMainLang, hasType
			].filter(Boolean).length;

			// Base score - cap at 100% (Big Orange 105% is AI-awarded only)
			let calculatedScore = Math.min(100, Math.round((filledSlots / 12) * 100));

			score = calculatedScore;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch repo';
		} finally {
			loading = false;
		}
	}

	function shareToX() {
		if (score === null || !tier) return;

		const text = encodeURIComponent(
			`${repoName} scored ${score}% on FAF AI-readiness! ${tier.emoji}

${score >= 100 ? 'Gold Code achieved!' : 'On the path to Gold Code!'}

Check your score: https://grok-faf-elite.vercel.app

#FAF #GoldCode #AIReadiness`
		);

		window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
		shared = true;
	}

	function reset() {
		score = null;
		repoUrl = '';
		repoName = '';
		repoOwner = '';
		error = '';
		shared = false;
		orangeResult = null;
	}

	async function applyForBigOrange() {
		if (score !== 100) return;

		applyingForOrange = true;
		orangeResult = null;

		try {
			// Fetch all files for AI review
			const baseUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main`;

			const [fafRes, claudeRes, readmeRes] = await Promise.allSettled([
				fetch(`${baseUrl}/project.faf`),
				fetch(`${baseUrl}/CLAUDE.md`),
				fetch(`${baseUrl}/README.md`)
			]);

			const fafContent = fafRes.status === 'fulfilled' && fafRes.value.ok ? await fafRes.value.text() : '';
			const claudeContent = claudeRes.status === 'fulfilled' && claudeRes.value.ok ? await claudeRes.value.text() : '';
			const readmeContent = readmeRes.status === 'fulfilled' && readmeRes.value.ok ? await readmeRes.value.text() : '';

			// AI Evaluation Criteria
			let points = 0;
			const feedback: string[] = [];

			// 1. project.faf quality (0-3 points)
			if (fafContent.length > 500) { points++; feedback.push('✅ Rich project.faf content'); }
			if (/persona:|voice:|tone:/m.test(fafContent)) { points++; feedback.push('✅ Has personality/voice defined'); }
			if (/links:|npm:|github:/m.test(fafContent)) { points++; feedback.push('✅ Includes useful links'); }

			// 2. CLAUDE.md quality (0-3 points)
			if (claudeContent.length > 300) { points++; feedback.push('✅ Comprehensive CLAUDE.md'); }
			if (/##.*Architecture|##.*Structure/mi.test(claudeContent)) { points++; feedback.push('✅ Documents architecture'); }
			if (/##.*Command|##.*Usage/mi.test(claudeContent)) { points++; feedback.push('✅ Has usage instructions'); }

			// 3. README quality (0-3 points)
			if (readmeContent.length > 500) { points++; feedback.push('✅ Detailed README'); }
			if (/```[\s\S]*```/m.test(readmeContent)) { points++; feedback.push('✅ Includes code examples'); }
			if (/\[.*\]\(.*\)/m.test(readmeContent)) { points++; feedback.push('✅ Has helpful links'); }

			// 4. Bonus points (0-2 points)
			if (/badge|shield/mi.test(readmeContent)) { points++; feedback.push('✅ Uses badges'); }
			if (/license|MIT|Apache/mi.test(fafContent + readmeContent)) { points++; feedback.push('✅ Open source licensed'); }

			// Decision: Need 8+ points for Big Orange (out of 11 possible)
			const awarded = points >= 8;

			if (awarded) {
				score = 105;
				orangeResult = {
					awarded: true,
					feedback: `🍊 BIG ORANGE AWARD!\nThe Michelin Star for Repos\n\nAI Review (${points}/11 points):\n${feedback.join('\n')}\n\nYour repo demonstrates excellence. Congratulations!`
				};
			} else {
				orangeResult = {
					awarded: false,
					feedback: `Not quite yet (${points}/11 points, need 8+):\n\n${feedback.join('\n')}\n\n💡 Tips to earn Big Orange:\n- Add more detail to project.faf\n- Include architecture in CLAUDE.md\n- Add code examples to README\n- Consider adding badges`
				};
			}
		} catch (err) {
			orangeResult = {
				awarded: false,
				feedback: `Error during review: ${err instanceof Error ? err.message : 'Unknown error'}`
			};
		} finally {
			applyingForOrange = false;
		}
	}
</script>

<div class="space-y-4">
	{#if score === null}
		<!-- Input State -->
		<div>
			<label for="scoreRepoUrl" class="block text-sm font-medium text-muted-foreground mb-2">
				GitHub Repository URL
			</label>
			<input
				id="scoreRepoUrl"
				type="url"
				bind:value={repoUrl}
				placeholder="https://github.com/username/repo"
				class="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded-lg
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
					text-foreground placeholder-muted-foreground"
				onkeydown={(e) => e.key === 'Enter' && checkScore()}
			/>
		</div>

		{#if error}
			<div class="p-3 rounded-lg text-sm bg-red-500/10 text-red-400">
				{error}
			</div>
		{/if}

		<button
			onclick={checkScore}
			disabled={loading || !repoUrl.trim()}
			class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
				hover:bg-primary/90 transition-colors duration-200
				focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted
				disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loading ? 'Checking...' : 'Check Score'}
		</button>
	{:else}
		<!-- Score Display State -->
		<div class="text-center py-6">
			<div class="text-6xl mb-4">{tier?.emoji}</div>
			<div class="text-5xl font-bold {tier?.color} mb-2">{score}%</div>
			<div class="text-lg text-muted-foreground">{tier?.name}</div>
			{#if tier?.note}
				<div class="text-xs text-primary mt-1">{tier.note}</div>
			{/if}
			<div class="text-sm text-foreground mt-2">{repoName}</div>
		</div>

		<!-- Progress bar -->
		<div class="w-full bg-muted-foreground/20 rounded-full h-3 overflow-hidden">
			<div
				class="h-full rounded-full transition-all duration-500 {score >= 105 ? 'bg-gradient-to-r from-orange-500 to-orange-400' : score >= 100 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : score >= 70 ? 'bg-green-500' : 'bg-red-500'}"
				style="width: {Math.min(score, 105)}%"
			></div>
		</div>

		<!-- Big Orange Application (only at 100%) -->
		{#if score === 100 && !orangeResult}
			<div class="pt-4 border-t border-muted-foreground/20">
				<button
					onclick={applyForBigOrange}
					disabled={applyingForOrange}
					class="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold rounded-lg
						hover:from-orange-600 hover:to-orange-500 transition-all duration-200
						focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-muted
						disabled:opacity-50 disabled:cursor-not-allowed
						flex items-center justify-center gap-2 text-lg"
				>
					{#if applyingForOrange}
						<span class="animate-spin">🍊</span> AI Reviewing...
					{:else}
						🍊 Juice Your Repo!
					{/if}
				</button>
				<p class="text-xs text-muted-foreground text-center mt-2">
					Apply for the Big 🍊 Award - The Michelin Star for Repos
				</p>
			</div>
		{/if}

		<!-- Orange Result -->
		{#if orangeResult}
			<div class="pt-4 border-t border-muted-foreground/20">
				<div class="p-4 rounded-lg {orangeResult.awarded ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-muted-foreground/10 border border-muted-foreground/20'}">
					<pre class="text-sm whitespace-pre-wrap {orangeResult.awarded ? 'text-orange-400' : 'text-muted-foreground'}">{orangeResult.feedback}</pre>
				</div>
			</div>
		{/if}

		<div class="flex gap-3 pt-4">
			<button
				onclick={shareToX}
				class="flex-1 py-2 px-4 bg-black text-white font-semibold rounded-lg border border-white/20
					hover:bg-black/80 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-muted
					flex items-center justify-center gap-2"
			>
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
				</svg>
				{shared ? 'Shared!' : 'Share Score'}
			</button>
			<button
				onclick={reset}
				class="py-2 px-4 bg-muted text-foreground font-semibold rounded-lg border border-muted-foreground/20
					hover:bg-muted/80 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
			>
				Try Another
			</button>
		</div>
	{/if}
</div>
