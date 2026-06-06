import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview -- --port 4175',
		port: 4175,
		reuseExistingServer: !process.env.CI,
		// build (~20s) + preview can run slow under load / cold CI — give headroom
		timeout: 240000
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
