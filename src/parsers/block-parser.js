import { contains } from 'underscore';

import ifParser from './if-parser';
import varDeclarationParser from './var-declaration-parser';
import varAssignmentParser from './var-assignment-parser';
import { findNextCloseBracketIndex, isExpressionStart, createError, VARIABLE_TYPES } from '../utils';

const blockParser = (token, errors = []) => {
  const blocks = {
    if: [],
    varDeclarations: [],
    varAssignments: [],
  };
  // Separando o token por tipo de parser
  while (token.length !== 0) {
    if (token[0].lexeme === 'if') {
      const endIfIndex = findNextCloseBracketIndex(token);
      if (!endIfIndex) {
        return;
      }
      const ifBlock = token.slice(0, endIfIndex + 1);
      blocks.if.push(ifBlock);
      token = token.slice(endIfIndex + 1);
    } else if (contains(VARIABLE_TYPES, token[0].lexeme)) {
      let startVarDeclarationIndex = 0;
      let endVarDeclarationIndex;
      token.forEach((tokenItem, idx) => {
        if (!endVarDeclarationIndex && idx > 0) { // Pega o proximo inicio de expressão
          const isStart = isExpressionStart(tokenItem);
          const isSemiColon = tokenItem.tokenClass === ';';
          if (isSemiColon) {
            endVarDeclarationIndex = idx;
          } else if (isStart) {
            endVarDeclarationIndex = idx - 1;
          } else if (idx === token.length - 1) {
            endVarDeclarationIndex = idx;
          }
        }
      });
      const varDeclarationBlock = token.slice(0, endVarDeclarationIndex + 1);
      blocks.varDeclarations.push(varDeclarationBlock);
      token = token.slice(endVarDeclarationIndex + 1);
    } else if (token[0].tokenClass === 'IDENTIFIER') {
      let startIndex = 0;
      let endIndex;
      token.forEach((tokenItem, idx) => {
        if (!endIndex && idx > 0) { // Pega o proximo inicio de expressão
          const isStart = isExpressionStart(tokenItem);
          const isSemiColon = tokenItem.tokenClass === ';';
          if (isSemiColon) {
            endIndex = idx;
          } else if (isStart) {
            endIndex = idx - 1;
          } else if (idx === token.length - 1) {
            endIndex = idx;
          }
        }
      });
      const block = token.slice(0, endIndex + 1);
      blocks.varAssignments.push(block);
      token = token.slice(endIndex + 1);
    }
    else {
      errors.push(createError('Não foi possível identificar a expressão', token[0].row));
      return;
    }
  }
  // Executando o parser 'if' para todos os blocos 'ifs' previamente separados (Recursivamente)
  let parserStatus = true;
  blocks.if.forEach(ifBlock => {
    parserStatus = parserStatus && ifParser(ifBlock, {
      parsers: {
        blockParser,
      },
      errors,
    });
  });

  // Executando o parser 'varDeclaration' para todos os blocos de declaração de variável
  blocks.varDeclarations.forEach(varDeclarationBlock => {
    parserStatus = parserStatus && varDeclarationParser(varDeclarationBlock, {
      errors,
    });
  });

  // Executando o parser 'varDeclaration' para todos os blocos de declaração de variável
  blocks.varAssignments.forEach(block => {
    parserStatus = parserStatus && varAssignmentParser(block, {
      errors,
    });
  });

  return parserStatus;
}

export default blockParser;