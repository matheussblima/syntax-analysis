export const isNumbers = (value) => {
  const regex = new RegExp('^[0-9]+$');
  return regex.test(value);
};
export const isLetters = (value) => {
  const regex = new RegExp('^[a-zA-Z]+$');
  return regex.test(value);
};
export const isIdentifier = (value) => {
  const regex = new RegExp('^[A-Za-z]+$');
  const regexLetterAndNumber = RegExp('^[A-Za-z]+[A-Za-z0-9]+$');
  return regex.test(value) || regexLetterAndNumber.test(value);
};
