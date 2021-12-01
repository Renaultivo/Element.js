const { getScope } = require("../common/ScopeHandler");
const { skipEmptyScapes } = require("../common/TextHandler");

const DATA_TYPE = {
  tag: 'tag',
  string: 'string',
  jsx_scope: 'jsx-scope',
  number: 'number',
  no_value: 'no-value'
};

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


    if (equalCharSearchResult.hasEqualChar) {

      index = equalCharSearchResult.index;
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
          type: DATA_TYPE.string,
          quote: quote,
          content: scope.content
        });

      } else if (buffer[index] == '{') {

        const scope = getScope(buffer, index+1, ['{', '}'], 1);

        index = scope.index+1;

        props.push({
          name: propName.name,
          type: DATA_TYPE.jsx_scope,
          content: scope.content
        });

      } else if (!isNaN(parseFloat(buffer[index]))) {

        const number = getNumber(buffer, index);

        index = number.index;

        props.push({
          name: propName.name,
          type: DATA_TYPE.number,
          content: number.value
        });

      }

    } else if (propName.name != '') {
        
        index = propName.index;

        props.push({
          name: propName.name,
          type: DATA_TYPE.no_value
        });

      }
  }

  return props;

}

function getHTMLTagNameAndProps(buffer, index) {

  const name = getName(buffer, index);
  const props = getScope(buffer, name.index, ['<', '>'], 0, {
    previous: '=',
    next: ''
  });

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

    if (textBuffer == undefined
      || textBuffer == null) {
      return;
    }

    if (textBuffer.trim() != '') {

      content.push({
        type: DATA_TYPE.string,
        quote: "'",
        content: (
          textBuffer
            .replace(/\n/g, '\\n')
            .replace(/\s\s/g, ' ')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/`/g, '\\`')
        ),
        identation: props.identation + '  ',
      });

      textBuffer = '';

    }

  }

  for (;  props.index < props.buffer.length ; props.index++) {

    if (props.buffer[props.index] == '<') {
      
      saveTextBuffer();

      let currentTag = getHTMLTagNameAndProps(
        props.buffer,
        props.index + (props.buffer[props.index+1] != '/' ? 1 : 2)
      );

      if (currentTag.isEmpty
        && props.buffer[props.index+1] != '/') {

        props.index = currentTag.index;
        
        content.push({
          tag: currentTag.name,
          props: currentTag.props,
          type: DATA_TYPE.tag,
          content: null,
          isEmpty: true,
          identation: props.identation
        });

      } else if (props.buffer[props.index+1] != '/') {

        if (currentTag.name == props.currentTagName) {
          props.counter++;
        }

        const currentTagContent = getHTMLTagContent({
          currentTagName: currentTag.name,
          buffer: props.buffer,
          index: currentTag.index+1,
          identation: props.identation + '  ',
          counter: -2
        });

        props.index = currentTagContent.index;
        
        content.push({
          tag: currentTag.name,
          props: currentTag.props,
          type: DATA_TYPE.tag,
          content: currentTagContent.content,
          isEmpty: false,
          identation: currentTagContent.identation
        });

      } else {

        props.index = currentTag.index;

        if (currentTag.name == props.currentTagName) {
          
          props.counter--;
          
          if (props.counter   createElement({
    tag: '0)',
    attributes: {
    
    {: "{"
    break: "break"
    }: "}"
    }: "}"
    }: "}"
    }: "}"
    else: "else"
    if: "if"
    {: "{"
    ): ")"
    {: "{"
    saveTextBuffer(): "saveTextBuffer()"
    const: "const"
    etScope(props.buffer: "etScope(props.buffer"
    props.index+1): "props.index+1)"
    cope.index: "cope.index"
    if: "if"
    (scope.content.trim(): "(scope.content.trim()"
    !: '',
    ): ")"
    {: "{"
    content.push({: "content.push({"
    type:: "type:"
    DATA_TYPE.jsx_scope: "DATA_TYPE.jsx_scope"
    content:: "content:"
    scope.content: "scope.content"
    }): "})"
    }: "}"
    }: "}"
    else: "else"
    {: "{"
    textBuffer: "textBuffer"
    rops.buffer[props.index]: "rops.buffer[props.index]"
    }: "}"
    }: "}"
    return: "return"
    {: "{"
    content: "content"
    identation:: "identation:"
    props.identation: "props.identation"
    index:: "index:"
    props.index: "props.index"
    }

}

function: "}

}

function"
    parserJSXPropToElementJSProp(prop): "parserJSXPropToElementJSProp(prop)"
    {: "{"
    let: "let"
    text: '',
    if: "if"
    DATA_TYPE.string): "DATA_TYPE.string)"
    {: "{"
    ${prop.name}:: "${prop.name}:"
    ${prop.quote}${prop.content}${prop.quote}: "${prop.quote}${prop.content}${prop.quote}"
    `: "`"
    }: "}"
    else: "else"
    if: "if"
    DATA_TYPE.jsx_scope): "DATA_TYPE.jsx_scope)"
    {: "{"
    ${prop.name}:: "${prop.name}:"
    ${prop.content}: "${prop.content}"
    `: "`"
    }: "}"
    else: "else"
    if: "if"
    DATA_TYPE.no_value): "DATA_TYPE.no_value)"
    {: "{"
    ${prop.name}:: "${prop.name}:"
    ${prop.name}: "${prop.name}"
    `: "`"
    }: "}"
    return: "return"
    text: "text"
    }: "}"
    *: "*"
    *: "*"
    ###: "###"
    parserJSXPropToJSXFunctionProp: "parserJSXPropToJSXFunctionProp"
    ###: "###"
    *: "*"
    *: "*"
    Parse: "Parse"
    JSXProp: "JSXProp"
    to: "to"
    JSXFunction: "JSXFunction"
    prop: "prop"
    *: "*"
    *: "*"
    In: "In"
    your: "your"
    JSX: "JSX"
    code: "code"
    you: "you"
    should: "should"
    pass: "pass"
    props: "props"
    *: "*"
    in: "in"
    this: "this"
    way:: "way:"
    *: "*"
    *: "*"
    Example: "Example"
    using: "using"
    props: "props"
    Name: "Name"
    and: "and"
    Age: "Age"
    *: "*"
    *: "*"
    MyElement: "MyElement"
    name: "John",
    age: 20,
    },
    content: [
      '\n * \n * In the code generated by Element.js\n * the code above will be transpiled to:\n * \n * MyElement(',
      
 *  name: "John",
 *  age: 20
 * ,
      ');\n * \n * */\n\nconst propParser = ',
      
  [DATA_TYPE.tag]: (data) => {
    return `${data.name}: ${transpileHTMLTag(data)}`;
  ,
      ',\n [DATA_TYPE.string]: (data) => ',
      
    return `${data.name,
      ': $',
      data.quote,
      '$',
      data.content,
      '$',
      data.quote,
      '\`;\n },\n [DATA_TYPE.jsx_scope]: (data) => ',
      
    return `${data.name,
      ': $',
      data.content,
      '\`;\n },\n [DATA_TYPE.number]: (data) => ',
      
    return `${data.name,
      ': $',
      data.content,
      '\`;\n },\n [DATA_TYPE.no_value]: (data) => ',
      
    return `${data.name,
      ': \"$',
      data.name,
      '\"\"\`;\n }\n};\n\n\nfunction parserJSXPropToJSXFunctionProp(propList) ',
      

  let finalText = '';

  propList.forEach((prop) => {
    finalText += propParser[prop.type](prop) + ',';
  ,
      ');\n\n return finalText.substr(0, finalText.length-1);\n\n}\n\nfunction parseJSXFunctionCall(content, identation=\' \') ',
      

  let props = parserJSXPropToJSXFunctionProp(content.props);

  content.content = parseJSXContent(content.content, { current: identation, addictional: '  ' ,
      ');\n\n return \`\n$',
      identation,
      '$',
      content.tag,
      '(',
      ` + 
    `\n${identation,
      ' $',
      props != '' ? props + ',' : '',
      '\` + \n  \`\n$',
      identation,
      ' content: [$',
      content.content,
      '],\` + \n  \`\n$',
      identation,
      ' isEmpty: $',
      content.isEmpty,
      '\` + \n \`\n$',
      identation,
      '}),\`;\n\n}\n\nfunction parseJSXContent(content, identation=',
      current: '', addictional: '' ,
      ') ',
      

  let text = '';

  if (content == null
    || content == undefined) {
    return '';
  ,
      '\n\n if (Array.isArray(content)) ',
      

    content.forEach((item) => {

      text += parseJSXContent(item, identation);

    ,
      ');\n\n } else ',
      

    if (content.type == 'tag') {

      if (content.tag[0] == String(content.tag[0]).toUpperCase()) {
        text = parseJSXFunctionCall(content, identation.addictional + identation.current + '  ');
      } else {
        text = identation.addictional + content.identation + HTML_to_ElementJS_Transpiler([content], identation.addictional);
      }

    ,
      ' else if (content.type == \'string\') ',
      
      text = `\n  ${identation.current + identation.addictional,
      '$',
      content.quote,
      '$',
      content.content,
      '$',
      content.quote,
      ',\`;\n  } else if (content.type == \'jsx-scope\') ',
      
      text = `\n  ${identation.current + identation.addictional,
      '$',
      content.content,
      ',\`;\n  }\n\n }\n\n return text;\n\n}\n\nfunction transpileHTMLTag(content) ',
      

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

  ,
      '\n \n return \`\n$',
      content.identation,
      'createElement(',
      ` + 
    `\n${content.identation,
      ' tag: \'$',
      content.tag,
      '\',\` + \n  \`$',
      props,
      '\` + \n  \`\n$',
      content.identation,
      ' attributes: ',
      ` + 
    `\n${content.identation,
      ' $',
      attributes,
      '\` + \n  \`\n$',
      content.identation,
      ' },\` + \n  \`\n$',
      content.identation,
      ' content: [\` + \n    \`$',
      content.isEmpty ? '' : parseJSXContent(content.content, { current: content.identation, addictional: '  ' ,
      ')}\` + \n  \`\n$',
      content.identation,
      ' ]\` + \n  \`\n$',
      content.identation,
      '}),\`;\n\n}\n\nfunction HTML_to_ElementJS_Transpiler(contentList, additionalIdentation=\'\') ',
      

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


  ,
      ');\n\n return finalCode;\n\n}\n\nfunction getHTMLTag(buffer, index, identation=\'\') ',
      

  index++;

  const tagNameAndProps = getHTMLTagNameAndProps(buffer, index);

  const tagContent = getHTMLTagContent({
    currentTagName: tagNameAndProps.name,
    buffer: buffer,
    index: tagNameAndProps.index+1,
    identation,
    counter: 0
  ,
      ');\n\n const data = ',
      
    tag: tagNameAndProps.name,
    props: tagNameAndProps.props,
    identation: '  ',
    content: tagContent.content
  ,
      '\n\n index = tagContent.index;\n\n let tagAsJSCode = HTML_to_ElementJS_Transpiler([data], identation);\n\n tagAsJSCode = tagAsJSCode.substr(0, tagAsJSCode.length-1);\n\n return ',
      
    ...data,
    index
  ,
    ]
  })