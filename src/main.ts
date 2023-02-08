import { Plugin, loadPrism } from 'obsidian';

import type { HKCodeBlockSettings } from './HKCodeBlockSettings';
import { DEFAULT_SETTINGS } from './HKCodeBlockSettings';
import { HKCodeBlockSettingTab } from './HKCodeBlockSettingTab';
import { HKCodeBlockProcessor } from './HKCodeBlockProcessor';

import { PrismPlugin_CommandLine } from './prism-plugins/prism-command-line';

export default class HKCodeBlockPlugin extends Plugin {
	settings: HKCodeBlockSettings;

	async onload() {
		await this.loadSettings();
		if (this.settings.debugMode) {
			console.log("loading HKCodeBlock plugin");
		}

		const Prism = await loadPrism();

		// activate Prism.js plugins
		PrismPlugin_CommandLine(Prism);

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