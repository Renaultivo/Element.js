const { createCSSObject } = require("../../libs/elementManager");
const { getScope } = require("./common/ScopeHandler");
const { skipEmptyScapes } = require("./common/TextHandler");
const { getHTMLTag, HTML_to_ElementJS_Transpiler } = require("./html/HTMLParser");

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

  let jsxTag = String('<JSX>').split('');

  for (let i=0; i<jsxTag.length; i++) {

    if (buffer[index + i] != jsxTag[i]) {
      return false;
    }

  }

  return true;

}

class Parser {

  constructor() {

  }

  parse(originalFileContent) {
    
    const buffer = originalFileContent.split('');
    
    let finalText = '';

    let textBuffer = '';

    
    function saveTextBuffer() {

      if (textBuffer.trim() != '') {
        finalText += textBuffer;
        textBuffer = '';
      }

    }

    for (let i=0; i<buffer.length; i++) {

      if (buffer[i] == '<') {

        saveTextBuffer();

        if (checkForJSXTag(buffer, i)) {

          let currentTag = getHTMLTag(buffer, i, getPreviousTabSpace(buffer, i-1, 2));
          i = currentTag.index;

          let currentTagCode = HTML_to_ElementJS_Transpiler(currentTag.content, getPreviousTabSpace(buffer, i-1));

          currentTagCode = currentTagCode.substr(0, currentTagCode.length-1);

          textBuffer += currentTagCode;

        } else {
          textBuffer += buffer[i];
        }

      } else if (invalidNameChars.indexOf(buffer[i]) != -1) {
        textBuffer += buffer[i];
        saveTextBuffer();
      } else if (textBuffer.trim() == 'createCSSObject({') {

        const cssObjectScope = getScope(buffer, i+1, ['{', '}'], 1);

        let template = `({ ${cssObjectScope.content} })`;
        template = template.replace(/\s/g, ' ');
        template = template.replace(/\n/g, ' ');
        template = template.replace(/\\n/g, '');
        template = template.replace(/'/g, '"');

        let content = 'default';

        try {

          content = eval(template);

          const cssObject = createCSSObject(content);

          textBuffer = ` ${JSON.stringify(cssObject.cssObject)};` + 
            `\ncreateElement({tag:"style",content:'${cssObject.cssText}'}).addTo(document.head)`;
          saveTextBuffer();

          i = skipEmptyScapes(buffer, cssObjectScope.index) + 1;

        } catch(error) {}

      } else if (textBuffer.trim() == 'import ') {

      } else {

        textBuffer += buffer[i];

      }

    }

    saveTextBuffer();

    return finalText;
  
  }

}

exports.Parser = Parser;
