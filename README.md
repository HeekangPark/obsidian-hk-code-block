# HK CodeBlock

[Obsidian](https://obsidian.md) plugin developed by Heekang Park

[ English | [한국어](https://github.com/HeekangPark/obsidian-hk-code-block/blob/master/README_ko.md) ]

With HK CodeBlock, you can add various features to code blocks.

Inspired from [Prism.js](https://prismjs.com/)'s plugin, [Better Code Block](https://github.com/stargrey/obsidian-better-codeblock), [Code Block Enhancer](https://github.com/nyable/obsidian-code-block-enhancer).

## Features

### Title

You can add title to the code block like this.

    ```python title:"Title of the code block"
    print("Hello world")
    ```

![title](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/title.png)

You must put the title in quotes. You can use both single and double quotes.

### Line Numbers

You can add line numbers to the code block like this.

    ```python linenos
    print("Hello world")
    ```

Or like this.

    ```python linenos:true
    print("Hello world")
    ```

![linenos1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/linenos1.png)

If you don't specify any options, the line numbers will start from the value set in the settings (default: 1). If you want the line numbers to start from a specific value, you can do it like this.

    ```python linenos:10
    print("Hello world")
    ```

![linenos2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/linenos2.png)

You can also use negative values.

    ```python linenos:-10
    print("Hello world")
    ```

![linenos3](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/linenos3.png)

If you want to explicitly hide the line numbers, you can do it like this.

    ```python linenos:false
    print("Hello world")
    ```

### Line Highlight

You can highlight specific lines in the code block with commas like this.

    ```python highlight:"2,3"
    print("Hello world")
    print("I love you")
    print("Wow")
    ```

![highlight1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/highlight1.png)

You must put the line numbers in quotes. You can use both single and double quotes.

If you use the line numbers feature and set the line numbers don't start from 1, you must enter the line numbers to be highlighted according to that.

    ```python linenos:10 highlight:"10,11"
    print("Hello world")
    print("I love you")
    print("Wow")
    ```

![highlight2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/highlight2.png)

### Language Indicator

You can add the language indicator to the code block like this.

    ```python language
    print("Hello world")
    ```

Or like this.

    ```python language:true
    print("Hello world")
    ```

![language1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/language1.png)

The displayed language is following the language of the code block by default, but if you want, you can specify it explicitly. In this case, you can change the language displayed while keeping the syntax highlighting done by the language of the code block.

    ```python language:"javascript"
    print("Hello world")
    ```

![language2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/language2.png)

You must put the language in quotes. You can use both single and double quotes.

If neither the language of the code block nor the language specified by the language option is specified, the language displayed is the value set in the settings (default: "plain text").

If you want to explicitly hide the language indicator, you can do it like this.

    ```python language:false
    print("Hello world")
    ```

### Copy Button

You can add a copy button to the code block like this.

    ```python copybtn
    print("Hello world")
    ```

Or like this.

    ```python copybtn:true
    print("Hello world")
    ```

![copybtn](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/copybtn.png)

If you want to explicitly hide the copy button, you can do it like this.

    ```python copybtn:false
    print("Hello world")
    ```

### Prompt

You can add a prompt to the code block like this.

    ```bash prompt
    mkdir test
    ```

Or like this.

    ```bash prompt:true
    mkdir test
    ```

![prompt1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/prompt1.png)

If you don't specify any options, the prompt will be the value set in the settings (default: "$"). If you want to use another prompt, you can do it like this.

    ```bash prompt:"#"
    mkdir test
    ```

![prompt2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/prompt2.png)

You must put the prompt in quotes. You can use both single and double quotes.

If there is a "\" character at the end of the line, the prompt will not be displayed on the next line.

    ```bash prompt
    docker run -it \
        ubuntu:latest
    ```

![prompt3](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/prompt3.png)

If you want to explicitly hide the prompt, you can do it like this.

    ```bash prompt:false
    mkdir test
    ```

### Result

You can add a result to the code block like this.

    ```python
    print("Hello world!")
    ```

    ```result
    Hello world!
    ```

![result1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/result1.png)

Note that the Result Code Block must be placed immediately after the Code Block to which the result belongs. You must not put any other components between them.

Also note that the result code block is not dynamically generated. Result code blocks are just simple plain-text code blocks. You must enter the result manually.

You can use line numbers, line highlight features only in the result code block. Other features will be ignored even if you specify them.

    ```python
    print("Hello world!")
    ```

    ```result linenos
    Hello world!
    ```

    ```result highlight:"1"
    Hello world!
    ```

![result2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/result2.png)

The prompt of the result code block is the value set in the settings by default (default: "Result"). If you want to use another prompt, you can do it like this.

    ```python
    import random
    print(random.randint(1, 100))
    ```

    ```result prompt:"Result (may be different depending on your environment)"
    42
    ```

![result3](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/result3.png)

## Settings

You can change the default settings of each feature of HK Code Block in the settings.

### Title

- Use Title
  - default off, but on when specified : the title will only be shown if the title statement is specified
  - always off : the title will never be shown

### Line numbers

- Use Line Numbers
  - always on : line numbers will always be shown
  - default on, but off when specified : line numbers will always be shown, but will not be shown if linenos statement is specified as false
  - default off, but on when specified : line numbers will only be shown if the linenos statement is specified as true
  - always off : line numbers will never be shown
- Default Line Number Start : the default line number start of the code block (default: 1)
- Show Line Number Splitter : whether to show the line number splitter (default: true)

### Line Highlight

- Use Line Highlight
  - default off, but on when specified : line highlight will only be shown if the line highlight statement is specified
  - always off : line highlight will never be shown
- Line Highlight Color : The background color of the highlighted line. Note that the given color will be applied with 0.2 opacity. (default: #ff0000)

### Language Indicator

- Use Language Indicator
  - always on : language indicator will always be shown
  - default on, but off when specified : language indicator will always be shown, but will not be shown if the language indicator statement is specified as false
  - default off, but on when specified : language indicator will only be shown if the language indicator statement is specified as true
  - always off : language indicator will never be shown
- Default Language : the default language name of the code block if the language is not specified. (default: "plain text")

### Copy Button

- Use Copy Button
  - always on : copy button will always be shown
  - default on, but off when specified : copy button will always be shown, but will not be shown if the copy button statement is specified as false
  - default off, but on when specified : copy button will only be shown if the copy button statement is specified as true
  - always off : copy button will never be shown

### Prompt

- Use Prompt
  - always on : prompt will always be shown for languages specified in the "Prompting Languages" option
  - default on, but off when specified : prompt will always be shown for languages specified in the "Prompting Languages" option, but will not be shown if the prompt statement is specified as false
  - default off, but on when specified : prompt will only be shown if the prompt statement is specified as true
  - always off : prompt will never be shown
- Prompting Languages : The languages that will be prompted by default. You can specify multiple languages by separating them with enters. (default: "bash")
- Default Prompt : The default prompt of the code block. (default: "$")

### Result

- Use Result
  - enable : use the result feature
  - disable : do not use the result feature
- Default Result Prompt : The default prompt of the result code block. (default: "Result")

### Developers

- Debug Mode
  - true : enable debug mode. Log messages will be displayed in the console.
  - false : disable debug mode.

## License

MIT License

## Known Issues

- Some features may not work properly depending on the theme you are using. Currently on 2023-02, I checked that the following themes are working properly.
  - Default Theme
  - [Minimal Theme](https://github.com/kepano/obsidian-minimal)
  - [Obsidian Nord](https://github.com/insanum/obsidian_nord)
  - [Obsidianite](https://github.com/bennyxguo/Obsidian-Obsidianite)
  - [Sanctum](https://github.com/jdanielmourao/obsidian-sanctum)
  - [Shimmering Focus](https://github.com/chrisgrieser/shimmering-focus)
  - [Wasp](https://github.com/santiyounger/Wasp-Obsidian-Theme)
  - [Typewriter](https://github.com/crashmoney/obsidian-typewriter)

## Changelog

### 0.1.0

- Initial release