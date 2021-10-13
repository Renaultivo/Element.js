const fs = require('fs');
const { getFileText } = require('./FileHandler/FileHandler');
const { FileProcessor } = require('./FileProcessor/FileProcessor');

const fileProcessor = new FileProcessor();

let createdFolders = new Array();

let fileDelay = new Object();

function writeFileToBuildFolder(filePath, content) {

  const buffer = Buffer.from(content);

  fs.open(`build/${filePath}`, 'w+', (err, fileDescriptor) => {

    if (!err) {

        fs.write(
          fileDescriptor,
          buffer,
          0,
          buffer.length,
          null,
          (err, written) => {

            fs.close(fileDescriptor, () => {

              if (!err) {
                console.log(`"${filePath}" updated.`);
              } else {
                console.err(`failed to update "${filePath}".`);
              }

            });

          }
        );

    }

  });


}

function updateFile(filePath) {

  fileProcessor.parseFile(filePath).then((content) => {

    writeFileToBuildFolder(filePath, content);

  });

}

function watch(path='.') {

  fs.readdir(path, { withFileTypes: true }, (err, files) => {

    files.forEach((file) => {
      
      const filePath = `${path}/${file.name}`;

      if (file.isDirectory()
      && filePath != './build'
      && createdFolders.indexOf(filePath) == -1) {

        createdFolders.push(filePath);

        fs.mkdir(`build/${filePath}`, () => {
          watch(`${filePath}`);
        });

      } else if (file.isFile()) {

        if (file.name.split('.').pop() == 'js') {
          updateFile(filePath);
        } else {

          fs.copyFile(filePath, `build/${filePath}`, () => {
            console.log(`${filePath} copied.`);
          });

        }

      }

    });

  });

  fs.watch(path, null, (event, filename) => {

    const ext = filename.split(".").pop();
    const filePath = `${path}/${filename}`;
    
    if (ext.toLowerCase() == 'js'
    && event == 'change') {

      if (!fileDelay[filePath]) {

        fileDelay[filePath] = setTimeout(() => {

          updateFile(filePath);
          fileDelay[filePath] = null;

        }, 100);

      }

      /*fileProcessor.parseFile(`${path}/${filename}`).then((content) => {
        console.log(content);
      });*/

    } else {

      fs.copyFile(filePath, `build/${filePath}`, () => {
        console.log(`${filePath} copied.`);
      });

    }
  
  
  });

}

fs.mkdir('build', () => {
  watch();
});
