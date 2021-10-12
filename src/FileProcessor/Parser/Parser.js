const { getHTMLTag } = require("./html/HTMLParser");


class Parser {

  constructor() {

  }

  parse(originalFileContent) {
    
    const buffer = originalFileContent.split('');
    
    for (let i=0; i<buffer.length; i++) {

      if (buffer[i] == '<') {
        let currentTag = getHTMLTag(buffer, i);
        i = currentTag.index;
        //console.log(JSON.stringify(currentTag.content, null, 2));
      }

    }

  
  }

}

exports.Parser = Parser;
