const { getHTMLTag } = require("./html/HTMLParser");


class Parser {

  constructor() {

  }

  parse(originalFileContent) {
    
    const buffer = originalFileContent.split('');
    
    let finalText = '';

    for (let i=0; i<buffer.length; i++) {

      if (buffer[i] == '<') {
        let currentTag = getHTMLTag(buffer, i);
        i = currentTag.index;
        finalText += currentTag.code;
      } else {

        finalText += buffer[i];

      }

    }

    console.log(finalText);
  
  }

}

exports.Parser = Parser;
