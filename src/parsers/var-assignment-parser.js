import { contains } from 'underscore';
import { createError, VARIABLE_TYPES } from '../utils';

import expressionParser from './expression-parser';

const isIfExpressionValid = (ifExpressionToken) => true;


const varAssignmentParser = (token, { errors }) => {
  if (token.length === 0) {
    return true;
  }

  let i;
  if (token[0].tokenClass !== 'IDENTIFIER') {
    errors.push(createError("Não identificamos o commando", token[0].row));
    return false;
  }
  console.log(token[1].tokenClass);
  if (token[1].tokenClass !== '=') {
    errors.push(createError("Não identificamos o commando", token[0].row));
    return false;
  }
  if (token[token.length - 1].lexeme !== ';') {
    errors.push(createError("Está faltando um ';'", token[token.length - 1].row));
    return false;
  }

  // Removendo o tipo da variável e o ponto-virgula para analisarmos se os identificadores e variaveis estão válidos
  let isValid = true;
  token.forEach((tItem, idx) => {
    // if (tItem.tokenClass === 'IDENTIFIER' && idx < token.length - 1) {
    //   const tokenClass = token[idx + 1].tokenClass;
    //   if (idx < token.length && (tokenClass !== '=' && tokenClass !== 'INC_OP' && tokenClass !== 'DEC_OP')) {
    //     isValid = false;
    //   }
    // }
    // if (tItem.tokenClass === 'INC_OP' && idx < token.length - 1) {
    //   const tokenClass = token[idx + 1].tokenClass;
    //   if (idx < token.length && (tokenClass !== ';')) {
    //     isValid = false;
    //   }
    // }
    // if (tItem.tokenClass === 'DEC_OP' && idx < token.length - 1) {
    //   const tokenClass = token[idx + 1].tokenClass;
    //   if (idx < token.length && (tokenClass !== ';')) {
    //     isValid = false;
    //   }
    // }
    if (tItem.tokenClass === '=' && idx < token.length - 1) {
      const expressionToken = token.slice(idx + 1, token.length - 1);
      isValid = expressionParser(expressionToken, { errors });
      console.log(isValid);
    }
  });
  if (!isValid) {
    errors.push(createError('Não conseguimos identificar a expressão', token[0].row));
  }
  return isValid;
}


export default varAssignmentParser;
