const invalidNameChars = [
  ' ', '<', '>', '=', '/', '\\', '-', '"', '\'', '?', ';', ','
];


const validHTLMTags = [
  ''
];

function skipEmptyScapes(buffer, index) {

  for (; buffer[index] == ' '; index++);

  return index;

}

function getScope(buffer, index, delimiters = ['{', '}']) {

  let content = '';

  index = skipEmptyScapes(buffer, index);

  let scopeCounter = 0;

  for (;  index < buffer.length ; index++) {

    if (buffer[index] == delimiters[0]) {
      scopeCounter++;
    } else if (buffer[index] == delimiters[1]) {

      scopeCounter--;
      
      if (scopeCounter <= 0) {
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

function getName(buffer, index) {

  let name = '';

  index = skipEmptyScapes(buffer, index);

  for (; index < buffer.length && invalidNameChars.indexOf(buffer[index]) == -1; index++) {
    name += buffer[index];
  }

  return {
    name,
    index
  };

}

function checkForEqualChar(buffer, index) {

  index = skipEmptyScapes(buffer, index);

  return {
    index,
    hasEqualChar: buffer[index] == '='
  };

}

function getNumber(buffer, index) {

  let numberAsString = '';

  for (; index<buffer.length; index++) {

    let char = String(buffer[index]).toLocaleLowerCase();

    if (isNaN(parseFloat(buffer[index]))
    && char != 'x'
    && char != 'b'
    && char != '_') {
      break;
    }

    numberAsString += buffer[index];

  }

  return {
    value: numberAsString,
    index
  }

}

function parseProps(propsAsText) {

  console.log(propsAsText);

  let buffer = propsAsText.trim().split('');

  let props = new Array();

  for (let index=0; index<buffer.length; index++) {

    index = skipEmptyScapes(buffer, index);

    let propName = getName(buffer, index);
    let hasEqualChar = checkForEqualChar(buffer, propName.index);

    index = hasEqualChar.index;

    if (hasEqualChar.hasEqualChar) {

      index = skipEmptyScapes(buffer, index+1);

      if (buffer[index] == '"' || buffer[index] == "'") {

        const scope = getScope(
          buffer,
          index,
          [
            '',
            buffer[index]
          ]
        );

        index = scope.index;

        props.push({
          name: propName.name,
          type: 'string',
          content: scope.content
        });

      } else if (buffer[index] == '{') {

        const scope = getScope(buffer, index+1);

        index = scope.index;

        props.push({
          name: propName.name,
          type: 'jsx-scope',
          content: scope.content
        });

      } else if (!isNaN(parseFloat(buffer[index]))) {

        const number = getNumber(buffer, index);

        index = number.index;

        props.push({
          name: propName.name,
          type: 'number',
          content: number.value
        });

      }

    }

  }

  return props;

}

function getHTMLTagNameAndPropsAndProps(buffer, index) {

  const name = getName(buffer, index);
  const props = getScope(buffer, name.index, ['<', '>']);

  if (props.content.trim() != '') {
    console.log(parseProps(props.content));
    console.log('');
  }

  index = props.index;

  return {
    name: name.name,
    props: props.content,
    index
  };

}

function getHTMLTagContent(tagNameAndProps, buffer, index) {

  let content = new Array();

  let counter = 0;

  let textBuffer = '';
 
  function saveTextBuffer() {

    if (textBuffer.trim() != '') {
      
      content.push({
        type: 'text',
        content: textBuffer
      });

      textBuffer = '';

    }

  }

  for (;  index < buffer.length ; index++) {

    if (buffer[index] == '<') {
      
      saveTextBuffer();

      if (buffer[index+1] != '/') {

        let currentTag = getHTMLTagNameAndPropsAndProps(buffer, index+1);
        const currentTagContent = getHTMLTagContent(currentTag.name, buffer, currentTag.index+1);

        if (currentTag.name == tagNameAndProps) {
          counter++;
        }

        index = currentTagContent.index;
        
        content.push({
          tag: currentTag.name,
          props: currentTag.props,
          type: 'tag',
          content: currentTagContent.content
        });

      } else {

        let currentTag = getHTMLTagNameAndPropsAndProps(buffer, index+2);

        index = currentTag.index;

        if (currentTag.name == tagNameAndProps) {
          counter--;
        }

        if (counter < 0) {
          break;
        }
        
        // TODO
        //content += `</${currentTag.name}>`;

      }

    } else if (buffer[index] == '{') {
      
      saveTextBuffer();

      const scope = getScope(buffer, index+1);

      index = scope.index;

      if (scope.content.trim() != '') {

        content.push({
          type: 'jsx-scope',
          content: scope.content
        });

      }

    } else {
      textBuffer += buffer[index];
    }

  }

  return {
    content,
    index
  }

}

function HTML_to_ElementJS_Transpiler(contentList) {

  //console.log(JSON.stringify(contentList, null, 2));

}

function getHTMLTag(buffer, index) {

  index++;

  const tagNameAndProps = getHTMLTagNameAndPropsAndProps(buffer, index);
  const tagContent = getHTMLTagContent(tagNameAndProps.name, buffer, tagNameAndProps.index+1);

  const data = {
    tag: tagNameAndProps.name,
    props: tagNameAndProps.props,
    content: tagContent.content
  }

  index = tagContent.index

  HTML_to_ElementJS_Transpiler(data);

  return {
    ...data,
    index
  }

}

exports.getHTMLTag = getHTMLTag;
