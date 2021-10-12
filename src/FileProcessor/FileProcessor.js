const fs = require('fs');
const { getFileText } = require('../FileHandler/FileHandler');
const { Parser } = require('./Parser/Parser');

class FileProcessor {

  constructor(fileName = null) {

    this.parser = new Parser();

    if (fileName) {
      this.loadFile(fileName);
    }

  }

  loadFile(fileName) {

    getFileText(fileName).then(result => {

      this.parser.parse(result);

    }, err => {
      console.log('failed :c');
    });

  }  

}

exports.FileProcessor = FileProcessor;
