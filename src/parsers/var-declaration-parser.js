import { contains } from 'underscore';
import { createError, VARIABLE_TYPES } from '../utils';
import expressionParser from './expression-parser';


const varDeclarationParser = (token, { errors }) => {
  if (token.length === 0) {
    return true;
  }

  const expressions = [];

  let i;
  let openPIndex, closePIndex, openBIndex, closeBIndex;
  if (!contains(VARIABLE_TYPES, token[0].lexeme)) {
    errors.push(createError("Não identificamos o tipo de variável", token[0].row));
    return false;
  }
  if (token[token.length - 1].lexeme !== ';') {
    errors.push(createError("Está faltando um ';'", token[token.length - 1].row));
    return false;
  }

  // Removendo o tipo da variável e ponto-virgula para analisarmos se os identificadores e variaveis estão válidos
  const cleanToken = token.slice(1, token.length - 1);
  if (cleanToken[0].tokenClass !== 'IDENTIFIER') {
    errors.push(createError('Nome de variável inválido', token[0].row));
    return false;
  }

  let isValid = true;
  cleanToken.forEach((tItem, idx) => {
    if (tItem.tokenClass === 'IDENTIFIER' && idx < cleanToken.length - 1) {
      const tokenClass = cleanToken[idx + 1].tokenClass;
      if (idx < cleanToken.length && (tokenClass !== '=' && tokenClass !== ',')) {
        isValid = false;
      }
    }
    if (tItem.tokenClass === '=') {
      if (idx >= cleanToken.length - 1) {
        isValid = false;
        return;
      }
      const tokenClass = cleanToken[idx + 1].tokenClass;
      let expressionEndIndex = null;
      cleanToken.forEach((i, endIdx) => {
        if (!expressionEndIndex && endIdx > idx) {
          if (i.tokenClass === ',') {
            expressionEndIndex = endIdx;
          } else if (endIdx === cleanToken.length - 1) {
            expressionEndIndex = endIdx + 1;
          }
        }
      });
      const expression = cleanToken.slice(idx + 1, expressionEndIndex);
      expressions.push(expression);
    }
  });
  if (!isValid) {
    errors.push(createError('Não conseguimos identificar a expressão', token[0].row));
  }

  let isExpressionsValids = true;
  expressions.forEach(e => {
    isExpressionsValids = isExpressionsValids && expressionParser(e, { errors });
  });

  return isValid && isExpressionsValids;
}


export default varDeclarationParser;
