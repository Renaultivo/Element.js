const fs = require('fs');

function getFileText(fileName) {

  return new Promise((resolve, reject) => {

    fs.readFile(fileName, null, (err, data) => {
    
      if (!err) {
        resolve(data.toString());
      } else {
        reject(err);
      }
  
    });

  });

}

exports.getFileText = getFileText;
