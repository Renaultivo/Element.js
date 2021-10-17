function insertSemiCollonAfterBracket(matche, _, _) {
  return matche.replace('}', '};');
}

function insertSemiCollonAfterScope(matche, _, _) {
  return matche.replace(']', '];');
}

function insertSemiCollonAfterParentesies(matche, _, _) {
  return matche.replace(')', ');');
}


class ReleaseParser {

  static parse(originalContent) {

    let result = originalContent;

    // remove console messages, including semi-collon
    result = result.replace(/console.(.*?)\((.*?)\);/g, ' ');
    result = result.replace(/console.(.*?)\((.*?)\)/g, ' ');

    // remove multiple line comments ( /* */ )
    result = result.replace(/\/\*(.*?)\*\//g, '');

    // remove single line comments ( // )
    result = result.replace(/\/\/(.*?)\n/g, '');

    // remove double space
    result = result.replace(/\s\s/g, '');

    // remove tabs
    result = result.replace(/\t/g, ' ');

    // remove break likes (\n)
    /*result = result.replace(/\n/g, '');

    // adding semi-collon after "}" when it is in the end of a line
    // (pretty common on "inline-functions")
    result = result.replace(/else/g, '  else');
    result = result.replace(/catch/g, '  catch');
    result = result.replace(/}[a-zA-Z]/g, insertSemiCollonAfterBracket);
    result = result.replace(/}\s[a-zA-Z]/g, insertSemiCollonAfterBracket);

    result = result.replace(/\]\s[a-zA-Z]/g, '];');
    result = result.replace(/\][a-zA-Z]/g, insertSemiCollonAfterScope);

    result = result.replace(/\)\s[a-zA-Z]/g, insertSemiCollonAfterParentesies);
    result = result.replace(/\)[a-zA-Z]/g, insertSemiCollonAfterParentesies);*/


    return result;

  }

}

exports.ReleaseParser = ReleaseParser;