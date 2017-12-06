import { createError } from '../utils';

const isIfExpressionValid = (ifExpressionToken) => true;

const ifParser = (token, { parsers: { blockParser }, errors }) => {
  if (token.length === 0) {
    return true;
  }

  let i;
  let openPIndex, closePIndex, openBIndex, closeBIndex;
  if (token[0].lexeme !== 'if') {
    errors.push(createError("Erro: está faltando um 'if'", token[0].row));
    return;
  }
  if (token[1].lexeme !== '(') {
    errors.push(createError("Erro: está faltando um '('", token[1].row));
    return;
  }
  openPIndex = 1;


  // Encontrando o parenteses de fechamento e a chave de abertura
  i = 0;
  while (i < token.length && !closePIndex) {
    if (token[i].lexeme === '{') {
      errors.push(createError("Erro: está faltando um ')'", token[i].row));
      return;
    }
    if (token[i].lexeme === ')' && token[i + 1]) {
      if (token[i + 1].lexeme === '{') {
        closePIndex = i;
        openBIndex = i + 1;
      } else {
        errors.push(createError("Erro: está faltando um '{' após a expressao do if", token[i].row));
        return;
      }
    }
    i++;
  }


  // Encontrando o fechamento do parenteses
  if (!closePIndex) {
    errors.push(createError("Erro: está faltando um ')' logo após o if", token[0].row));
    return;
  }

  // Encontrando a chave de abertura
  if (!openBIndex) {
    errors.push(createError("Erro: está faltando um '{' após a expressao do if", token[0].row));
    return;
  }

  // Encontrando a chave de fechamento
  i = token.length - 1;
  while (i >= 0 && !closeBIndex) {
    if (token[i].lexeme === '}') {
      closeBIndex = i;
    }
    i--;
  }

  if (!closeBIndex) {
    errors.push(createError("Erro: está faltando um '}' após a expressao do if", token[0].row));
    return;
  }

  const ifExpressionToken = token.slice(openPIndex + 1, closePIndex);
  const ifBlockToken = token.slice(openBIndex + 1, closeBIndex);


  if (!isIfExpressionValid(ifExpressionToken)) {
    errors.push(createError("Erro: a condição booleana do if não é válida", token[0].row));
    return;
  }
  return !!blockParser(ifBlockToken, errors);
}


export default ifParser;
