const { createCSSObject } = require("../../libs/elementManager");
const { getTextUntil } = require("./common/Intervals");
const { getScope } = require("./common/ScopeHandler");
const { skipEmptyScapes } = require("./common/TextHandler");
const { getHTMLTag, HTML_to_ElementJS_Transpiler, transpileHTMLTag, parseJSXContent, parseJSXFunctionCall } = require("./html/HTMLParser");
const { State } = require("./state/State");

const alphabetRegex = new RegExp(/[a-zA-Z]/);

const invalidNameChars = [
  ' ', '<', '>', '=', '/', '\\', '-', '"', '\'', '?', ';', ','
];

function getNameBackwards(buffer, index) {

  let name = '';

  for (; !alphabetRegex.test(buffer[index]) && index - 1 > 0; index--);

  for (; index > 0; index--) {

    if (alphabetRegex.test(buffer[index])) {
      name = buffer[index] + name;
    } else {
      break;
    }

  }

  return name;

}

function getPreviousTabSpace(buffer, index, ignore = 0) {

  let space = '';

  for (; index > 0; index--) {

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

  for (; index < buffer.length; index++) {

    if (invalidNameChars.indexOf(buffer[index]) != -1) {
      break;
    }

    nameLength++;

  }

  return nameLength > 0;

}

function parseStyle(buffer, i) {

  const cssObjectScope = getScope(buffer, i, ['{', '}'], 0);
  let textBuffer = '';

  let template = `({ ${cssObjectScope.content} })`;
  template = template.replace(/\s/g, ' ');
  template = template.replace(/\n/g, ' ');
  template = template.replace(/\\n/g, '');
  template = template.replace(/'/g, '"');
  template = template.replace(/\`(.*?)\`/g, (match) => {
    return `")<-${match}->("`
  });
  template = template.replace(/([a-zA-Z]*)\:/gm, (match) => {
    return `"${match.split(':')[0]}":`
  });

  let content = 'default';

  try {

    content = eval(template);

    const cssObject = createCSSObject(content);

    cssObject.cssText = cssObject.cssText.replace(/\)\<\-(.*?)\-\>\(/g, (match) => {
      return `'+${match.substring(3, match.length - 3)}+'`;
    });

    textBuffer = ` parseObjectKeysToStyleString(${JSON.stringify(cssObject.cssObject)});` +
      `\ncreateElement({tag:"style",content:'${cssObject.cssText}'}).addTo(document.head)`;

    i = skipEmptyScapes(buffer, cssObjectScope.index) + 1;

  } catch (error) { 
    console.log("Failed to parse style!", error);
  }

  return {
    i,
    text: textBuffer
  }

}

function getLiteralString(buffer, index, ignore = 0) {

  let stringLiteralContent = '';

  let quoteChar = buffer[index];

  // skip string first quote before starting loop
  index++;

  for (; index < buffer.length; index++) {

    if (buffer[index] == quoteChar) {
      break;
    }

    stringLiteralContent += buffer[index];

  }

  return {
    literalStringContent: (quoteChar + stringLiteralContent + quoteChar),
    index
  }

}

class Parser {

  constructor() {

  }

  prepare(text) {

    text = text.replace(/(for)\s\((.*?)\)/gm, (match, a, b) => {
      return match.replace(/\</gm, '_({0})_');
    });

    return text;

  }

  parse(originalFileContent) {

    originalFileContent = this.prepare(originalFileContent);

    const buffer = originalFileContent;

    let finalText = '';

    let textBuffer = '';

    let states = new Array();

    function saveTextBuffer() {

      if (textBuffer.trim() != '') {
        finalText += textBuffer;
        textBuffer = '';
      }

    }

    for (let i = 0; i < buffer.length; i++) {

      if (textBuffer.trim() == 'State(') {

        const name = getNameBackwards(buffer, i - 8);
        const value = getScope(buffer, i, ['(', ')'], -1);

        i = value.index;

        states.push(name);

        textBuffer = textBuffer.replace(/State\(/gm, '') + `(${value.content})`;

        saveTextBuffer();

      }
      else if (/[´'"`]/.test(buffer[i])) {

        const literalString = getLiteralString(buffer, i);

        i = literalString.index;
        textBuffer += literalString.literalStringContent;
        saveTextBuffer();

      }
      else if (buffer[i] == '<' && (!/[\'|\"|\`|\!|\/|\{|\}|\\|\/]/.test(buffer[i - 1]))
        && (!/[a-zA-Z]/.test(buffer[i - 1]))) {

        saveTextBuffer();

        if (checkForJSXTag(buffer, i + 1)) {

          let currentTag = getHTMLTag(buffer, i, getPreviousTabSpace(buffer, i - 1, 2));
          i = currentTag.index;

          let currentTagCode = (currentTag.tag[0] == String(currentTag.tag[0]).toUpperCase() ? parseJSXFunctionCall(currentTag) : parseJSXContent(currentTag));

          // if (currentTag.tag == 'JSX') {
          //   currentTagCode = HTML_to_ElementJS_Transpiler(currentTag.content);
          // } else {
          //   currentTagCode = transpileHTMLTag(currentTag);
          // }

          if (currentTagCode == '') {
            currentTagCode = transpileHTMLTag(currentTag);
          }

          currentTagCode = currentTagCode.substring(1, currentTagCode.length - 1);

          textBuffer += currentTagCode;

        } else {
          textBuffer += buffer[i];
          saveTextBuffer();
        }

      }
      else if (invalidNameChars.indexOf(buffer[i]) != -1) {

        saveTextBuffer();

        if (buffer[i] == '/' && buffer[i + 1] == '*') {


          for (; (buffer[i] != '*' || buffer[i + 1] != '/') && i < buffer.length; i++) {
            finalText += buffer[i];
          }

          textBuffer += buffer[i];
          saveTextBuffer();

          continue;

        }
        else if (buffer[i] == '/' && buffer[i + 1] == '/' && buffer[i + 2] == '@') {

          let nextWord = buffer.substring(i + 2).split('\n')[0];
          
          switch (nextWord.trim().toLowerCase()) {

            case "@styles": {

              i += (nextWord.length + 3);

              let t = getTextUntil(buffer, i, '{');

              textBuffer += t.text;
              saveTextBuffer();

              let style = parseStyle(buffer, t.index+1);
              textBuffer = style.text;
              
              saveTextBuffer();

              i = style.i;

              break;

            }

          }

        }

        textBuffer += buffer[i];

        saveTextBuffer();

      }
      else if (textBuffer.trim() == 'createCSSObject({') {

        let style = parseStyle(buffer, i);

        textBuffer = style.text;
        saveTextBuffer();

        i = style.i;

      }
      else {

        textBuffer += buffer[i];

      }

    }

    saveTextBuffer();

    finalText = finalText.replace(/_\(\{0\}\)_/gm, '<');
    finalText = State(finalText, states);

    return finalText;

  }

}

exports.Parser = Parser;
