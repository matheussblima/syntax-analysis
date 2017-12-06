import { findIndex, findLastIndex } from 'underscore';
import lexer from 'node-c-lexer';
import mainParser from './parsers/main-parser';

const code = `
  int main() {
    int x = 10;
    int z, y, z;
    while (x == 0) {
      int k = 99;
      while (n == 99) {
        float b = 10.1;
        while (n == 100) {
          float b = 100;
          n = x + 10 + (100 + 10 - (5 * 2 - ( 4 - 5))) + k + 100 - 20;
        }
      }
    }
    int z = 100;
  }
`

const token = lexer.lexUnit.tokenize(code);
const errors = [];
const parserStatus = mainParser(token, errors);
const parseMessage = parserStatus ? 'Sintaxe correta!' : 'Sintaxe possui erros';
console.log(parseMessage);
errors.forEach(e => {
  console.log(`${e.message} [linha ${e.row}]`);
});
