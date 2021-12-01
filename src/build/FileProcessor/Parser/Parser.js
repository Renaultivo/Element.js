const { createCSSObject } = require("../../libs/elementManager");
const { getScope } = require("./common/ScopeHandler");
const { skipEmptyScapes } = require("./common/TextHandler");
const { getHTMLTag, HTML_to_ElementJS_Transpiler, transpileHTMLTag } = require("./html/HTMLParser");

const invalidNameChars = [
  ' ', '<', '>', '=', '/', '\\', '-', '"', '\'', '?', ';', ','
];

function getPreviousTabSpace(buffer, index, ignore=0) {

  let space = '';

  for (; index>0; index--) {

    if (buffer[index] == ' ') {

      if (ignore > 0) {
        ignore--;
        continue;
      }

      space += ' ';
    } else {
      break;
    }

  }

  return space;

}

function checkForJSXTag(buffer, index) {

  let nameLength = 0;

  for (; index<buffer.length; index++) {
    
    if (invalidNameChars.indexOf(buffer[index]) != -1) {
      nameLength++;
      break;
    }

  }

  return nameLength > 0;

}

class Parser {

  constructor() {

  }

  prepare(text) {

    text = text.replace(/(for|while)\s*\((.*?)\)/gm, (match, a, b) => {
      return match.replace(/\  createElement({
    tag: '',
    style: "style"
    attributes: {
    
    gm: "gm"
    <: "<"
    ): ")"
    }): "})"
    ext.replace(: "ext.replace("
    [: "["
    `](.*: "`](.*"
    )[: ")["
    `]: "`]"
    gm: "gm"
    (match: "(match"
    a: "a"
    {: "{"
    return: "return"
    match.replace(: "match.replace("
    gm: "gm"
    <: "<"
    ): ")"
    }): "})"
    return: "return"
    text: "text"
    }: "}"
    parse(originalFileContent): "parse(originalFileContent)"
    {: "{"
    his.prepare(originalFileContent): "his.prepare(originalFileContent)"
    const: "const"
    riginalFileContent.split(: "riginalFileContent.split("
    ): ")"
    let: "let"
    finalText: '',
    let: "let"
    textBuffer: '',
    function: "function"
    saveTextBuffer(): "saveTextBuffer()"
    {: "{"
    if: "if"
    (textBuffer.trim(): "(textBuffer.trim()"
    !: '',
    ): ")"
    {: "{"
    finalText: "finalText"
    extBuffer: "extBuffer"
    textBuffer: '',
    }: "}"
    }: "}"
    for: "for"
    (let: "(let"
    
    i<buffer.length: "i<buffer.length"
    i++): "i++)"
    {: "{"
    if: "if"
    <: "<"
    ): ")"
    {: "{"
    saveTextBuffer(): "saveTextBuffer()"
    if: "if"
    (checkForJSXTag(buffer: "(checkForJSXTag(buffer"
    i+1)): "i+1))"
    {: "{"
    let: "let"
    etHTMLTag(buffer: "etHTMLTag(buffer"
    i: "i"
    getPreviousTabSpace(buffer: "getPreviousTabSpace(buffer"
    i: "i"
    1: "1"
    2)): "2))"
    urrentTag.index: "urrentTag.index"
    console.log(: "console.log("
    currentTag: "currentTag"
    currentTag): "currentTag)"
    let: "let"
    urrentTag.tag: "urrentTag.tag"
    !: 'JSX',
    transpileHTMLTag(currentTag): "transpileHTMLTag(currentTag)"
    :: ":"
    transpileHTMLTag(currentTag.content[0]): "transpileHTMLTag(currentTag.content[0])"
    urrentTagCode.substr(1: "urrentTagCode.substr(1"
    currentTagCode.length: "currentTagCode.length"
    2): "2)"
    textBuffer: "textBuffer"
    urrentTagCode: "urrentTagCode"
    }: "}"
    else: "else"
    {: "{"
    textBuffer: "textBuffer"
    uffer[i]: "uffer[i]"
    }: "}"
    }: "}"
    else: "else"
    if: "if"
    (invalidNameChars.indexOf(buffer[i]): "(invalidNameChars.indexOf(buffer[i])"
    1): "1)"
    {: "{"
    textBuffer: "textBuffer"
    uffer[i]: "uffer[i]"
    saveTextBuffer(): "saveTextBuffer()"
    }: "}"
    else: "else"
    if: "if"
    createCSSObject({: "createCSSObject({"
    ): ")"
    {: "{"
    const: "const"
    etScope(buffer: "etScope(buffer"
    i+1: "i+1"
    [: "["
    {: "{"
    }: "}"
    ]: "]"
    1): "1)"
    let: "let"
    ({: "({"
    ${cssObjectScope.content}: "${cssObjectScope.content}"
    })`: "})`"
    emplate.replace(: "emplate.replace("
    s: "s"
    g: "g"
    ): ")"
    emplate.replace(: "emplate.replace("
    n: "n"
    g: "g"
    ): ")"
    emplate.replace(: "emplate.replace("
    n: "n"
    g: "g"
    ): ")"
    emplate.replace(: "emplate.replace("
    g: "g"
    ): ")"
    let: "let"
    content: 'default',
    try: "try"
    {: "{"
    val(template): "val(template)"
    const: "const"
    reateCSSObject(content): "reateCSSObject(content)"
    ${JSON.stringify(cssObject.cssObject)}: "${JSON.stringify(cssObject.cssObject)}"
    `: "`"
    +: "+"
    `: "`"
    ncreateElement({tag:: "ncreateElement({tag:"
    content:: "content:"
    ${cssObject.cssText}: "${cssObject.cssText}"
    }).addTo(document.head)`: "}).addTo(document.head)`"
    saveTextBuffer(): "saveTextBuffer()"
    kipEmptyScapes(buffer: "kipEmptyScapes(buffer"
    cssObjectScope.index): "cssObjectScope.index)"
    +: "+"
    1: "1"
    }: "}"
    catch(error): "catch(error)"
    {}: "{}"
    }: "}"
    else: "else"
    if: "if"
    import: "import"
    ): ")"
    {: "{"
    }: "}"
    else: "else"
    {: "{"
    textBuffer: "textBuffer"
    uffer[i]: "uffer[i]"
    }: "}"
    }: "}"
    saveTextBuffer(): "saveTextBuffer()"
    return: "return"
    finalText.replace(: "finalText.replace("
    _: "_"
    (: "("
    {0: "{0"
    }: "}"
    )_: ")_"
    gm: "gm"
    <: "<"
    ): ")"
    arser: "arser"
    },
    content: [
    ]
  })