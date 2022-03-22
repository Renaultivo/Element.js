function State(fileContent, definedStates) {

  definedStates.forEach((state) => {

    fileContent = fileContent.replace(
      new RegExp(`[let|var](.*?)${state}(.*?)=(.*?)[\n|;]`, 'gm'),
      (value) => {
        return value + `\n${value.split(' ')[0]} __obsarvable_${state}_Nodes = [];` + 
        `\nfunction $update_${state}_() {` +
          `__obsarvable_${state}_Nodes.forEach((node) => {` +
            `node.nodeValue=${state};` +
            `});` +
        `}`;
      }
    );

    fileContent = fileContent.replace(
      new RegExp(`${state}\\,`, 'gm'),
      `(() => {` +
        `__obsarvable_${state}_Nodes.push(` +
        `document.createTextNode(${state})` +
        `);` +
        `return __obsarvable_${state}_Nodes[__obsarvable_${state}_Nodes.length-1];` +
      `})(),`
    );

    let firstOccurrence = true;

    fileContent = fileContent.replace(
      new RegExp(`${state} =(.*?)[\n|;]`, 'gm'),
      (value) => {

        if (firstOccurrence) {
          firstOccurrence = false;
          return value;
        }

        return value + `\n$update_${state}_();`
      }
    );

    fileContent = fileContent.replace(
      new RegExp(`(${state})((\\+\\+)|(\\-\\-))[\n|;]`, 'gm'),
      (value) => {
        return value + `\n$update_${state}_();`;
      }
    );

  });

  return fileContent;

}


exports.State = State;
