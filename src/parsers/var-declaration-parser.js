import { contains } from 'underscore';
import { createError, VARIABLE_TYPES } from '../utils';

const isIfExpressionValid = (ifExpressionToken) => true;


const varDeclarationParser = (token, { errors }) => {
  if (token.length === 0) {
    return true;
  }

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

  // Removendo o tipo da variável e o ponto-virgula para analisarmos se os identificadores e variaveis estão válidos
  const cleanToken = token.slice(1, token.length - 1);
  let isValid = true;
  cleanToken.forEach((tItem, idx) => {
    if (tItem.tokenClass === 'IDENTIFIER' && idx < cleanToken.length - 1) {
      const tokenClass = cleanToken[idx + 1].tokenClass;
      if (idx < cleanToken.length && (tokenClass !== '=' && tokenClass !== ',')) {
        isValid = false;
      }
    }
    if (tItem.tokenClass === ',') {
      if (idx < cleanToken.length - 1) {
        const tokenClass = cleanToken[idx + 1].tokenClass;
        if (idx < cleanToken.length && (tokenClass !== 'IDENTIFIER')) {
          isValid = false;
        }
      } else {
        isValid = false;
      }
    }
    if (tItem.tokenClass === 'CONSTANT' && idx < cleanToken.length - 1) {
      const tokenClass = cleanToken[idx + 1].tokenClass;
      if (idx < cleanToken.length && (tokenClass !== ',')) {
        isValid = false;
      }
    }
  });
  if (!isValid) {
    errors.push(createError('Não conseguimos identificar a expressão', token[0].row));
  }
  return isValid;
}


export default varDeclarationParser;
