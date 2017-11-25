import lexer from 'node-c-lexer';


const code = `
  int x = 900;
`;

const token = lexer.lexUnit.tokenize(code);
console.log(token);
