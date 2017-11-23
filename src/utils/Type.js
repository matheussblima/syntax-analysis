const primitiveTypes = (value) => {
  const regexInt = new RegExp('^int$');
  const regexFloat = new RegExp('^float$');
  return regexInt.test(value) || regexFloat.test(value);
};

export default value => primitiveTypes(value);
