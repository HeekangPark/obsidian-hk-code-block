import { MarkdownView } from "obsidian";
import type { MarkdownPostProcessorContext, MarkdownSectionInformation } from "obsidian";

import HKCodeBlockPlugin from "./main";
import type { HKCodeBlockSettings } from "./HKCodeBlockSettings";

const REGEX = {
  TITLE: /\stitle:(?:'(.*?)'|"(.*?)")\s/,
  COLLAPSIBLE_SIMPLE: /\scollapsible\s/,
  COLLAPSIBLE_COMPLICATE: /\scollapsible:(true|false)\s/,
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
  NUMBER: /^-{0,1}\d+$/,
}

function getMeta(
  view: MarkdownView,
  elem_code: HTMLElement,
  elem_code_idx: number,
  section_code: MarkdownSectionInformation,
  settings: HKCodeBlockSettings
): {
  isError: boolean,
  lineStartInSection: number,
  lineEndInSection: number,
  showTitle: (boolean | undefined),
  title: string,
  isCollapsible: (boolean | undefined),
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
  const return_value: {
    isError: boolean,
    lineStartInSection: number,
    lineEndInSection: number,
    showTitle: (boolean | undefined),
    title: string,
    isCollapsible: (boolean | undefined),
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
  } = {
    isError: false,
    lineStartInSection: -1,
    lineEndInSection: -1,
    showTitle: undefined,
    title: "",
    isCollapsible: undefined,
    showLinenos: undefined,
    linenosStart: settings.defaultLinenosStart,
    linenosNum: 0,
    showHighlight: undefined,
    highlightLines: [],
    showLanguage: undefined,
    language: settings.defaultLanguage,
    showCopyBtn: undefined,
    isResult: false,
    resultPrompt: settings.defaultResultPrompt,
    showPrompt: undefined,
    prompt: settings.defaultPrompt
  }

  let marker_count = 0;
  for (let i = section_code.lineStart; i <= section_code.lineEnd; i++) {
    const line = view.editor.getLine(i);
    if (line.trim().startsWith("```")) marker_count++;

    if (return_value.lineStartInSection === -1 && marker_count === elem_code_idx * 2 + 1) {
      return_value.lineStartInSection = i;
    }

    if (return_value.lineEndInSection === -1 && marker_count === elem_code_idx * 2 + 2) {
      return_value.lineEndInSection = i;
      break;
    }
  }

  if (return_value.lineStartInSection < 0 || return_value.lineEndInSection < 0 || return_value.lineStartInSection >= return_value.lineEndInSection) {
    return_value.isError = true;
    return return_value;
  }

  const firstline = view.editor.getLine(return_value.lineStartInSection).trim() + " "; // add a space to the end of the line to make sure the regex works

  // title
  const regexResult_title = REGEX.TITLE.exec(firstline);
  if (regexResult_title) {
    return_value.showTitle = true;
    return_value.title = regexResult_title[1] || regexResult_title[2];
  }

  // collapsible
  const regexResult_collapsibleSimple = REGEX.COLLAPSIBLE_SIMPLE.exec(firstline);
  const regexResult_collapsibleComplicate = REGEX.COLLAPSIBLE_COMPLICATE.exec(firstline);
  if (regexResult_collapsibleSimple) {
    return_value.isCollapsible = true;
  } else if (regexResult_collapsibleComplicate) {
    if (regexResult_collapsibleComplicate[1] === "true") {
      return_value.isCollapsible = true;
    } else if (regexResult_collapsibleComplicate[1] === "false") {
      return_value.isCollapsible = false;
    }
  }

  // linenos
  return_value.linenosNum = return_value.lineEndInSection - return_value.lineStartInSection - 1;
  const regexResult_linenosSimple = REGEX.LINENOS_SIMPLE.exec(firstline);
  const regexResult_linenosComplicate = REGEX.LINENOS_COMPLICATE.exec(firstline);
  if (regexResult_linenosSimple) {
    return_value.showLinenos = true;
  } else if (regexResult_linenosComplicate) {
    if (regexResult_linenosComplicate[1] === "true") {
      return_value.showLinenos = true;
    } else if (regexResult_linenosComplicate[1] === "false") {
      return_value.showLinenos = false;
    } else {
      return_value.showLinenos = true;
      return_value.linenosStart = parseInt(regexResult_linenosComplicate[2]) || 1;
    }
  }

  // highlight
  const regexResult_highlight = REGEX.HIGHLIGHT.exec(firstline);
  if (regexResult_highlight) {
    return_value.showHighlight = true;
    const highlightLines_str = regexResult_highlight[1] || regexResult_highlight[2];
    let highlightLines = highlightLines_str.split(",").map((item) => {
      item = item.trim();

      if (REGEX.NUMBER.test(item)) return parseInt(item);

      const multiple_lines = item.split("-");
      if (multiple_lines.length === 2) {
        const start = parseInt(multiple_lines[0].trim());
        const end = parseInt(multiple_lines[1].trim());

        if (!isNaN(start) && !isNaN(end)) {
          return Array.from({ length: end - start + 1 }, (_, i) => i + start);
        }
      }

      return NaN;
    }).flat().filter((item) => !isNaN(item));

    if (highlightLines.some((line) => isNaN(line))) {
      // if any element is nan, then set showHighlight to false
      return_value.showHighlight = undefined;
      return_value.highlightLines = [];
    } else {
      // use only valid line numbers
      return_value.highlightLines = highlightLines.filter(
        (line) => line >= return_value.linenosStart && line < return_value.linenosStart + return_value.linenosNum
      );
    }
  }

  // language
  elem_code.classList.forEach((className) => {
    const regexResult_languageFromClass = REGEX.LANGUAGE_FROM_CLASS.exec(className.trim());
    if (regexResult_languageFromClass) {
      return_value.language = regexResult_languageFromClass[1];
    }
  });
  const regexResult_languageSimple = REGEX.LANGUAGE_SIMPLE.exec(firstline);
  const regexResult_languageComplicate = REGEX.LANGUAGE_COMPLICATE.exec(firstline);
  if (regexResult_languageSimple) {
    return_value.showLanguage = true;
  } else if (regexResult_languageComplicate) {
    if (regexResult_languageComplicate[1] === "true") {
      return_value.showLanguage = true;
    } else if (regexResult_languageComplicate[1] === "false") {
      return_value.showLanguage = false;
    } else {
      return_value.showLanguage = true;
      return_value.language = regexResult_languageComplicate[2] || regexResult_languageComplicate[3];
    }
  }

  // copy button
  const regexResult_copyBtnSimple = REGEX.COPYBTN_SIMPLE.exec(firstline);
  const regexResult_copyBtnComplicate = REGEX.COPYBTN_COMPLICATE.exec(firstline);
  if (regexResult_copyBtnSimple) {
    return_value.showCopyBtn = true;
  } else if (regexResult_copyBtnComplicate) {
    if (regexResult_copyBtnComplicate[1] === "true") {
      return_value.showCopyBtn = true;
    } else if (regexResult_copyBtnComplicate[1] === "false") {
      return_value.showCopyBtn = false;
    }
  }

  // prompt
  const regexResult_promptSimple = REGEX.PROMPT_SIMPLE.exec(firstline);
  const regexResult_promptComplicate = REGEX.PROMPT_COMPLICATE.exec(firstline);
  if (regexResult_promptSimple) {
    return_value.showPrompt = true;
  } else if (regexResult_promptComplicate) {
    if (regexResult_promptComplicate[1] === "true") {
      return_value.showPrompt = true;
    } else if (regexResult_promptComplicate[1] === "false") {
      return_value.showPrompt = false;
    } else {
      return_value.showPrompt = true;
      return_value.prompt = regexResult_promptComplicate[2] || regexResult_promptComplicate[3];
    }
  }

  // result
  const regexResult_result = REGEX.RESULT.exec(firstline);
  const regexResultPrompt_result = REGEX.PROMPT_COMPLICATE.exec(firstline);
  if (regexResult_result) {
    return_value.isResult = true;

    // override other meta data : only linenos, highlight are available
    return_value.showTitle = false;
    return_value.showLanguage = false;
    return_value.showCopyBtn = false;
    return_value.showPrompt = false;

    if (regexResultPrompt_result) {
      return_value.resultPrompt = regexResultPrompt_result[2] || regexResultPrompt_result[3];
    }
  }

  return return_value;
}

