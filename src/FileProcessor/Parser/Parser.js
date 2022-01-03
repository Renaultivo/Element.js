const { createCSSObject } = require("../../libs/elementManager");
const { getScope } = require("./common/ScopeHandler");
const { skipEmptyScapes } = require("./common/TextHandler");
const { getHTMLTag, HTML_to_ElementJS_Transpiler, transpileHTMLTag, parseJSXContent, parseJSXFunctionCall } = require("./html/HTMLParser");

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
      break;
    }

    nameLength++;

  }

  return nameLength > 0;

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

        if (checkForJSXTag(buffer, i+1)) {

          let currentTag = getHTMLTag(buffer, i, getPreviousTabSpace(buffer, i-1, 2));
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

          currentTagCode = currentTagCode.substring(1, currentTagCode.length-1);

          textBuffer += currentTagCode;

        } else {
          textBuffer += buffer[i];
        }

      } else if (invalidNameChars.indexOf(buffer[i]) != -1) {
        
        saveTextBuffer();

        if (buffer[i] == '/' && buffer[i+1] == '*') {
            
          
          for (; (buffer[i] != '*' || buffer[i+1] != '/') && i<buffer.length; i++) {
            finalText += buffer[i];
          }
          
          textBuffer += buffer[i];
          saveTextBuffer();

          continue;

        }

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

    return finalText.replace(/_\(\{0\}\)_/gm, '<');
  
  }

}

exports.Parser = Parser;
