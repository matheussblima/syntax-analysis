import { createError } from '../utils';

import expressionParser from './expression-parser';

const isWhileExpressionValid = (whileExpressionToken) => true;

const whileParser = (token, { parsers: { blockParser }, errors }) => {
  if (token.length === 0) {
    return true;
  }

  let i;
  let openPIndex, closePIndex, openBIndex, closeBIndex;
  if (token[0].lexeme !== 'while') {
    errors.push(createError("Erro: está faltando um 'while'", token[0].row));
    return false;
  }
  if (token[1].lexeme !== '(') {
    errors.push(createError("Erro: está faltando um '('", token[1].row));
    return false;
  }
  openPIndex = 1;


  // Encontrando o parenteses de fechamento e a chave de abertura
  i = 0;
  while (i < token.length && !closePIndex) {
    if (token[i].lexeme === '{') {
      errors.push(createError("Erro: está faltando um ')'", token[i].row));
      return false;
    }
    if (token[i].lexeme === ')' && token[i + 1]) {
      if (token[i + 1].lexeme === '{') {
        closePIndex = i;
        openBIndex = i + 1;
      } else {
        errors.push(createError("Erro: está faltando um '{' após a expressao do if", token[i].row));
        return false;
      }
    }
    i++;
  }


  // Encontrando o fechamento do parenteses
  if (!closePIndex) {
    errors.push(createError("Erro: está faltando um ')' logo após o while", token[0].row));
    return false;
  }

  // Encontrando a chave de abertura
  if (!openBIndex) {
    errors.push(createError("Erro: está faltando um '{' após a expressao do while", token[0].row));
    return false;
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
    errors.push(createError("Erro: está faltando um '}' após a expressao do while", token[0].row));
    return false;
  }

  const whileExpressionToken = token.slice(openPIndex + 1, closePIndex);
  const ifBlockToken = token.slice(openBIndex + 1, closeBIndex);


  if (!expressionParser(whileExpressionToken, { errors })) {
    return false;
  }
  return !!blockParser(ifBlockToken, errors);
}


export default whileParser;
