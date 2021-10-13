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
    } else if (buffer[index] == delimiters[1] && buffer[index-1] != '\\') {

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

  name = name.trim();

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

  let buffer = propsAsText.trim().split('');

  if (buffer[buffer.length-1] == '/') {
    buffer.pop();
  }

  let props = new Array();

  for (let index=0; index<buffer.length; index++) {

    index = skipEmptyScapes(buffer, index);

    let propName = getName(buffer, index);
    let equalCharSearchResult = checkForEqualChar(buffer, propName.index);

    index = equalCharSearchResult.index;

    if (equalCharSearchResult.hasEqualChar) {

      index = skipEmptyScapes(buffer, index+1);

      if (buffer[index] == '"' || buffer[index] == "'") {

        const quote = buffer[index];

        const scope = getScope(
          buffer,
          index+1,
          [
            '',
            quote
          ]
        );

        index = scope.index;

        props.push({
          name: propName.name,
          type: 'string',
          quote: quote,
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

    } else {

      if (propName.name != '') {
        
        props.push({
          name: propName.name,
          type: 'novalueProp'
        });

      }

    }

  }

  return props;

}

function getHTMLTagNameAndPropsAndProps(buffer, index) {

  const name = getName(buffer, index);
  const props = getScope(buffer, name.index, ['<', '>']);

  index = props.index;

  return {
    name: name.name,
    props: parseProps(props.content),
    index
  };

}

function getHTMLTagContent(tagNameAndProps, buffer, index, identation='  ') {

  let content = new Array();

  let counter = 0;

  let textBuffer = '';
 
  function saveTextBuffer() {

    if (textBuffer.trim() != '') {
      
      content.push({
        type: 'string',
        quote: "'",
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
        const currentTagContent = getHTMLTagContent(currentTag.name, buffer, currentTag.index+1, identation + '  ');

        if (currentTag.name == tagNameAndProps) {
          counter++;
        }

        index = currentTagContent.index;
        
        content.push({
          tag: currentTag.name,
          props: currentTag.props,
          type: 'tag',
          identation: currentTagContent.identation,
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
    identation,
    index
  }

}

function parserJSXPropToElementJSProp(prop) {

  let text = '';

  if (prop.type == 'string') {
    text = `${prop.name}: ${prop.quote}${prop.content}${prop.quote},`;
  } else if (prop.type == 'jsx-scope') {
    text = `${prop.name}: ${prop.content},`;
  }

  return text;

}

const elementJSProps = [
  'id',
  'class',
  'style',
  'ripple'
];

function parseJSXContent(content, identation={ current: '', addictional: '' }) {

  let text = '';

  if (Array.isArray(content)) {

    content.forEach((item) => {

      text += parseJSXContent(item, identation);

    });

  } else {

    if (content.type == 'tag') {
      text =  identation.addictional + content.identation + HTML_to_ElementJS_Transpiler([content], identation.addictional);
    } else if (content.type == 'string') {
      text = `\n${identation.current + identation.addictional}${content.quote}${content.content}${content.quote},`;
    } else if (content.type == 'jsx-scope') {
      text = `\n${identation.current + identation.addictional}${content.content},`;
    }

  }

  return text;

}

function HTML_to_ElementJS_Transpiler(contentList, additionalIdentation='') {

  let finalCode = '';

  contentList.forEach((content) => {

    content.identation += additionalIdentation;

    let props = '';
    let attributes = '';

    if (Array.isArray(content.props)) {

      content.props.forEach((prop) => {

        if (elementJSProps.indexOf(prop.name) != -1) {
          props +=  '\n  ' + content.identation + parserJSXPropToElementJSProp(prop);
        } else {
          attributes += '\n  ' + content.identation + parserJSXPropToElementJSProp(prop);
        }

      });

    }

    finalCode += `\n${content.identation}createElement({` + 
      `\n${content.identation}  tag: '${content.tag}',` + 
      `  ${props}` + 
      `\n${content.identation}  attributes: {` + 
      `\n${content.identation}  ${attributes}` + 
      `\n${content.identation}  },` + 
      `\n${content.identation}  content: [` + 
          `${parseJSXContent(content.content, { current: content.identation, addictional: '  ' })}` + 
      `\n${content.identation}  ]` + 
      `\n${content.identation}}),`;

  });

  return finalCode;

}

function getHTMLTag(buffer, index) {

  index++;

  const tagNameAndProps = getHTMLTagNameAndPropsAndProps(buffer, index);
  const tagContent = getHTMLTagContent(tagNameAndProps.name, buffer, tagNameAndProps.index+1);

  const data = {
    tag: tagNameAndProps.name,
    props: tagNameAndProps.props,
    identation: '  ',
    content: tagContent.content
  }

  //console.log(JSON.stringify(data, null, 2))

  index = tagContent.index

  const tagAsJSCode = HTML_to_ElementJS_Transpiler([data]);

  return {
    ...data,
    code: tagAsJSCode,
    index
  }

}

exports.getHTMLTag = getHTMLTag;
