const { skipEmptyScapes } = require("./TextHandler");

function getScope(buffer, index, delimiters = ['{', '}'], counter=0) {

  let content = '';

  index = skipEmptyScapes(buffer, index);

  for (;  index < buffer.length ; index++) {

    if (buffer[index] == delimiters[0]) {
      counter++;
    } else if (buffer[index] == delimiters[1] && buffer[index-1] != '\\') {

      counter--;
      
      if (counter <= 0) {
        break;
      }

    }

    content += buffer[index];

  }
  
  return {
    content,
    index
  }

}

exports.getScope = getScope;
