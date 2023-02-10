import { App, PluginSettingTab, Setting } from 'obsidian';

import HKCodeBlockPlugin from './main';

export const fragWithHTML = (text: string) => {
	return createFragment((frag) => {
		frag.createDiv().innerHTML = text.split("\n").map((line) => line.trim()).join("<br>");
	});
}

export class HKCodeBlockSettingTab extends PluginSettingTab {
	plugin: HKCodeBlockPlugin;

	constructor(app: App, plugin: HKCodeBlockPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// title
		containerEl.createEl('h2', { text: 'Title' });

		new Setting(containerEl)
			.setName('Use Title')
			.setDesc(fragWithHTML(`- <b>default off, but on when specified</b> : the title will only be shown if the title statement is specified
				- <b>always off</b> : the title will never be shown`))
			.addDropdown(tc =>
				tc.addOptions({
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.useTitleGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useTitleGlobal = value as ("default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		// collapse
		containerEl.createEl('h2', { text: 'Collapse' });

		new Setting(containerEl)
			.setName('Use Collapse')
			.setDesc(fragWithHTML(`- <b>always on</b> : the code block will always be collapsible
				- <b>default on, but off when specified</b> : the code block will always be collapsible, but will not be collapsed if collapse statement is specified as false
				- <b>default off, but on when specified</b> : the code block will only be collapsible if the collapse statement is specified as true
				- <b>always off</b> : the code block will never be collapsible`))
			.addDropdown(tc =>
				tc.addOptions({
					"always on": "always on",
					"default on, but off when specified": "default on, but off when specified",
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.useCollapsibleGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useCollapsibleGlobal = value as ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Default Collapse State')
			.setDesc('The default collapse state of the code block.')
			.addDropdown(tc =>
				tc.addOptions({
					"collapse": "collapse",
					"expand": "expand",
				})
					.setValue(this.plugin.settings.defaultCollapse)
					.onChange(async (value: string) => {
						this.plugin.settings.defaultCollapse = value as ("collapse" | "expand");
						await this.plugin.saveSettings();
					})
			);

		// line numbers
		containerEl.createEl('h2', { text: 'Line Numbers' });

		new Setting(containerEl)
			.setName('Use Line Numbers')
			.setDesc(fragWithHTML(`- <b>always on</b> : line numbers will always be shown
				- <b>default on, but off when specified</b> : line numbers will always be shown, but will not be shown if linenos statement is specified as false
				- <b>default off, but on when specified</b> : line numbers will only be shown if the linenos statement is specified as true
				- <b>always off</b> : line numbers will never be shown`))
			.addDropdown(tc =>
				tc.addOptions({
					"always on": "always on",
					"default on, but off when specified": "default on, but off when specified",
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.useLinenosGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useLinenosGlobal = value as ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Default Line Number Start')
			.setDesc('The default line number start of the code block.')
			.addText(tc =>
				tc.setValue(this.plugin.settings.defaultLinenosStart.toString())
					.onChange(async (value: string) => {
						const num = parseInt(value);
						if (isNaN(num)) return;

						this.plugin.settings.defaultLinenosStart = num;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Show Line Number Splitter')
			.addToggle(tc =>
				tc.setValue(this.plugin.settings.showLinenosSplitter)
					.onChange(async (value: boolean) => {
						this.plugin.settings.showLinenosSplitter = value;
						await this.plugin.saveSettings();
					})
			);

		// line highlight
		containerEl.createEl('h2', { text: 'Line Highlight' });

		new Setting(containerEl)
			.setName('Use Line Highlight')
			.setDesc(fragWithHTML(`- <b>default off, but on when specified</b> : line highlight will only be shown if the line highlight statement is specified
				- <b>always off</b> : line highlight will never be shown`))
			.addDropdown(tc =>
				tc.addOptions({
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.useHighlightGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useHighlightGlobal = value as ("default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Line Highlight Color')
			.setDesc('The background color of the highlighted line. Note that the given color will be applied with 0.2 opacity.')
			.addText(tc =>
				tc.setValue(this.plugin.settings.highlightColor)
					.onChange(async (value: string) => {
						this.plugin.settings.highlightColor = value;
						await this.plugin.saveSettings();
					})
			);

		// language
		containerEl.createEl('h2', { text: 'Language Indicator' });

		new Setting(containerEl)
			.setName('Use Language Indicator')
			.setDesc(fragWithHTML(`- <b>always on</b> : language indicator will always be shown
				- <b>default on, but off when specified</b> : language indicator will always be shown, but will not be shown if the language indicator statement is specified as false
				- <b>default off, but on when specified</b> : language indicator will only be shown if the language indicator statement is specified as true
				- <b>always off</b> : language indicator will never be shown`))
			.addDropdown(tc =>
				tc.addOptions({
					"always on": "always on",
					"default on, but off when specified": "default on, but off when specified",
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.useLanguageGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useLanguageGlobal = value as ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Default Language')
			.setDesc('The default language name of the code block if the language is not specified.')
			.addText(tc =>
				tc.setValue(this.plugin.settings.defaultLanguage)
					.onChange(async (value: string) => {
						this.plugin.settings.defaultLanguage = value;
						await this.plugin.saveSettings();
					})
			);
		
		// copy button
		containerEl.createEl('h2', { text: 'Copy Button' });

		new Setting(containerEl)
			.setName('Use Copy Button')
			.setDesc(fragWithHTML(`- <b>always on</b> : copy button will always be shown
				- <b>default on, but off when specified</b> : copy button will always be shown, but will not be shown if the copy button statement is specified as false
				- <b>default off, but on when specified</b> : copy button will only be shown if the copy button statement is specified as true
				- <b>always off</b> : copy button will never be shown`))
			.addDropdown(tc =>
				tc.addOptions({
					"always on": "always on",
					"default on, but off when specified": "default on, but off when specified",
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.useCopyBtnGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useCopyBtnGlobal = value as ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		// prompt
		containerEl.createEl('h2', { text: 'Prompt' });

		new Setting(containerEl)
			.setName('Use Prompt')
			.setDesc(fragWithHTML(`- <b>always on</b> : prompt will always be shown
				- <b>default on, but off when specified</b> : prompt will always be shown, but will not be shown if the prompt statement is specified as false
				- <b>default off, but on when specified</b> : prompt will only be shown if the prompt statement is specified as true
				- <b>always off</b> : prompt will never be shown`))
			.addDropdown(tc =>
				tc.addOptions({
					"always on": "always on",
					"default on, but off when specified": "default on, but off when specified",
					"default off, but on when specified": "default off, but on when specified",
					"always off": "always off",
				})
					.setValue(this.plugin.settings.usePromptGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.usePromptGlobal = value as ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Prompting Languages')
			.setDesc('The languages that will be prompted by default. You can specify multiple languages by separating them with enters.')
			.addTextArea(tc =>
				tc.setValue(this.plugin.settings.promptingLanguages.join("\n"))
					.onChange(async (value: string) => {
						const lines = value.split("\n").filter(line => line.trim() !== "");
						this.plugin.settings.promptingLanguages = lines;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default Prompt")
			.setDesc("The default prompt of the bash code block.")
			.addText(tc =>
				tc.setValue(this.plugin.settings.defaultPrompt)
					.onChange(async (value: string) => {
						this.plugin.settings.defaultPrompt = value;
						await this.plugin.saveSettings();
					})
			);

		// result
		containerEl.createEl('h2', { text: 'Result' });

		new Setting(containerEl)
			.setName('Use Result')
			.setDesc(fragWithHTML(`- <b>enable</b> : treat the code block starts like \`\`\`\`result\` as the result of the adjacent previous code block
				- <b>disable</b> : treat the code block with \`result\` as its language name as a normal code block`))
			.addDropdown(tc =>
				tc.addOptions({
					"enable": "enable",
					"disable": "disable",
				})
					.setValue(this.plugin.settings.useResultGlobal)
					.onChange(async (value: string) => {
						this.plugin.settings.useResultGlobal = value as ("enable" | "disable");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default Result Prompt")
			.setDesc("The default prompt of the result code block.")
			.addText(tc =>
				tc.setValue(this.plugin.settings.defaultResultPrompt)
					.onChange(async (value: string) => {
						this.plugin.settings.defaultResultPrompt = value;
						await this.plugin.saveSettings();
					})
			);

		// for developers
		containerEl.createEl('h2', { text: 'Developers' });

		new Setting(containerEl)
			.setName('Debug Mode')
			.setDesc('Show logs in the console.')
			.addToggle(tc =>
				tc.setValue(this.plugin.settings.debugMode)
					.onChange(async (value: boolean) => {
						this.plugin.settings.debugMode = value;
						await this.plugin.saveSettings();
					})
			);
	}
}