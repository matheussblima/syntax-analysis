import { contains } from 'underscore';
import { createError, findNextCloseParenthesesIndex } from "../utils";

const hasParentheses = (token) => {
  let hasP = false;
  token.forEach((tItem, idx) => {
    if (tItem.tokenClass === '(') hasP = true;
  });
  return hasP;
}

const extractNextBlock = (token) => {
  let pBlock = null;
  let openP = null;
  let closeP = null;

  // Buscando proxima abertura de parenteses
  let idx = 0;
  while (!openP && idx < token.length) {
    if (token[idx].tokenClass === '(') {
      openP = idx;
    }
    idx++;
  }

  if (openP) {
    closeP = findNextCloseParenthesesIndex(token, openP);
  }

  if (!closeP) {
    // Parênteses não estão balanceados
    return { cleanToken: null, pBlock: null };
  }
  pBlock = token.slice(openP + 1, closeP);

  let tokenLeft = token.slice(0, openP);
  let tokenRight = token.slice(closeP + 1);

  // Criando um identificador auxiliar para ajudar na recursividade dos parênteses
  const auxIdentifier = {
    lexeme: 'N',
    row: token[openP].row,
    col: token[openP].col,
    tokenClass: 'IDENTIFIER',
    parent: null,
    children: null
  }

  tokenLeft.push(auxIdentifier);
  const cleanToken = tokenLeft.concat(tokenRight);
  return {
    cleanToken,
    pBlock,
  }
}


const expressionParser = (token, { errors }) => {
  const pBlocks = [];

  while (hasParentheses(token)) {
    const { cleanToken, pBlock } = extractNextBlock(token);
    if (cleanToken === null) {
      // Inválido, já que os parênteses não estão balanceados
      return false;
    }
    token = cleanToken;
    pBlocks.push(pBlock);
  }

  let isTokenValid = true;
  token.forEach((tItem, idx) => {
    if (contains(['CONSTANT', 'IDENTIFIER'], tItem.tokenClass) && idx < token.length - 1) {
      const tokenClass = token[idx + 1].tokenClass;
      if (idx < token.length && (!contains(['+', '-', '*', '/'], tokenClass))) {
        isTokenValid = false;
      }
    }
    if (contains(['+', '-', '*', '/'], tItem.tokenClass)) {
      if (idx < token.length - 1) {
        const tokenClass = token[idx + 1].tokenClass;
        if (idx < token.length && (!contains(['CONSTANT', 'IDENTIFIER'], tokenClass))) {
          errors.push(createError('Término de expressão inesperado'));
          isTokenValid = false;
        }
      } else {
        errors.push(createError('Término de expressão inesperado'));
        isTokenValid = false;
      }
    }
  });


  let isBlocksValids = true;
  pBlocks.forEach((block, idx) => {
    isBlocksValids = isBlocksValids && expressionParser(block, { errors });
  });


  return isTokenValid && isBlocksValids;
}


export default expressionParser;
