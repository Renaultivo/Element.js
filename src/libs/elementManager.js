function verify(data) {
  return data != null && data != undefined && data != NaN && typeof data != "undefined";
}

exports.verify = verify;

let upperCaseLetters = ['_', 'A', 'B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

let lowerCaseLetters = ['_', 'a', 'b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

let cssEvents = [
  'hover', 'focus', 'active',
  'valid', 'root', 'checked'
];

function JSStyleToCss(code) {

  let finalCode = '';


  for (let ob in code) {

    let propName = ob.split('');

    for (let l = 0; l < propName.length; l++) {
      let verifyLetter = upperCaseLetters.indexOf(propName[l]);
      if (verifyLetter != -1) {
        propName[l] = '-' + lowerCaseLetters[verifyLetter];
      }
      finalCode += propName[l];
    }

    finalCode += ':' + code[ob] + ';';

  }

  return finalCode;

}

exports.JSStyleToCss = JSStyleToCss;

let elementManagerCSSNames = new Array();
let elementManagerCSSElement = null;

function getCSSRandomName() {

  let randomString = '';
  let elementManagerCSSLetters = upperCaseLetters.concat(lowerCaseLetters);

  for (let i = 0; i < 7; i++) {
    randomString += elementManagerCSSLetters[Math.floor(Math.random() * elementManagerCSSLetters.length)];
  }

  return randomString;

}

function setCSSSelectors(jsStyleName, jsObject) {

  for (let event in jsObject) {
    elementManagerCSSElement.addText(`.${jsStyleName}:${event} {${JSStyleToCss(jsObject[event])}} `);
  }

}

exports.setCSSSelectors = setCSSSelectors;

function setCSSChildren(jsStyleName, jsObject) {

  for (let child in jsObject) {
    elementManagerCSSElement.addText(`.${jsStyleName} ${child} {${JSStyleToCss(jsObject[child])}} `);
  }

}

exports.setCSSChildren = setCSSChildren;

function createCSS(style) {

  let styleName = getCSSRandomName();

  if (elementManagerCSSNames.indexOf(styleName) != -1) {

    while (elementManagerCSSNames.indexOf(styleName) != -1) {
      styleName = getCSSRandomName();
    }

  }

  elementManagerCSSNames.push(styleName);

  return {
    name: styleName,
    cssText: JSStyleToCss(style, styleName)
  };

}

exports.createCSS = createCSS;

function createCSSObject(jsObject) {

  let cssObject = new Object();
  let cssText = '';

  function addCSSStyle(name, styleObj) {

    let style = createCSS(styleObj);

    cssText += `.${style.name} {${style.cssText}} `;

    return style.name;

  }

  for (let key in jsObject) {

    let firstKey = Object.keys(jsObject[key])[0];
    let objFirstValue = jsObject[key][firstKey];

    if (typeof objFirstValue == 'object') {

      cssObject[key] = new Object();

      for (let prop in jsObject[key]) {

        firstKey = Object.keys(jsObject[key][prop])[0];

        if (typeof jsObject[key][prop][firstKey] == 'object') {

          let style = createCSSObject(jsObject[key][prop]);

          cssObject[key][prop] = style.cssObject;
          cssText += style.cssText;

        } else {

          cssObject[key][prop] = addCSSStyle(prop, jsObject[key][prop]);

        }

      }

    } else if (typeof objFirstValue == 'string' || typeof objFirstValue == 'number') {

      cssObject[key] = addCSSStyle(key, jsObject[key]);

    }

  }

  return {
    cssObject,
    cssText
  };

}

exports.createCSSObject = createCSSObject;

function setStyle(element, style) {

  for (let prop in style) {
    element.style[prop] = style[prop];
  }

  return element;

}