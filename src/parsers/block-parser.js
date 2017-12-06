import { contains } from 'underscore';

import whileParser from './while-parser';
import varDeclarationParser from './var-declaration-parser';
import varAssignmentParser from './var-assignment-parser';
import { findNextCloseBracketIndex, isExpressionStart, createError, VARIABLE_TYPES } from '../utils';

const blockParser = (token, errors = []) => {
  const blocks = {
    while: [],
    varDeclarations: [],
    varAssignments: [],
  };
  // Separando o token por tipo de parser
  while (token.length !== 0) {
    // Empilhando todos os blocos de código do tipo "while"
    if (token[0].lexeme === 'while') {
      const endIfIndex = findNextCloseBracketIndex(token);
      if (!endIfIndex) {
        return;
      }
      const whileBlock = token.slice(0, endIfIndex + 1);
      blocks.while.push(whileBlock);
      token = token.slice(endIfIndex + 1);
    } else if (contains(VARIABLE_TYPES, token[0].lexeme)) { // Buscando por declarações de variáveis
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
    } else if (token[0].tokenClass === 'IDENTIFIER') { // Buscando por atribuição de variáveis
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
  // Executando o parser 'while' para todos os blocos 'while' previamente empilhados (Recursivamente)
  let parserStatus = true;
  blocks.while.forEach(whileBlock => {
    parserStatus = parserStatus && whileParser(whileBlock, {
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

  // Executando o parser 'varAssignments' para todos os blocos de atribuição de variável
  blocks.varAssignments.forEach(block => {
    parserStatus = parserStatus && varAssignmentParser(block, {
      errors,
    });
  });

  return parserStatus;
}

export default blockParser;
