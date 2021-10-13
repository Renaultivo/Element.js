const { getHTMLTag, HTML_to_ElementJS_Transpiler } = require("./html/HTMLParser");

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

    for (let i=0; i<buffer.length; i++) {

      if (buffer[i] == '<') {

        if (checkForJSXTag(buffer, i)) {

          let currentTag = getHTMLTag(buffer, i, getPreviousTabSpace(buffer, i-1, 2));
          i = currentTag.index;

          let currentTagCode = HTML_to_ElementJS_Transpiler(currentTag.content, getPreviousTabSpace(buffer, i-1));

          currentTagCode = currentTagCode.substr(0, currentTagCode.length-1) + '\n';

          console.log(currentTagCode);

          finalText += currentTagCode;

        } else {
          finalText += buffer[i];
        }

      } else {

        finalText += buffer[i];

      }

    }

    return finalText;
  
  }

}

exports.Parser = Parser;
