export function capitalizeFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
}

export function capitalizeFirstLetterInSentence(input) {
  const arr = input.split(" ");
  const result = arr.map((str) => capitalizeFirstLetter(str));
  return result.join(" ");
}
