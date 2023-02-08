import { MarkdownView } from "obsidian";
import type { MarkdownPostProcessorContext, MarkdownSectionInformation } from "obsidian";

import HKCodeBlockPlugin from "./main";
import type { HKCodeBlockSettings } from "./HKCodeBlockSettings";

const REGEX = {
  TITLE: /\stitle:(?:'(.*?)'|"(.*?)")\s/,
  LINENOS_SIMPLE: /\slinenos\s/,
  LINENOS_COMPLICATE: /\slinenos:(true|false|(-{0,1}\d+))\s/,
  HIGHLIGHT: /\shighlight:(?:'(.*?)'|"(.*?)")\s/,
  LANGUAGE_FROM_CLASS: /^language-(\w+)$/,
  LANGUAGE_SIMPLE: /\slanguage\s/,
  LANGUAGE_COMPLICATE: /\slanguage:(true|false|'(.*?)'|"(.*?)")\s/,
  COPYBTN_SIMPLE: /\scopybtn\s/,
  COPYBTN_COMPLICATE: /\scopybtn:(true|false)\s/,
  RESULT: /^```result\s/,
  PROMPT_SIMPLE: /\sprompt\s/,
  PROMPT_COMPLICATE: /\sprompt:(true|false|'(.*?)'|"(.*?)")\s/,
}

function getMeta(view: MarkdownView, elem_code: HTMLElement, section_code: MarkdownSectionInformation, settings: HKCodeBlockSettings): {
  showTitle: (boolean | undefined),
  title: string,
  showLinenos: (boolean | undefined),
  linenosStart: number,
  linenosNum: number,
  showHighlight: (boolean | undefined),
  highlightLines: number[],
  showLanguage: (boolean | undefined),
  language: string,
  showCopyBtn: (boolean | undefined),
  isResult: boolean,
  resultPrompt: string,
  showPrompt: (boolean | undefined),
  prompt: string
} {
  const firstline = view.editor.getLine(section_code.lineStart) + " "; // add a space to the end of the line to make sure the regex works

  // title
  let showTitle: (boolean | undefined) = undefined;
  let title = "";
  const regexResult_title = REGEX.TITLE.exec(firstline);
  if (regexResult_title) {
    showTitle = true;
    title = regexResult_title[1] || regexResult_title[2];
  }

  // linenos
  let showLinenos: (boolean | undefined) = undefined;
  let linenosStart = settings.defaultLinenosStart;
  const linenosNum = section_code.lineEnd - section_code.lineStart - 1;
  const regexResult_linenosSimple = REGEX.LINENOS_SIMPLE.exec(firstline);
  const regexResult_linenosComplicate = REGEX.LINENOS_COMPLICATE.exec(firstline);
  if (regexResult_linenosSimple) {
    showLinenos = true;
  } else if (regexResult_linenosComplicate) {
    if (regexResult_linenosComplicate[1] === "true") {
      showLinenos = true;
    } else if (regexResult_linenosComplicate[1] === "false") {
      showLinenos = false;
    } else {
      showLinenos = true;
      linenosStart = parseInt(regexResult_linenosComplicate[2]) || 1;
    }
  }

  // highlight
  let showHighlight: (boolean | undefined) = undefined;
  let highlightLines: number[] = [];
  const regexResult_highlight = REGEX.HIGHLIGHT.exec(firstline);
  if (regexResult_highlight) {
    showHighlight = true;
    const highlightLines_str = regexResult_highlight[1] || regexResult_highlight[2];
    highlightLines = highlightLines_str.split(",").map((line) => parseInt(line));

    if (highlightLines.some((line) => isNaN(line))) {
      // if any element is nan, then set showHighlight to false
      showHighlight = undefined;
      highlightLines = [];
    } else {
      // use only valid line numbers
      highlightLines = highlightLines.filter((line) => line >= linenosStart && line < linenosStart + linenosNum);
    }
  }

  // language
  let showLanguage: (boolean | undefined) = undefined;
  let language = (() => {
    let language = settings.defaultLanguage;
    elem_code.classList.forEach((className) => {
      const regexResult_languageFromClass = REGEX.LANGUAGE_FROM_CLASS.exec(className.trim());
      if (regexResult_languageFromClass) language = regexResult_languageFromClass[1];
    });

    return language;
  })();
  const regexResult_languageSimple = REGEX.LANGUAGE_SIMPLE.exec(firstline);
  const regexResult_languageComplicate = REGEX.LANGUAGE_COMPLICATE.exec(firstline);
  if (regexResult_languageSimple) {
    showLanguage = true;
  } else if (regexResult_languageComplicate) {
    if (regexResult_languageComplicate[1] === "true") {
      showLanguage = true;
    } else if (regexResult_languageComplicate[1] === "false") {
      showLanguage = false;
    } else {
      showLanguage = true;
      language = regexResult_languageComplicate[2] || regexResult_languageComplicate[3];
    }
  }

  // copy button
  let showCopyBtn: (boolean | undefined) = undefined;
  const regexResult_copyBtnSimple = REGEX.COPYBTN_SIMPLE.exec(firstline);
  const regexResult_copyBtnComplicate = REGEX.COPYBTN_COMPLICATE.exec(firstline);
  if (regexResult_copyBtnSimple) {
    showCopyBtn = true;
  } else if (regexResult_copyBtnComplicate) {
    if (regexResult_copyBtnComplicate[1] === "true") {
      showCopyBtn = true;
    } else if (regexResult_copyBtnComplicate[1] === "false") {
      showCopyBtn = false;
    }
  }

  // prompt
  let showPrompt: (boolean | undefined) = undefined;
  let prompt = settings.defaultPrompt;
  const regexResult_promptSimple = REGEX.PROMPT_SIMPLE.exec(firstline);
  const regexResult_promptComplicate = REGEX.PROMPT_COMPLICATE.exec(firstline);
  if (regexResult_promptSimple) {
    showPrompt = true;
  } else if (regexResult_promptComplicate) {
    if (regexResult_promptComplicate[1] === "true") {
      showPrompt = true;
    } else if (regexResult_promptComplicate[1] === "false") {
      showPrompt = false;
    } else {
      showPrompt = true;
      prompt = regexResult_promptComplicate[2] || regexResult_promptComplicate[3];
    }
  }

  // result
  let isResult = false;
  let resultPrompt = settings.defaultResultPrompt;
  const regexResult_result = REGEX.RESULT.exec(firstline);
  const regexResultPrompt_result = REGEX.PROMPT_COMPLICATE.exec(firstline);
  if (regexResult_result) {
    isResult = true;
    
    // override other meta data : only linenos, highlight are available
    showTitle = false;
    showLanguage = false;
    showCopyBtn = false;
    showPrompt = false;

    if (regexResultPrompt_result) {
      resultPrompt = regexResultPrompt_result[2] || regexResultPrompt_result[3];
    }
  }

  return {
    showTitle: showTitle,
    title: title,
    showLinenos: showLinenos,
    linenosStart: linenosStart,
    linenosNum: linenosNum,
    showHighlight: showHighlight,
    highlightLines: highlightLines,
    showLanguage: showLanguage,
    language: language,
    showCopyBtn: showCopyBtn,
    isResult: isResult,
    resultPrompt: resultPrompt,
    showPrompt: showPrompt,
    prompt: prompt
  };
}

export async function HKCodeBlockProcessor(
  el: HTMLElement,
  context: MarkdownPostProcessorContext,
  plugin: HKCodeBlockPlugin
) {
  const settings = plugin.settings;

  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) return;

  const elem_code: (HTMLElement | null) = el.querySelector("pre:not(.frontmatter) > code");
  if (!elem_code) return;

  const elem_pre: (HTMLElement | null) = elem_code.parentElement;
  if (!elem_pre) return;

  const elem_div: (HTMLElement | null) = elem_pre.parentElement;
  if (!elem_div) return;

  const elem_copyBtn: (HTMLElement | null) = elem_div.querySelector(".copy-code-button");
  if (!elem_copyBtn) return;

  const section_code: (MarkdownSectionInformation | null) = context.getSectionInfo(elem_code);
  if (!section_code) return;

  // get metadata
  const { 
    showTitle,
    title,
    showLinenos,
    linenosStart,
    linenosNum,
    showHighlight,
    highlightLines,
    showLanguage,
    language,
    showCopyBtn,
    isResult,
    resultPrompt,
    showPrompt,
    prompt
  } = getMeta(view, elem_code, section_code, settings);

  if (settings.debugMode) {
    console.log({ 
      showTitle: showTitle,
      title: title,
      showLinenos: showLinenos,
      linenosStart: linenosStart,
      linenosNum: linenosNum,
      showHighlight: showHighlight,
      highlightLines: highlightLines,
      showLanguage: showLanguage,
      language: language,
      showCopyBtn: showCopyBtn,
      isResult: isResult,
      resultPrompt: resultPrompt,
      showPrompt: showPrompt,
      prompt: prompt,
    })
  }

  // create HTML elements
  elem_div.classList.add("hk-codeblock");
  elem_code.classList.add("hk-codeblock-code");
  elem_copyBtn.remove(); // remove the original copy button as default

  if (settings.useTitleGlobal === "default off, but on when specified" && (showTitle === true)) {
    elem_div.classList.add("hk-codeblock-show-title");

    const elem_title = document.createElement("div");
    elem_title.classList.add("hk-codeblock-title");
    elem_title.innerHTML = title;
    elem_div.insertBefore(elem_title, elem_pre);
  }

  if (
    (settings.useLinenosGlobal === "always on") ||
    (settings.useLinenosGlobal === "default on, but off when specified" && (showLinenos === undefined || showLinenos === true)) ||
    (settings.useLinenosGlobal === "default off, but on when specified" && (showLinenos === true))
  ) {
    elem_div.classList.add("hk-codeblock-show-linenos");

    const elem_linenos = document.createElement("code");
    elem_linenos.classList.add("hk-codeblock-linenos");
    elem_linenos.innerText = Array(linenosNum).fill(0).map((_, idx) => idx + linenosStart).join("\n");
    elem_pre.insertBefore(elem_linenos, elem_code);

    if (settings.showLinenosSplitter) {
      elem_linenos.classList.add("show-splitter");
    }
  }

  if (settings.useHighlightGlobal === "default off, but on when specified" && (showHighlight === true)) {
    elem_div.classList.add("hk-codeblock-show-highlight");

    elem_div.style.setProperty("--hk-codeblock-highlight-background-color", settings.highlightColor);

    const elem_highlight = document.createElement("code");
    elem_highlight.classList.add("hk-codeblock-highlight");
    elem_highlight.innerHTML = Array(linenosNum).fill(0).map((_, idx) => {
      const classNames: string[] = [];
      if (highlightLines.includes(idx + linenosStart)) classNames.push("highlight");
      return `<span class="line line-${idx + linenosStart} ${classNames.join(" ")}"> </span>`;
    }).join("\n");
    elem_pre.insertBefore(elem_highlight, elem_code);
  }

  if (
    (settings.useLanguageGlobal === "always on") ||
    (settings.useLanguageGlobal === "default on, but off when specified" && (showLanguage === undefined || showLanguage === true)) ||
    (settings.useLanguageGlobal === "default off, but on when specified" && (showLanguage === true))
  ) {
    elem_div.classList.add("hk-codeblock-show-language");

    const elem_language = document.createElement("div");
    elem_language.classList.add("hk-codeblock-language");
    elem_language.innerText = language;
    elem_pre.prepend(elem_language);
  }

  if (
    (settings.useCopyBtnGlobal === "always on") ||
    (settings.useCopyBtnGlobal === "default on, but off when specified" && (showCopyBtn === undefined || showCopyBtn === true)) ||
    (settings.useCopyBtnGlobal === "default off, but on when specified" && (showCopyBtn === true))
  ) {
    elem_div.classList.add("hk-codeblock-show-copybtn");

    elem_pre.appendChild(elem_copyBtn);
  }

  if (
    (settings.usePromptGlobal === "always on" && settings.promptingLanguages.includes(language)) ||
    (settings.usePromptGlobal === "default on, but off when specified" && settings.promptingLanguages.includes(language) && (showPrompt === undefined || showPrompt === true)) ||
    (settings.usePromptGlobal === "default off, but on when specified" && (showPrompt === true))
  ) {
    elem_div.classList.add("hk-codeblock-show-prompt");

    // using Prism.js command-line plugin
    let code_lines = elem_code.innerText.split("\n");
    if (code_lines[code_lines.length - 1].trim().length == 0) code_lines.pop(); // remove last line if empty

    const no_prompt_line_idxs = code_lines.map((line, idx) => {
      if (line.trim().length == 0) return (idx + 1); // empty line
      if (line.startsWith("#")) return (idx + 1); // comment line
      return -1;
    }).filter((idx) => idx != -1);

    elem_pre.classList.add("command-line");
    elem_pre.setAttribute("data-prompt", prompt);
    elem_pre.setAttribute("data-continuation-str", "\\");
    elem_pre.setAttribute("data-continuation-prompt", " ".repeat(prompt.length));  // use spaces to align continuation prompt
    elem_pre.setAttribute("data-output", no_prompt_line_idxs.join(", "));
  }

  if(settings.useResultGlobal === "enable" && (isResult === true)) {
    elem_div.classList.add("hk-codeblock-result");
    elem_code.classList.add("hk-codeblock-result-code");

    elem_div.setAttribute("data-result-prompt", resultPrompt);
  }
}