import { createError, findNextCloseBracketIndex } from '../utils';
import blockParser from './block-parser';


const findIntMain = (token) => {
  token.forEach((tItem, idx) => {
    if (idx + 1 < token.length && tItem.tokenClass === 'int') {

    }
  });
}



const mainParser = (token, errors) => {

  let validMain = true;

  if (token.length < 4) {
    validMain = false;
  }

  const intMainLexemes = ['int', 'main', '(', ')', '{'];

  intMainLexemes.forEach((lexeme, idx) => {
    if (lexeme !== token[idx].lexeme) {
      validMain = false;
    }
  });

  const openBlockIndex = intMainLexemes.length - 1;
  const closeBlockIndex = findNextCloseBracketIndex(token);

  if (!closeBlockIndex) {
    errors.push(createError('Chaves não estão balanceadas!', 0));
    return false;
  }

  const block = token.slice(openBlockIndex + 1, closeBlockIndex);

  if (!validMain) {
    errors.push(createError('Não identificamos a função principal (int main(){})', 0));
    return false;
  }

  return validMain && blockParser(block, errors);
}


export default mainParser;
