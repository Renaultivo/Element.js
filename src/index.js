const fs = require('fs');
const { getFileText } = require('./FileHandler/FileHandler');
const { FileProcessor } = require('./FileProcessor/FileProcessor');
const { ReleaseParser } = require('./FileProcessor/ReleaseParser/ReleaseParser');

let SETTINGS = {
  buildFolder: 'build',
  release: false
};

const fileProcessor = new FileProcessor();

let createdFolders = new Array();

let fileDelay = new Object();

function writeFileToBuildFolder(filePath, content) {

  const buffer = Buffer.from(content);

  fs.open(`${SETTINGS.buildFolder}/${filePath}`, 'w+', (err, fileDescriptor) => {

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

function checkFileRootAndUpdateFile(filePath, content) {

  let fileFolder = `${SETTINGS.buildFolder}/${filePath}`;
  fileFolder = fileFolder.replace(fileFolder.split('/').pop(), '');

  if (!fs.existsSync(fileFolder)) {

    fs.mkdir(fileFolder, () => {
      watch(filePath);
      writeFileToBuildFolder(filePath, content);
      console.log(`folder ${fileFolder} created.`);
    });

  } else {
    writeFileToBuildFolder(filePath, content);
  }

}

function updateFile(filePath) {

  fileProcessor.parseFile(filePath).then((content) => {

    checkFileRootAndUpdateFile(filePath, SETTINGS.release ? ReleaseParser.parse(content) : content);

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

        fs.mkdir(`${SETTINGS.buildFolder}/${filePath}`, () => {
          watch(`${filePath}`);
        });

      } else if (file.isFile()) {

        if (file.name.split('.').pop() == 'js') {
          updateFile(filePath);
        } else {

          fs.copyFile(filePath, `${SETTINGS.buildFolder}/${filePath}`, () => {
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

      fs.copyFile(filePath, `${SETTINGS.buildFolder}/${filePath}`, () => {
        console.log(`${filePath} copied.`);
      });

    }
  
  
  });

}

if (process.argv.length > 2) {

  for (let i=2; i<process.argv.length; i++) {

    if (process.argv[i] == 'release') {
      SETTINGS.release = true;
      console.log('release enabled')     
    }

  }

}

fs.mkdir(SETTINGS.buildFolder, () => {
  watch();
});

