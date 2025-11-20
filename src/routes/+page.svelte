<script lang="ts">
	import BigOrange from '$lib/components/BigOrange.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import BiSyncPost from '$lib/components/BiSyncPost.svelte';

	// Environment configuration
	const mcpServerUrl = 'https://grok-faf-mcp.vercel.app/sse';
	const templateRepoUrl = 'https://github.com/wolfe-jam/grok-faf-elite';

	// Modal states
	let showNewProject = $state(false);
	let showGithub = $state(false);
	let showDirectUrl = $state(false);
	let showBiSync = $state(false);

	// Form inputs
	let projectName = $state('my-faf-project');
	let githubUrl = $state('');

	// Clipboard feedback
	let copiedNew = $state(false);
	let copiedGithub = $state(false);
	let copiedUrl = $state(false);

	// Generate commands
	function getNewProjectCommand(): string {
		const name = projectName.trim() || 'my-faf-project';
		return `npx create-faf-app ${name}\ncd ${name}\nnpm run dev`;
	}

	function getGithubCommands(): string {
		if (!githubUrl.trim()) return '';
		try {
			const url = new URL(githubUrl);
			const pathParts = url.pathname.split('/').filter(Boolean);
			const repoName = pathParts[1] || 'repo';
			return `git clone ${githubUrl}\ncd ${repoName}\nnpx grok-faf-mcp init\ngit add . && git commit -m "Add FAF" && git push`;
		} catch {
			return '';
		}
	}

	// Copy to clipboard
	async function copyToClipboard(text: string, setter: (v: boolean) => void) {
		try {
			await navigator.clipboard.writeText(text);
			setter(true);
			setTimeout(() => setter(false), 2000);
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement('textarea');
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setter(true);
			setTimeout(() => setter(false), 2000);
		}
	}
</script>

<main class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
	<!-- Hero Section -->
	<div class="text-center mb-12">
		<div class="flex justify-center mb-6">
			<BigOrange />
		</div>
		<h1 class="text-4xl md:text-5xl font-bold text-foreground mb-3">
			Grok-FAF-Elite
		</h1>
		<p class="text-lg text-muted-foreground max-w-md mx-auto">
			Zero faff from day zero — Grok-ready in one click
		</p>
	</div>

	<!-- Action Cards -->
	<div class="w-full max-w-xl space-y-4">
		<ActionButton
			onclick={() => showNewProject = true}
			label="New Project"
			description="Create a fresh FAF-ready project from template"
		>
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14M5 12h14" />
				</svg>
			{/snippet}
		</ActionButton>

		<ActionButton
			onclick={() => showGithub = true}
			label="Add to GitHub Repo"
			description="Add FAF to an existing GitHub repository"
		>
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
				</svg>
			{/snippet}
		</ActionButton>

		<ActionButton
			onclick={() => showDirectUrl = true}
			label="Direct MCP URL"
			description="Get the grok-faf-mcp server URL for Grok"
		>
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
				</svg>
			{/snippet}
		</ActionButton>

		<!-- Branded Share on X - X black theme -->
		<div class="mt-6 pt-6 border-t border-muted-foreground/20">
			<button
				onclick={() => showBiSync = true}
				class="group relative w-full p-6 bg-black rounded-xl border border-white/20
					hover:border-white/40 hover:bg-black/80 transition-all duration-200
					focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background"
				type="button"
			>
				<div class="flex items-start gap-4">
					<div class="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center
						group-hover:bg-white/20 transition-colors duration-200">
						<span class="text-white w-5 h-5">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</span>
					</div>
					<div class="text-left">
						<h3 class="text-lg font-semibold text-white group-hover:text-white transition-colors duration-200">
							Share on X
						</h3>
						<p class="text-sm text-white/60 mt-1">
							Post your bi-sync to X
						</p>
					</div>
				</div>
				<div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</div>
			</button>
		</div>
	</div>

	<!-- Footer -->
	<footer class="mt-12 text-center text-sm text-muted-foreground">
		<p>
			Powered by <a href="https://www.npmjs.com/package/grok-faf-mcp" target="_blank" rel="noopener" class="text-primary hover:underline">grok-faf-mcp</a>
			 ·
			<a href={templateRepoUrl} target="_blank" rel="noopener" class="text-primary hover:underline">GitHub</a>
		</p>
		<p class="mt-6 text-xs italic text-muted-foreground/70">
			"It's so logical if it didn't exist, AI would have built it itself" — Claude
		</p>
	</footer>
