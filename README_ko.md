# HK CodeBlock

[Obsidian](https://obsidian.md) plugin developed by Heekang Park

[ 한국어 | [English](https://github.com/HeekangPark/obsidian-hk-code-block/blob/master/README.md) ]

HK CodeBlock을 이용하면 Code Block에 다양한 기능들을 추가할 수 있습니다.

[Prism.js](https://prismjs.com/)의 플러그인, [Better Code Block](https://github.com/stargrey/obsidian-better-codeblock), [Code Block Enhancer](https://github.com/nyable/obsidian-code-block-enhancer) 등에서 영감을 받아 만들었습니다.

## 기능

### 제목

다음과 같이 하면 Code Block에 제목을 설정할 수 있습니다.

    ```python title:"Title of the code block"
    print("Hello world")
    ```

![title](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/title.png)

반드시 따옴표 안에 제목을 넣어야 합니다. 큰따옴표와 작은 따옴표 모두 사용 가능합니다.

### 줄 번호

다음과 같이 하면 Code Block에 줄 번호를 추가할 수 있습니다.

    ```python linenos
    print("Hello world")
    ```

또는 다음과 같이 할 수도 있습니다.

    ```python linenos:true
    print("Hello world")
    ```

![linenos1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/linenos1.png)

아무런 옵션을 주지 않으면 줄 번호는 설정에서 설정한 값(기본값: 1)부터 시작합니다. 줄 번호가 특정 값으로 시작하도록 하려면 다음과 같이 하면 됩니다.

    ```python linenos:10
    print("Hello world")
    ```

![linenos2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/linenos2.png)

음수 값도 가능합니다.

    ```python linenos:-10
    print("Hello world")
    ```

![linenos3](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/linenos3.png)

다음과 같이 하면 명시적으로 줄 번호를 숨길 수 있습니다.

    ```python linenos:false
    print("Hello world")
    ```

### 줄 강조

다음과 같이 강조하고 싶은 줄의 번호를 콤마로 구분하여 입력하면 해당 줄에 강조 효과를 줄 수 있습니다.

    ```python highlight:"2,3"
    print("Hello world")
    print("I love you")
    print("Wow")
    ```

![highlight1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/highlight1.png)

반드시 따옴표 안에 줄 번호를 넣어야 합니다. 큰따옴표와 작은 따옴표 모두 사용 가능합니다.

만약 줄 번호 기능을 사용해 줄 번호가 1부터 시작하지 않도록 했다면, 강조할 줄 번호를 입력할 때도 이에 맞춰서 입력해야 합니다.

    ```python linenos:10 highlight:"10,11"
    print("Hello world")
    print("I love you")
    print("Wow")
    ```

![highlight2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/highlight2.png)

### 언어 표시

다음과 같이 하면 Code Block에 Code Block의 언어를 표시할 수 있습니다.

    ```python language
    print("Hello world")
    ```

또는 다음과 같이 할 수도 있습니다.

    ```python language:true
    print("Hello world")
    ```

![language1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/language1.png)

표시되는 언어는 기본적으로 Code Block의 언어를 따라가지만, 만약 원한다면 직접 명시할 수 있습니다. 이렇게 하면 구문 강조(syntax highlighting)는 Code Block의 언어를 따라가게 하면서 표시되는 언어만 바꿀 수 있습니다.

    ```python language:"javascript"
    print("Hello world")
    ```

![language2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/language2.png)

언어를 직접 명시할 때는 반드시 따옴표 안에 언어를 넣어야 합니다. 큰따옴표와 작은 따옴표 모두 사용 가능합니다.

만약 Code Block의 언어도, language 옵션으로 명시한 언어도 없다면, 언어 표시는 설정에서 설정된 값(기본값: "plain text")이 적용됩니다.

다음과 같이 하면 명시적으로 언어를 숨길 수 있습니다.

    ```python language:false
    print("Hello world")
    ```

### 복사 버튼

다음과 같이 하면 Code Block에 복사 버튼을 추가할 수 있습니다.

    ```python copybtn
    print("Hello world")
    ```

또는 다음과 같이 할 수도 있습니다.

    ```python copybtn:true
    print("Hello world")
    ```

![copybtn](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/copybtn.png)

다음과 같이 하면 명시적으로 복사 버튼을 숨길 수 있습니다.

    ```python copybtn:false
    print("Hello world")
    ```

### 프롬프트

다음과 같이 하면 Code Block에 프롬프트를 추가할 수 있습니다.

    ```bash prompt
    mkdir test
    ```

또는 다음과 같이 할 수도 있습니다.

    ```bash prompt:true
    mkdir test
    ```

![prompt1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/prompt1.png)

아무런 옵션을 주지 않으면 프롬프트는 설정에서 설정한 값(기본값: "$")이 사용됩니다. 다른 프롬프트를 사용하고 싶다면 다음과 같이 하면 됩니다.

    ```bash prompt:"#"
    mkdir test
    ```

![prompt2](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/prompt2.png)

프롬프트를 직접 명시할 때는 반드시 따옴표 안에 프롬프트를 넣어야 합니다. 큰따옴표와 작은 따옴표 모두 사용 가능합니다.

줄 끝에 "\" 문자가 있는 경우 다음 줄에는 프롬프트가 표시되지 않습니다.

    ```bash prompt
    docker run -it \
        ubuntu:latest
    ```

![prompt3](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/prompt3.png)

다음과 같이 하면 명시적으로 프롬프트를 숨길 수 있습니다.

    ```bash prompt:false
    mkdir test
    ```

### 실행 결과 표시

다음과 같이 하면 Code Block의 실행 결과를 표시할 수 있습니다.

    ```python
    print("Hello world!")
    ```

    ```result
    Hello world!
    ```

![result1](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/result1.png)

Result Code Block은 반드시 실행 결과를 표시할 Code Block 바로 다음에 위치해야 합니다. 두 Code Block 사이에 어떠한 요소도 있으면 안됩니다.

또 Result Code Block은 Code Block을 실행해 동적으로 생성되는 그런 것이 아닙니다. Result Code Block은 단순한 텍스트 Code Block(plain-text code block)일 뿐입니다. 사용자가 직접 실행 결과를 입력해야 합니다.

Result Code Block에서는 줄 번호, 줄 강조 기능만 사용 가능합니다. 나머지 기능들은 명시해도 무시됩니다.

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

Result Code Block의 프롬프트는 설정에서 설정한 값(기본값: "Result")이 사용됩니다. 다른 프롬프트를 사용하고 싶다면 다음과 같이 하면 됩니다.

    ```python
    import random
    print(random.randint(1, 100))
    ```

    ```result prompt:"Result (may be different depending on your environment)"
    42
    ```

![result3](https://github.com/HeekangPark/obsidian-hk-code-block/raw/master/imgs/result3.png)

## 설정

설정에서는 HK Code Block의 각 기능별 기본 설정을 변경할 수 있습니다.

### Title

- Use Title
  - default off, but on when specified : 기본적으로 제목 기능을 사용하지 않습니다. 하지만 title 옵션을 명시하면 제목 기능을 사용합니다.
  - always off : 제목 기능을 항상 사용하지 않습니다.

### Line numbers

- Use Line Numbers
  - always on : 줄 번호 기능을 항상 사용합니다.
  - default on, but off when specified : 기본적으로 줄 번호 기능을 사용합니다. 하지만 줄 번호 기능을 사용하지 않는다고 명시하면 줄 번호 기능을 사용하지 않습니다.
  - default off, but on when specified : 기본적으로 줄 번호 기능을 사용하지 않습니다. 하지만 줄 번호 기능을 사용한다고 명시하면 줄 번호 기능을 사용합니다.
  - always off : 줄 번호 기능을 항상 사용하지 않습니다.
- Default Line Number Start : 줄의 시작 번호를 설정합니다. 기본값은 1입니다.
- Show Line Number Splitter : 줄 번호와 코드 사이에 구분선을 표시합니다. 기본값은 true입니다.

### Line Highlight

- Use Line Highlight
  - default off, but on when specified : 기본적으로 줄 강조 기능을 사용하지 않습니다. 하지만 줄 강조 기능을 사용한다고 명시하면 줄 강조 기능을 사용합니다.
  - always off : 줄 강조 기능을 항상 사용하지 않습니다.
- Line Highlight Color : 강조색을 설정합니다. 기본값은 #ff0000입니다. 실제 줄 강조에는 여기 명시된 색에 opacity 0.2가 적용된다는 점에 유의하세요.

### Language Indicator

- Use Language Indicator
  - always on : 언어 표시 기능을 항상 사용합니다.
  - default on, but off when specified : 기본적으로 언어 표시 기능을 사용합니다. 하지만 언어 표시 기능을 사용하지 않는다고 명시하면 언어 표시 기능을 사용하지 않습니다.
  - default off, but on when specified : 기본적으로 언어 표시 기능을 사용하지 않습니다. 하지만 언어 표시 기능을 사용한다고 명시하면 언어 표시 기능을 사용합니다.
  - always off : 언어 표시 기능을 항상 사용하지 않습니다.
- Default Language : 언어 표시 기능을 사용할 때 아무런 언어가 명시되지 않았다면 기본으로 사용할 언어를 설정합니다. 기본값은 "plain text"입니다.

### Copy Button

- Use Copy Button
  - always on : 복사 버튼 기능을 항상 사용합니다.
  - default on, but off when specified : 기본적으로 복사 버튼 기능을 사용합니다. 하지만 복사 버튼 기능을 사용하지 않는다고 명시하면 복사 버튼 기능을 사용하지 않습니다.
  - default off, but on when specified : 기본적으로 복사 버튼 기능을 사용하지 않습니다. 하지만 복사 버튼 기능을 사용한다고 명시하면 복사 버튼 기능을 사용합니다.
  - always off : 복사 버튼 기능을 항상 사용하지 않습니다.

### Prompt

- Use Prompt
  - always on : Prompting Languages에 명시된 언어들에 대해, 프롬프트 기능을 항상 사용합니다.
  - default on, but off when specified : Prompting Languages에 명시된 언어들에 대해, 기본적으로 프롬프트 기능을 사용합니다. 하지만 프롬프트 기능을 사용하지 않는다고 명시하면 프롬프트 기능을 사용하지 않습니다.
  - default off, but on when specified : 기본적으로 프롬프트 기능을 사용하지 않습니다. 하지만 프롬프트 기능을 사용한다고 명시하면 프롬프트 기능을 사용합니다.
  - always off : 프롬프트 기능을 항상 사용하지 않습니다.
- Prompting Languages : 프롬프트 기능을 기본적으로 사용할 언어를 설정합니다. 엔터 키로 구분해 여러 개의 언어를 설정할 수 있습니다. 기본값은 "bash"입니다.
- Default Prompt : 프롬프트 기능을 사용할 때 아무런 프롬프트가 명시되지 않았다면 기본으로 사용할 프롬프트를 설정합니다. 기본값은 "$"입니다.

### Result

- Use Result
  - enable : 실행 결과 표시 기능을 사용합니다.
  - disable : 실행 결과 표시 기능을 사용하지 않습니다.
- Default Result Prompt : 실행 결과 표시 Code Block의 프롬프트를 설정합니다. 기본값은 "Result"입니다.

### Developers

- Debug Mode
  - true : 디버그 모드를 활성화해 log를 console에 출력합니다.
  - false : 디버그 모드를 비활성화합니다.

## 라이센스

MIT License

## 알려진 문제점

- 테마별 설정에 따라 몇몇 기능들이 제대로 동작하지 않을 수 있습니다. 2023년 02월 현재, 정상 동작을 시험해본 테마는 다음과 같습니다.
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

- 최초 배포