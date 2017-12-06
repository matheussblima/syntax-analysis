import { findIndex, findLastIndex } from 'underscore';
import lexer from 'node-c-lexer';
import mainParser from './parsers/main-parser';


// const code = `
//   if (A === '0' && b = 10) {
//     if (b==10) {
//     }
//   }
//   if (Z == 9) {
//     if (y == 20) {
//       if (y == 30) {

//       }
//     }
//   }
// `;

// const code = `
//   if (A === '0' && b = 10) {
//     if (b==10) {
//       // int x = 10;
//     }
//   }
//   if (Z == 9) {
//     if (y == 20) {
//       if (y == 30) {

//       }
//     }
//   }
// `;


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

// console.log(token);

// console.log(parseIf(token));
const errors = [];
console.log(mainParser(token, errors));

errors.forEach(e => {
  console.log(`${e.message} [linha ${e.row}]`);
});
