const fs = require('fs');
const { getFileText } = require('../FileHandler/FileHandler');
const { Parser } = require('./Parser/Parser');

class FileProcessor {

  constructor() {

    this.parser = new Parser();

  }

  parseFile(fileName) {

    return new Promise((resolve, reject) => {

      getFileText(fileName).then(result => {

        if (result.indexOf('!Element.js') != -1) {
          resolve(result);
          return;
        }

        let parserResult = this.parser.parse(result);
        
        resolve(parserResult);

      }, err => {
        reject(`failed to load '${fileName}' :c`);
      });

    });

  }  

}

exports.FileProcessor = FileProcessor;
