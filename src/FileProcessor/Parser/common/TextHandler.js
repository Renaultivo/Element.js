function skipEmptyScapes(buffer, index) {

  for (; buffer[index] == ' '; index++);

  return index;

}

exports.skipEmptyScapes = skipEmptyScapes;