export async function HKCodeBlockProcessor(
  el: HTMLElement,
  context: MarkdownPostProcessorContext,
  plugin: HKCodeBlockPlugin
) {
  const settings = plugin.settings;

  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) return;

  /* Note:
  // - get all code blocks : obsidian markdown parser sometimes pass multiple code blocks
  // - skip front matter
  */
  const elem_codes: NodeListOf<Element> = el.querySelectorAll("pre:not(.frontmatter) > code");
  if (elem_codes.length === 0) return;

  elem_codes.forEach((elem_code: HTMLElement, elem_code_idx: number) => {
    const elem_pre: (HTMLElement | null) = elem_code.parentElement;
    if (!elem_pre) return;

    const elem_pre_parent: (HTMLElement | null) = elem_pre.parentElement;
    if (!elem_pre_parent) return;

    const elem_copyBtn: (HTMLElement | null) = elem_pre.querySelector(".copy-code-button");
    if (!elem_copyBtn) return;

    const section_code: (MarkdownSectionInformation | null) = context.getSectionInfo(elem_code);
    if (!section_code) return;

    // get metadata
    const {
      isError,
      lineStartInSection,
      lineEndInSection,
      showTitle,
      title,
      isCollapsible,
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
      prompt,
    }: {
      isError: boolean,
      lineStartInSection: number,
      lineEndInSection: number,
      showTitle: (boolean | undefined),
      title: string,
      isCollapsible: (boolean | undefined),
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
    } = getMeta(view, elem_code, elem_code_idx, section_code, settings);
    if (isError) return;
    if (settings.debugMode) {
      console.log({
        isError: isError,
        lineStartInSection: lineStartInSection,
        lineEndInSection: lineEndInSection,
        showTitle: showTitle,
        title: title,
        isCollapsible: isCollapsible,
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
    const elem_div: HTMLElement = document.createElement("div");
    elem_pre_parent.replaceChild(elem_div, elem_pre);
    elem_div.appendChild(elem_pre);

    elem_div.classList.add("hk-codeblock");
    elem_code.classList.add("hk-codeblock-code");
    elem_copyBtn.remove(); // remove the original copy button as default

    let elem_title: (HTMLElement | undefined) = undefined;
    if (settings.useTitleGlobal === "default off, but on when specified" && (showTitle === true)) {
      elem_div.classList.add("hk-codeblock-show-title");

      elem_title = document.createElement("div");
      elem_title.classList.add("hk-codeblock-title");
      elem_title.innerHTML = title;
      elem_div.insertBefore(elem_title, elem_pre);
    }

    if (
      (settings.useCollapsibleGlobal === "always on") ||
      (settings.useCollapsibleGlobal === "default on, but off when specified" && (isCollapsible === undefined || isCollapsible === true)) ||
      (settings.useCollapsibleGlobal === "default off, but on when specified" && (isCollapsible === true))
    ) {
      if (elem_title) {
        elem_div.classList.add("hk-codeblock-collapsible");

        if (settings.defaultCollapse === "collapse") {
          elem_div.classList.add("hk-codeblock-collapsed");
        }

        elem_title.addEventListener("click", (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          elem_div.classList.toggle("hk-codeblock-collapsed");
        });

        const elem_collapseBtns = document.createElement("div");
        elem_collapseBtns.classList.add("hk-codeblock-collapse-btns");

        const elem_collapseBtn = document.createElement("div");
        elem_collapseBtn.classList.add("hk-codeblock-collapse-btn", "hk-codeblock-collapsed-btn");
        elem_collapseBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 19a1 1 0 0 1-.64-.23 1 1 0 0 1-.13-1.41L13.71 12 9.39 6.63a1 1 0 0 1 .15-1.41 1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19z"/>
      </svg>`;
        elem_collapseBtns.appendChild(elem_collapseBtn);

        const elem_expandBtn = document.createElement("div");
        elem_expandBtn.classList.add("hk-codeblock-collapse-btn", "hk-codeblock-expanded-btn");
        elem_expandBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15 1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16z"/>
      </svg>`;
        elem_collapseBtns.appendChild(elem_expandBtn);

        elem_title.prepend(elem_collapseBtns);
      }
    }


    if (
      (settings.useLinenosGlobal === "always on") ||
      (settings.useLinenosGlobal === "default on, but off when specified" && (showLinenos === undefined || showLinenos === true)) ||
      (settings.useLinenosGlobal === "default off, but on when specified" && (showLinenos === true))
    ) {
      elem_div.classList.add("hk-codeblock-show-linenos");

      const elem_linenos = document.createElement("div");
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

      const elem_highlight = document.createElement("div");
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

      const elem_prompt = document.createElement("div");
      elem_prompt.classList.add("hk-codeblock-prompt");

      const lines = elem_code.innerText.split("\n");
      elem_prompt.innerText = Array(linenosNum).fill(0).map((_, idx) => {
        if (idx < 0 || idx >= lines.length) return null;

        const line = lines[idx].trim();
        const prevLine = idx > 0 ? lines[idx - 1].trim() : "";

        if (
          (line === "") || // check if the line is empty
          (line.startsWith("#")) || // check if the line is a comment
          (prevLine.endsWith("\\")) // check if the line is a continuation of the previous line
        ) {
          return " ".repeat(prompt.length);
        }

        return prompt;
      }).filter((line) => line !== null).join("\n");

      elem_pre.insertBefore(elem_prompt, elem_code);
    }

    if (settings.useResultGlobal === "enable" && (isResult === true)) {
      const isCodeBlockAdjacent = ((): boolean => {
        let line_idx = lineStartInSection - 1;
        while (line_idx >= 0) {
          const line = view.editor.getLine(line_idx).trim();
          if (line.length === 0) {
            line_idx--;
            continue;
          } else if (line === "```") {
            return true;
          } else {
            return false;
          }
        }
        return false;
      })();

      if (isCodeBlockAdjacent) {
        elem_div.classList.add("hk-codeblock-result");
        elem_code.classList.add("hk-codeblock-result-code");

        const elem_result_prompt = document.createElement("div");
        elem_result_prompt.classList.add("hk-codeblock-result-prompt");
        elem_result_prompt.innerText = resultPrompt;
        elem_div.insertBefore(elem_result_prompt, elem_pre);
      }
    }
  });
}