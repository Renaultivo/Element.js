function insertSemiCollonAfterBracket(matche, _, _) { return matche.replace('}', '};');}function insertSemiCollonAfterScope(matche, _, _) { return matche.replace(']', '];');}function insertSemiCollonAfterParentesies(matche, _, _) { return matche.replace(')', ');');}class ReleaseParser {static parse(originalContent) {let result = originalContent;result = result.replace(/ /g, ' '); result = result.replace(/ result = result.replace(/\/\*(.*?)\*\ result = result.replace(/\/\/(.*?)\n/g, '');result = result.replace(/\s\s/g, '');result = result.replace(/\t/g, ' ');result = result.replace(/\n/g, '');result = result.replace(/else/g, 'else'); result = result.replace(/catch/g, 'catch'); result = result.replace(/}[a-zA-Z]/g, insertSemiCollonAfterBracket); result = result.replace(/}\s[a-zA-Z]/g, insertSemiCollonAfterBracket);result = result.replace(/\]\s[a-zA-Z]/g, '];'); result = result.replace(/\][a-zA-Z]/g, insertSemiCollonAfterScope);result = result.replace(/\)\s[a-zA-Z]/g, insertSemiCollonAfterParentesies); result = result.replace(/\)[a-zA-Z]/g, insertSemiCollonAfterParentesies); return result;}}exports.ReleaseParser = ReleaseParser;