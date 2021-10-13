const { getScope } = require("../common/ScopeHandler");
const { skipEmptyScapes } = require("../common/TextHandler");


const invalidNameChars = [
  ' ', '<', '>', '=', '/', '\\', '-', '"', '\'', '?', ';', ','
];

const elementJSProps = [
  'id',
  'class',
  'style',
  'ripple',
  'event'
];



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

        const scope = getScope(buffer, index+1, ['{', '}'], 1);

        index = scope.index+1;

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

    } else if (propName.name != '') {
        
        props.push({
          name: propName.name,
          type: 'novalueProp'
        });

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
    isEmpty: props.content[props.content.length-1] == '/',
    index
  };

}

function getHTMLTagContent(props) {

  let content = new Array();

  let textBuffer = '';
 
  function saveTextBuffer() {

    if (textBuffer.trim() != '') {

      content.push({
        type: 'string',
        quote: "'",
        content: textBuffer.trim().replace(/\n/g, '\\n').replace(/  /g, ''),
        identation: props.identation + '  ',
      });

      textBuffer = '';

    }

  }

  for (;  props.index < props.buffer.length ; props.index++) {

    if (props.buffer[props.index] == '<') {
      
      saveTextBuffer();

      let currentTag = getHTMLTagNameAndPropsAndProps(
        props.buffer,
        props.index + (props.buffer[props.index+1] != '/' ? 1 : 2)
      );

      if (currentTag.isEmpty
        && props.buffer[props.index+1] != '/') {

        props.index = currentTag.index;
        
        content.push({
          tag: currentTag.name,
          props: currentTag.props,
          type: 'tag',
          content: null,
          isEmpty: true,
          identation: props.identation
        });

      } else if (props.buffer[props.index+1] != '/') {

        console.log('second else if ', props.buffer[props.index+1]);

        if (currentTag.name == props.currentTagName) {
          props.counter++;
        }

        const currentTagContent = getHTMLTagContent({
          currentTagName: currentTag.name,
          buffer: props.buffer,
          index: currentTag.index+1,
          identation: props.identation + '  ',
          counter: -1
        });

        props.index = currentTagContent.index;
        
        content.push({
          tag: currentTag.name,
          props: currentTag.props,
          type: 'tag',
          content: currentTagContent.content,
          isEmpty: false,
          identation: currentTagContent.identation
        });

      } else {

        props.index = currentTag.index;

        if (currentTag.name == props.currentTagName) {
          
          props.counter--;
          
          if (props.counter < 0) {
            break;
          }

        }
        
        // TODO
        //content += `</${currentTag.name}>`;

      }

    } else if (props.buffer[props.index] == '{') {
      
      saveTextBuffer();

      const scope = getScope(props.buffer, props.index+1);

      props.index = scope.index;

      if (scope.content.trim() != '') {

        content.push({
          type: 'jsx-scope',
          content: scope.content
        });

      }

    } else {
      textBuffer += props.buffer[props.index];
    }

  }

  return {
    content,
    identation: props.identation,
    index: props.index
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

function parseJSXFunction(content, identation='  ') {

  console.log(content.content);

  return `\n${identation}${content.tag}({` + 
    `\n${identation}  props: ${JSON.stringify(content.props)},` + 
    `\n${identation}  content: ${JSON.stringify(content.content)},` + 
    `\n${identation}  isEmpty: ${content.isEmpty}` + 
  `\n${identation}}),`;

}

function parseJSXContent(content, identation={ current: '', addictional: '' }) {

  let text = '';

  if (Array.isArray(content)) {

    content.forEach((item) => {

      text += parseJSXContent(item, identation);

    });

  } else {

    if (content.type == 'tag') {

      if (content.tag[0] == String(content.tag[0]).toUpperCase()) {
        text = parseJSXFunction(content, identation.addictional + content.identation);
      } else {
        text = identation.addictional + content.identation + HTML_to_ElementJS_Transpiler([content], identation.addictional);
      }

    } else if (content.type == 'string') {
      text = `\n${identation.current + identation.addictional}${content.quote}${content.content.trim()}${content.quote},`;
    } else if (content.type == 'jsx-scope') {
      text = `\n${identation.current + identation.addictional}${content.content},`;
    }

  }

  return text;

}

function transpileHTMLTag(content) {

  let props = '';
  let attributes = '';

  if (Array.isArray(content.props)) {

    content.props.forEach((prop) => {

      if (elementJSProps.indexOf(prop.name) != -1) {
        props +=  '\n    ' + content.identation + parserJSXPropToElementJSProp(prop);
      } else {
        attributes += '\n    ' + content.identation + parserJSXPropToElementJSProp(prop);
      }

    });

  }
  
  return `\n${content.identation}createElement({` + 
    `\n${content.identation}  tag: '${content.tag}',` + 
    `  ${props}` + 
    `\n${content.identation}  attributes: {` + 
    `\n${content.identation}  ${attributes}` + 
    `\n${content.identation}  },` + 
    `\n${content.identation}  content: [` + 
        `${ content.isEmpty ? '' : parseJSXContent(content.content, { current: content.identation, addictional: '  ' })}` + 
    `\n${content.identation}  ]` + 
    `\n${content.identation}}),`;

}

function HTML_to_ElementJS_Transpiler(contentList, additionalIdentation='') {

  let finalCode = '';

  contentList.forEach((content) => {

    if (content.type == 'tag') {

      content.identation += additionalIdentation;
      finalCode += transpileHTMLTag(content);

    } else {

      finalCode += parseJSXContent(content, {
        current: content.identation,
        addictional: additionalIdentation
      });

    }


  });

  return finalCode;

}

function getHTMLTag(buffer, index, identation='') {

  index++;

  const tagNameAndProps = getHTMLTagNameAndPropsAndProps(buffer, index);

  const tagContent = getHTMLTagContent({
    currentTagName: tagNameAndProps.name,
    buffer: buffer,
    index: tagNameAndProps.index+1,
    identation,
    counter: 0
  });

  const data = {
    tag: tagNameAndProps.name,
    props: tagNameAndProps.props,
    identation: '  ',
    content: tagContent.content
  }

  index = tagContent.index;

  let tagAsJSCode = HTML_to_ElementJS_Transpiler([data], identation);

  tagAsJSCode = tagAsJSCode.substr(0, tagAsJSCode.length-1);

  return {
    ...data,
    index
  }

}

exports.getHTMLTag = getHTMLTag;
exports.HTML_to_ElementJS_Transpiler = HTML_to_ElementJS_Transpiler;
