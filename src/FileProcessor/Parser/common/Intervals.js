export function getTextUntil(buffer, index, delimiter) {

  let text = '';

  for (; buffer[index] != delimiter; index++) {
    text += buffer[index];
  }

  return {
    text,
    index
  };

}
