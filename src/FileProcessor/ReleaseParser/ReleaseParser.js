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
    result = result.replace(/\/\/(.*?)\n/g, '');

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

    result = result.replace(/}[a-zA-Z]/g, (matche, a, ) => {
      return matche.replace('}', '};');
    });

    result = result.replace(/}\s[a-zA-Z]/g, (matche, a, ) => {
      return matche.replace('}', '};');
    });

    result = result.replace(/\]\s[a-zA-Z]/g, '];');

    result = result.replace(/\][a-zA-Z]/g, (matche, a, ) => {
      return matche.replace(']', '];');
    });

    result = result.replace(/\)\s[a-zA-Z]/g, (matche, a, ) => {
      return matche.replace(')', ');');
    });

    result = result.replace(/\)[a-zA-Z]/g, (matche, a, ) => {
      return matche.replace(')', ');');
    });

    result = result.replace(/\}\;(.*?)[from|const|let|var]/g, (matche, a, ) => {
      return matche.replace('};', '} ');
    });

    result = result.replace(/\};(\s*)\}/g, (matche, a, ) => {
      return matche.replace('};', '}');
    });

    result = result.replace(/\}(\s*)function/g, (matche, a, ) => {
      return matche.replace('}', '};');
    });

    result = result.replace(/\}(\s*)[a-zA-Z]/g, (matche, a, ) => {
      return matche.replace('}', '};');
    });

    result = result.replace(/\}\;(\s*)else/g, (matche, a, ) => {
      return matche.replace('};', '}');
    });

    result = result.replace(/\}\;(\s*)catch/g, (matche, a, ) => {
      return matche.replace('};', '}');
    });

    result = result.replace(/\}\;(\s*)from/g, (matche, a, ) => {
      return matche.replace('};', '}');
    });

    result = result.replace(/\/\*(.*?)\*\//g, (matche, a, ) => {
      return '';
    });

    // fix it
    result = result.replace(/\}(\s*)if/g, (matche, a, ) => {
      return matche.replace('}', '};');
    });


    return result;

  }

}

exports.ReleaseParser = ReleaseParser;