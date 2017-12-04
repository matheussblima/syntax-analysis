import { findIndex, findLastIndex } from 'underscore';
import lexer from 'node-c-lexer';


const isIfExpressionValid = (ifExpressionToken) => true;


const findNextCloseBracketIndex = (token) => {
  let openBracketCount = 0;
  let closeBracketCount = 0;
  let closeBracketIndex = null;
  token.forEach((t, idx) => {
    if (t.lexeme === '{') {
      openBracketCount++;
    } else if (t.lexeme === '}') {
      closeBracketCount++;
    }
    if (closeBracketIndex === null && openBracketCount === closeBracketCount && openBracketCount !== 0) {
      closeBracketIndex = idx;
    }
  });
  if (openBracketCount !== closeBracketCount) {
    return null;
    console.log('Erro! Chaves não estão balanceadas!');
  }
  if (closeBracketIndex === null && openBracketCount == 0) {
    console.log('Não há abertura de chaves para o if');
  }
  return closeBracketIndex;
}

const mainParser = (token) => {

  const blocks = {
    if: [],
  };

  while (token.length !== 0) {
    if (token[0].lexeme === 'if') {
      const endIfIndex = findNextCloseBracketIndex(token);
      if (!endIfIndex) {
        return;
      }
      const ifBlock = token.slice(0, endIfIndex + 1);
      blocks.if.push(ifBlock);
      token = token.slice(endIfIndex + 1);
    }
  }

  let parserStatus = true;
  blocks.if.forEach(ifBlock => {
    parserStatus = parserStatus && parseIf(ifBlock);
  });

  return parserStatus;

}



const parseIf = (token) => {
  if (token.length === 0) {
    return true;
  }

  let i;
  let openPIndex, closePIndex, openBIndex, closeBIndex;
  if (token[0].lexeme !== 'if') {
    console.log('Erro: está faltando um if');
    return;
  }
  if (token[1].lexeme !== '(') {
    console.log('Erro: está faltando um ( após o if');
    return;
  }
  openPIndex = 1;


  // Encontrando o parenteses de fechamento e a chave de abertura
  i = 0;
  while (i < token.length && !closePIndex) {
    if (token[i].lexeme === '{') {
      console.log('Erro: está faltando um ) após o if');
      return;
    }
    if (token[i].lexeme === ')' && token[i + 1]) {
      if (token[i + 1].lexeme === '{') {
        closePIndex = i;
        openBIndex = i + 1;
      } else {
        console.log('Erro: está faltando um { após a expressao do if');
        return;
      }
    }
    i++;
  }


  // Encontrando o fechamento do parenteses
  if (!closePIndex) {
    console.log('Erro: está faltando um ) após o if');
    return;
  }

  // Encontrando a chave de abertura
  if (!openBIndex) {
    console.log('Erro: está faltando um { após a expressao do if');
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
    console.log('Erro: está faltando um } após a expressao do if');
    return;
  }

  const ifExpressionToken = token.slice(openPIndex + 1, closePIndex);
  const ifBlockToken = token.slice(openBIndex + 1, closeBIndex);


  if (!isIfExpressionValid(ifExpressionToken)) {
    console.log('Erro: a condição booleana do if não é válida');
    return;
  }
  return !!mainParser(ifBlockToken);
}


const code = `
  if (A === '0' && b = 10) {
    if (b==10) {
    }
  }
  if (Z == 9) {
    if (y == 20) {
      if (y == 30) {

      }
    }
  }
`;

const token = lexer.lexUnit.tokenize(code);

// console.log(parseIf(token));
console.log(mainParser(token));
// console.log(findCloseBracketIndex(token));
