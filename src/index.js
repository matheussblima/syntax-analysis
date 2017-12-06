import { findIndex, findLastIndex } from 'underscore';
import lexer from 'node-c-lexer';
import mainParser from './parsers/main-parser';

const code = `
  int x = 10;
  int z, y, z;
  if (x == 0) {
    int k = 99;
    if (n == 99) {
      float b = 10.1;
      if (n == 100) {
        float b = 100;
        n = x + 10 + (100 + 10 - (5 * 2 - ( 4 - 5))) + k + 100 - 20;
      }
    }
  }
  int z = 100;
`

const token = lexer.lexUnit.tokenize(code);
const errors = [];
const parseStatus = mainParser(token, errors);
const parseMessage = parseStatus ? 'Sintaxe correta!' : 'Sintaxe possui erros';
console.log(parseMessage);
errors.forEach(e => {
  console.log(`${e.message} [linha ${e.row}]`);
});
