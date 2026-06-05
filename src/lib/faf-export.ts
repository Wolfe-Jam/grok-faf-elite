/**
 * The builder's .faf shape + export transform — pure & testable, single source.
 *
 * Aligned to the .faf single truth (cli/src/core/slots.ts): the builder produces
 * an `app_type: intent` .faf — 9 active slots (project meta 3 + the 6 Ws). The
 * stack/monorepo slots are `slotignored`, the CANONICAL on-wire marker for slots
 * that don't apply to this type (faf-cli writes + reads exactly this value), so a
 * complete run is a REAL 100% intent .faf. We KEEP slotignored on export; we only
 * add canonical fields (app_type, generated, context). No stripping, no invented
 * keys. An AI that fills the stack re-types it to the real app_type.
 */

const SI = 'slotignored';

/** A fresh idea has no stack yet → slotignore it, so only project + the human
 *  Ws count. A scored repo replaces this whole .faf with its generated one. */
export function seedFaf(name = ''): string {
	return `faf_version: "3.3"
project:
  name: ${name}
  goal:
  main_language: ${SI}
  type: intent
stack:
  frontend: ${SI}
  css_framework: ${SI}
  ui_library: ${SI}
  state_management: ${SI}
  backend: ${SI}
  api_type: ${SI}
  runtime: ${SI}
  database: ${SI}
  connection: ${SI}
  hosting: ${SI}
  build: ${SI}
  cicd: ${SI}
  monorepo_tool: ${SI}
  package_manager: ${SI}
  workspaces: ${SI}
  admin: ${SI}
  cache: ${SI}
  search: ${SI}
  storage: ${SI}
human_context:
  who:
  what:
  why:
  where:
  when:
  how:
monorepo:
  packages_count: ${SI}
  build_orchestrator: ${SI}
  versioning_strategy: ${SI}
  shared_configs: ${SI}
  remote_cache: ${SI}
`;
}

export interface ExportOpts {
	/** the file's real score (0-100), computed by the caller via the scorer */
	pct: number;
	/** optional target app_type from the "Building?" dropdown ('' = Not sure yet) */
	target?: string;
	/** ISO timestamp for the `generated:` metastamp (injected for determinism) */
	stamp: string;
}

/**
 * Pure export transform. Takes the in-app .faf (slotignored intact) and returns
 * the file a receiving AI gets: canonical `app_type`, `generated:` metastamp, and
 * a `context:` primer. Does NOT score (pct is passed in) and does NOT mutate the
 * scored slots — so the result still scores exactly `pct`.
 */
export function buildExport(faf: string, { pct, target = '', stamp }: ExportOpts): string {
	const inserts: string[] = [];
	if (!/^app_type:/m.test(faf)) inserts.push('app_type: intent');
	inserts.push(`generated: ${stamp}`);
	const head = faf.replace(/^(faf_version:.*)$/m, `$1\n${inserts.join('\n')}`);

	const targetLine = target
		? `\n  The human indicated the intended type: ${target}. Confirm it against
  the codebase, then set app_type: ${target} and fill its active slots.`
		: '';
	const context = `context: |
  This is an intent-type project.faf — ${pct}% complete for that type.
  A human gave the intent at builder.faf.one: name, goal, and the 6 Ws
  (who, what, why, where, when, how). Slots marked "slotignored" are not
  part of the intent type.
  YOUR TURN: read this project's codebase, set app_type to the real type
  (e.g. cli, mcp, frontend, fullstack), and fill the now-active stack/monorepo
  slots to produce a higher-fidelity project.faf.${targetLine}`;
	return `${head.trimEnd()}\n${context}\n`;
}
