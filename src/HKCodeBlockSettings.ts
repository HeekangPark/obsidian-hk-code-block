export interface HKCodeBlockSettings {
	useTitleGlobal: ("default off, but on when specified" | "always off");

	useCollapsibleGlobal: ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
	defaultCollapse: ("collapse" | "expand");
	showCollapseBtn: boolean;

	useLinenosGlobal: ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
	defaultLinenosStart: number;
	showLinenosSplitter: boolean;

	useHighlightGlobal: ("default off, but on when specified" | "always off");
	highlightColor: string;

	useLanguageGlobal: ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
	defaultLanguage: string;
	
	useCopyBtnGlobal: ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
	
	usePromptGlobal: ("always on" | "default on, but off when specified" | "default off, but on when specified" | "always off");
	defaultPrompt: string;
	
	useResultGlobal: ("enable" | "disable");
	promptingLanguages: string[];
	defaultResultPrompt: string;

	debugMode: boolean;
}

export const DEFAULT_SETTINGS: HKCodeBlockSettings = {
	useTitleGlobal: "default off, but on when specified",

	useCollapsibleGlobal: "default on, but off when specified",
	defaultCollapse: "expand",
	showCollapseBtn: true,

	useLinenosGlobal: "default off, but on when specified",
	defaultLinenosStart: 1,
	showLinenosSplitter: true,

	useHighlightGlobal: "default off, but on when specified",
	highlightColor: "#ff0000",

	useLanguageGlobal: "default on, but off when specified",
	defaultLanguage: "plain text",

	useCopyBtnGlobal: "default on, but off when specified",

	usePromptGlobal: "default on, but off when specified",
	promptingLanguages: ["bash"],
	defaultPrompt: "$",

	useResultGlobal: "enable",
	defaultResultPrompt: "Result",

	debugMode: false,
}