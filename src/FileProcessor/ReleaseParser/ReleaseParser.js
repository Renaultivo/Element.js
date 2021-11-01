function insertSemiCollonAfterBracket(matche, _, _) {
  return matche.replace('}', '};');
}

function insertSemiCollonAfterScope(matche, _, _) {
  return matche.replace(']', '];');
}

function insertSemiCollonAfterParentesies(matche, _, _) {
  return matche.replace(')', ');');
}

function fixImports(match, a, b) {

  if (match.indexOf('.js') == -1) {
    match = match.replace(/"\n/gm)
  }

  return match;

}

class ReleaseParser {

  static parse(originalContent) {

    let result = originalContent;

    // remove console messages
    result = result.replace(/console.(.*?)\((.*?)\);/g, ' ');
    result = result.replace(/console.(.*?)\((.*?)\)/g, ' ');

    // remove multiple line comments ( /* */ )
    result = result.replace(/\/\*(.*?)\*\//g, '');

    // remove single line comments ( // )
    result = result.replace(/\n\/\/(.*?)\n/g, '');
    result = result.replace(/\s\/\/(.*?)\n/g, '');

    // remove double space
    result = result.replace(/\s\s/g, '');

    // remove tabs
    result = result.replace(/\t/g, ' ');

    // remove break likes (\n)
    result = result.replace(/\n/g, '');

    // adding semi-collon after "}" when it is in the end of a line
    // (pretty common on "inline-functions")
    result = result.replace(/else/g, '  else');
    result = result.replace(/catch/g, '  catch');
    result = result.replace(/}[a-zA-Z]/g, insertSemiCollonAfterBracket);
    result = result.replace(/}\s[a-zA-Z]/g, insertSemiCollonAfterBracket);

    result = result.replace(/\]\s[a-zA-Z]/g, '];');
    result = result.replace(/\][a-zA-Z]/g, insertSemiCollonAfterScope);

    result = result.replace(/\)\s[a-zA-Z]/g, insertSemiCollonAfterParentesies);
    result = result.replace(/\)[a-zA-Z]/g, insertSemiCollonAfterParentesies);

    return result;

  }

}

exports.ReleaseParser = ReleaseParser;