</main>

<!-- New Project Modal -->
<Modal open={showNewProject} onclose={() => showNewProject = false} title="New FAF Project">
	<div class="space-y-4">
		<div>
			<label for="projectName" class="block text-sm font-medium text-muted-foreground mb-2">
				Project Name
			</label>
			<input
				id="projectName"
				type="text"
				bind:value={projectName}
				placeholder="my-faf-project"
				class="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded-lg
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
					text-foreground placeholder-muted-foreground"
			/>
		</div>
		<div>
			<p class="block text-sm font-medium text-muted-foreground mb-2">
				Run these commands
			</p>
			<pre class="bg-background border border-muted-foreground/20 rounded-lg p-4 text-sm overflow-x-auto"><code class="text-green-400">{getNewProjectCommand()}</code></pre>
		</div>
		<button
			onclick={() => copyToClipboard(getNewProjectCommand(), (v) => copiedNew = v)}
			class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
				hover:bg-primary/90 transition-colors duration-200
				focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
		>
			{copiedNew ? '✓ Copied!' : 'Copy Commands'}
		</button>
	</div>
</Modal>

<!-- GitHub Modal -->
<Modal open={showGithub} onclose={() => showGithub = false} title="Add FAF to GitHub Repo">
	<div class="space-y-4">
		<div>
			<label for="githubUrl" class="block text-sm font-medium text-muted-foreground mb-2">
				GitHub Repository URL
			</label>
			<input
				id="githubUrl"
				type="url"
				bind:value={githubUrl}
				placeholder="https://github.com/username/repo"
				class="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded-lg
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
					text-foreground placeholder-muted-foreground"
			/>
		</div>
		{#if getGithubCommands()}
			<div>
				<p class="block text-sm font-medium text-muted-foreground mb-2">
					Run these commands
				</p>
				<pre class="bg-background border border-muted-foreground/20 rounded-lg p-4 text-sm overflow-x-auto"><code class="text-green-400">{getGithubCommands()}</code></pre>
			</div>
			<button
				onclick={() => copyToClipboard(getGithubCommands(), (v) => copiedGithub = v)}
				class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
					hover:bg-primary/90 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
			>
				{copiedGithub ? '✓ Copied!' : 'Copy Commands'}
			</button>
		{:else}
			<p class="text-sm text-muted-foreground text-center py-4">
				Enter a GitHub URL to generate commands
			</p>
		{/if}
	</div>
</Modal>

<!-- Direct URL Modal -->
<Modal open={showDirectUrl} onclose={() => showDirectUrl = false} title="MCP Server URL">
	<div class="space-y-4">
		<p class="text-sm text-muted-foreground">
			Use this URL to connect Grok directly to the FAF MCP server:
		</p>
		<div class="bg-background border border-muted-foreground/20 rounded-lg p-4">
			<code class="text-primary break-all">{mcpServerUrl}</code>
		</div>
		<button
			onclick={() => copyToClipboard(mcpServerUrl, (v) => copiedUrl = v)}
			class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
				hover:bg-primary/90 transition-colors duration-200
				focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
		>
			{copiedUrl ? '✓ Copied!' : 'Copy URL'}
		</button>
		<p class="text-xs text-muted-foreground">
			Add this URL in Grok's MCP settings to enable FAF context awareness.
		</p>
	</div>
</Modal>

<!-- Bi-Sync Post Modal -->
<Modal open={showBiSync} onclose={() => showBiSync = false} title="Share on X">
	<BiSyncPost />
</Modal>
