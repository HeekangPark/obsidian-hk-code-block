import { Plugin } from 'obsidian';

import type { HKCodeBlockSettings as HKCodeBlockSettings } from './settings';
import { DEFAULT_SETTINGS } from './settings';
import { HKCodeBlockSettingTab } from './settingTab';
import { HKCodeBlockProcessor } from './processor';

export default class HKCodeBlockPlugin extends Plugin {
	settings: HKCodeBlockSettings;

	async onload() {
		await this.loadSettings();
		if (this.settings.debugMode) {
			console.log("loading HK Code Block plugin");
		}

		// register settings tab
		this.addSettingTab(new HKCodeBlockSettingTab(this.app, this));

		// register markdown post processor
		const processor = this.registerMarkdownPostProcessor((el, ctx) => {
			HKCodeBlockProcessor(el, ctx, this);
		});

		processor.sortOrder = 100; // run after the default code block processor
	}

	onunload() {
		if (this.settings.debugMode) {
			console.log("unloading HKCodeBlock plugin");
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}